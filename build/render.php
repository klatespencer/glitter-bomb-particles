<?php
/**
 * Render callback for Glitter Bomb block
 * 
 * Security: This file implements comprehensive input validation, sanitization,
 * and output escaping to prevent XSS, injection attacks, and other vulnerabilities.
 * 
 * @see https://github.com/WordPress/gutenberg/blob/trunk/docs/reference-guides/block-api/block-metadata.md#render
 * @package GlitterBomb
 * @version 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Sanitize and validate color hex value
 * 
 * Security: Validates color format to prevent XSS through color attributes
 *
 * @param string $color The color value to validate
 * @param string $default The default color to return if invalid
 * @return string Validated hex color
 */
if ( ! function_exists( 'glitter_bomb_sanitize_color' ) ) {
	function glitter_bomb_sanitize_color( $color, $default = '#ff69b4' ) {
		// Remove any whitespace and ensure string type
		$color = trim( (string) $color );
		
		// Validate hex color format (#RGB or #RRGGBB)
		// This regex prevents XSS by ensuring only valid hex colors
		if ( preg_match( '/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', $color ) ) {
			return $color;
		}
		
		// Return safe default if validation fails
		return $default;
	}
}

/**
 * Sanitize and validate string from predefined list
 * 
 * Security: Whitelist validation prevents unexpected values
 *
 * @param string $value The value to validate
 * @param array $allowed The allowed values
 * @param string $default The default value
 * @return string Validated string
 */
if ( ! function_exists( 'glitter_bomb_sanitize_enum' ) ) {
	function glitter_bomb_sanitize_enum( $value, $allowed, $default ) {
		// Ensure string type and trim whitespace
		$value = trim( (string) $value );
		
		// Strict comparison for security
		if ( in_array( $value, $allowed, true ) ) {
			return $value;
		}
		
		// Return safe default if not in whitelist
		return $default;
	}
}

/**
 * Sanitize and validate numeric value with bounds
 * 
 * Security: Enforces min/max bounds to prevent resource exhaustion
 *
 * @param mixed $value The value to validate
 * @param float $min Minimum allowed value
 * @param float $max Maximum allowed value
 * @param float $default Default value
 * @return float Validated number
 */
if ( ! function_exists( 'glitter_bomb_sanitize_number' ) ) {
	function glitter_bomb_sanitize_number( $value, $min, $max, $default ) {
		// Type cast to float for numeric validation
		$value = floatval( $value );
		
		// Check for NaN or Infinity
		if ( ! is_finite( $value ) ) {
			return $default;
		}
		
		// Enforce bounds to prevent resource exhaustion
		if ( $value < $min || $value > $max ) {
			return $default;
		}
		
		return $value;
	}
}

// =======================
// INPUT VALIDATION
// =======================

// Wrap in closure to keep variables out of global scope.
( function ( $attributes ) {

// Validate experience mode (whitelist)
$experience_mode = glitter_bomb_sanitize_enum(
	isset( $attributes['experienceMode'] ) ? $attributes['experienceMode'] : 'particle-field',
	array( 'sprinkle-trail', 'particle-field' ),
	'particle-field'
);

// Validate color palettes (whitelist)
$color_palette = glitter_bomb_sanitize_enum(
	isset( $attributes['colorPalette'] ) ? $attributes['colorPalette'] : 'rainbow-cycling',
	array( 'rainbow-cycling', 'metallic', 'neutral-spectrum', 'warm-sunset', 'cool-ocean', 'custom' ),
	'rainbow-cycling'
);

$field_color_palette = glitter_bomb_sanitize_enum(
	isset( $attributes['fieldColorPalette'] ) ? $attributes['fieldColorPalette'] : 'metallic',
	array( 'rainbow-cycling', 'metallic', 'neutral-spectrum', 'warm-sunset', 'cool-ocean', 'custom' ),
	'metallic'
);

// Validate display behavior (whitelist)
$display_behavior = glitter_bomb_sanitize_enum(
	isset( $attributes['displayBehavior'] ) ? $attributes['displayBehavior'] : 'compact',
	array( 'scattered', 'compact' ),
	'compact'
);

// Validate button position (whitelist)
$button_position = glitter_bomb_sanitize_enum(
	isset( $attributes['buttonPosition'] ) ? $attributes['buttonPosition'] : 'bottom-right',
	array( 'top-left', 'top-right', 'bottom-left', 'bottom-right' ),
	'bottom-right'
);

// Validate numeric values with strict bounds (DoS prevention)
$particle_opacity = glitter_bomb_sanitize_number(
	isset( $attributes['particleOpacity'] ) ? $attributes['particleOpacity'] : 0.9,
	0.1,
	1.0,
	0.9
);

$particle_size = glitter_bomb_sanitize_number(
	isset( $attributes['particleSize'] ) ? $attributes['particleSize'] : 10,
	4,
	30,
	10
);

$particle_size_mobile = glitter_bomb_sanitize_number(
	isset( $attributes['particleSizeMobile'] ) ? $attributes['particleSizeMobile'] : 7.5,
	3,
	20,
	7.5
);

$field_particle_size = glitter_bomb_sanitize_number(
	isset( $attributes['fieldParticleSize'] ) ? $attributes['fieldParticleSize'] : 6,
	2,
	12,
	6
);

$field_particle_size_mobile = glitter_bomb_sanitize_number(
	isset( $attributes['fieldParticleSizeMobile'] ) ? $attributes['fieldParticleSizeMobile'] : 3,
	1.5,
	8,
	3
);

$animation_duration = glitter_bomb_sanitize_number(
	isset( $attributes['animationDuration'] ) ? $attributes['animationDuration'] : 1500,
	500,
	5000,
	1500
);

// Enforce maximum particle limits to prevent resource exhaustion
$max_particles = glitter_bomb_sanitize_number(
	isset( $attributes['maxParticles'] ) ? $attributes['maxParticles'] : 50,
	10,
	100,
	50
);

$field_particle_count = glitter_bomb_sanitize_number(
	isset( $attributes['fieldParticleCount'] ) ? $attributes['fieldParticleCount'] : 200,
	50,
	500,
	200
);

$field_mouse_attraction = glitter_bomb_sanitize_number(
	isset( $attributes['fieldMouseAttraction'] ) ? $attributes['fieldMouseAttraction'] : 0.5,
	0,
	1,
	0.5
);

$field_spread_strength = glitter_bomb_sanitize_number(
	isset( $attributes['fieldSpreadStrength'] ) ? $attributes['fieldSpreadStrength'] : 0.3,
	0,
	1,
	0.3
);

// Validate colors (XSS prevention)
$custom_color = glitter_bomb_sanitize_color(
	isset( $attributes['customColor'] ) ? $attributes['customColor'] : '#ff69b4',
	'#ff69b4'
);

$enable_button_text_color = glitter_bomb_sanitize_color(
	isset( $attributes['enableButtonTextColor'] ) ? $attributes['enableButtonTextColor'] : '#000000',
	'#000000'
);

$enable_button_bg_color = glitter_bomb_sanitize_color(
	isset( $attributes['enableButtonBackgroundColor'] ) ? $attributes['enableButtonBackgroundColor'] : '#D4AF37',
	'#D4AF37'
);

$enable_button_gradient_start = glitter_bomb_sanitize_color(
	isset( $attributes['enableButtonGradientStart'] ) ? $attributes['enableButtonGradientStart'] : '#D4AF37',
	'#D4AF37'
);

$enable_button_gradient_end = glitter_bomb_sanitize_color(
	isset( $attributes['enableButtonGradientEnd'] ) ? $attributes['enableButtonGradientEnd'] : '#B87333',
	'#B87333'
);

$disable_button_text_color = glitter_bomb_sanitize_color(
	isset( $attributes['disableButtonTextColor'] ) ? $attributes['disableButtonTextColor'] : '#000000',
	'#000000'
);

$disable_button_bg_color = glitter_bomb_sanitize_color(
	isset( $attributes['disableButtonBackgroundColor'] ) ? $attributes['disableButtonBackgroundColor'] : '#E5E4E2',
	'#E5E4E2'
);

$disable_button_gradient_start = glitter_bomb_sanitize_color(
	isset( $attributes['disableButtonGradientStart'] ) ? $attributes['disableButtonGradientStart'] : '#E5E4E2',
	'#E5E4E2'
);

$disable_button_gradient_end = glitter_bomb_sanitize_color(
	isset( $attributes['disableButtonGradientEnd'] ) ? $attributes['disableButtonGradientEnd'] : '#C0C0C0',
	'#C0C0C0'
);

// Validate text fields with length limits and sanitization (XSS prevention)
$enable_button_text = isset( $attributes['enableButtonText'] ) 
	? esc_html( substr( trim( (string) $attributes['enableButtonText'] ), 0, 100 ) )
	: '✨ Enable Sparkles';

$disable_button_text = isset( $attributes['disableButtonText'] )
	? esc_html( substr( trim( (string) $attributes['disableButtonText'] ), 0, 100 ) )
	: '✨ Disable Sparkles';

$field_particle_style = glitter_bomb_sanitize_enum(
	isset( $attributes['fieldParticleStyle'] ) ? $attributes['fieldParticleStyle'] : 'glitter',
	array( 'glitter', 'pride-confetti', 'love-bomb', 'snow' ),
	'glitter'
);

$sprinkle_style = glitter_bomb_sanitize_enum(
	isset( $attributes['sprinkleStyle'] ) ? $attributes['sprinkleStyle'] : 'particles',
	array( 'particles', 'emoji' ),
	'particles'
);

$sprinkle_emoji_raw = isset( $attributes['sprinkleEmoji'] ) ? $attributes['sprinkleEmoji'] : '✨';
$sprinkle_emoji = mb_substr( sanitize_text_field( $sprinkle_emoji_raw ), 0, 8 );
if ( empty( $sprinkle_emoji ) ) {
	$sprinkle_emoji = '✨';
}

// Validate boolean values (type safety)
$enabled_by_default = isset( $attributes['enabledByDefault'] ) && $attributes['enabledByDefault'] === true;
$field_click_explosion = isset( $attributes['fieldClickExplosion'] ) && $attributes['fieldClickExplosion'] === true;
$disable_on_mobile = isset( $attributes['disableOnMobile'] ) && $attributes['disableOnMobile'] === true;

// =======================
// OUTPUT ESCAPING
// =======================

// Build wrapper attributes with comprehensive escaping
$wrapper_attributes = get_block_wrapper_attributes( array(
	// All values are escaped with esc_attr() for XSS prevention
	'data-experience-mode' => esc_attr( $experience_mode ),
	'data-color-palette' => esc_attr( $color_palette ),
	'data-particle-opacity' => esc_attr( $particle_opacity ),
	'data-particle-size' => esc_attr( $particle_size ),
	'data-particle-size-mobile' => esc_attr( $particle_size_mobile ),
	'data-animation-duration' => esc_attr( $animation_duration ),
	'data-enable-button-text' => esc_attr( $enable_button_text ),
	'data-disable-button-text' => esc_attr( $disable_button_text ),
	'data-button-position' => esc_attr( $button_position ),
	'data-custom-color' => esc_attr( $custom_color ),
	'data-max-particles' => esc_attr( $max_particles ),
	'data-enabled-by-default' => esc_attr( $enabled_by_default ? 'true' : 'false' ),
	'data-enable-button-text-color' => esc_attr( $enable_button_text_color ),
	'data-enable-button-bg-color' => esc_attr( $enable_button_bg_color ),
	'data-enable-button-gradient-start' => esc_attr( $enable_button_gradient_start ),
	'data-enable-button-gradient-end' => esc_attr( $enable_button_gradient_end ),
	'data-disable-button-text-color' => esc_attr( $disable_button_text_color ),
	'data-disable-button-bg-color' => esc_attr( $disable_button_bg_color ),
	'data-disable-button-gradient-start' => esc_attr( $disable_button_gradient_start ),
	'data-disable-button-gradient-end' => esc_attr( $disable_button_gradient_end ),
	'data-display-behavior' => esc_attr( $display_behavior ),
	'data-sprinkle-style' => esc_attr( $sprinkle_style ),
	'data-sprinkle-emoji' => esc_attr( $sprinkle_emoji ),
	'data-field-color-palette' => esc_attr( $field_color_palette ),
	'data-field-particle-count' => esc_attr( $field_particle_count ),
	'data-field-particle-size' => esc_attr( $field_particle_size ),
	'data-field-particle-size-mobile' => esc_attr( $field_particle_size_mobile ),
	'data-field-mouse-attraction' => esc_attr( $field_mouse_attraction ),
	'data-field-spread-strength' => esc_attr( $field_spread_strength ),
	'data-field-click-explosion' => esc_attr( $field_click_explosion ? 'true' : 'false' ),
	'data-field-particle-style' => esc_attr( $field_particle_style ),
	'data-disable-on-mobile' => esc_attr( $disable_on_mobile ? 'true' : 'false' ),
) );
?>

<div <?php echo wp_kses_data( $wrapper_attributes ); ?>>
	<!-- Glitter Bomb will be rendered via JavaScript -->
	<!-- All rendering happens client-side for security isolation -->
</div>
<?php } )( $attributes );