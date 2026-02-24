/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl, RangeControl, TextControl, Notice, Button } from '@wordpress/components';
import { chevronDown, chevronUp } from '@wordpress/icons';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		experienceMode,
		colorPalette,
		particleOpacity,
		particleSize,
		particleSizeMobile,
		animationDuration,
		enableButtonText,
		disableButtonText,
		buttonPosition,
		customColor,
		maxParticles,
		enabledByDefault,
		enableButtonTextColor,
		enableButtonBackgroundColor,
		enableButtonGradientStart,
		enableButtonGradientEnd,
		disableButtonTextColor,
		disableButtonBackgroundColor,
		disableButtonGradientStart,
		disableButtonGradientEnd,
		displayBehavior,
		fieldColorPalette,
		fieldParticleCount,
		fieldParticleSize,
		fieldParticleSizeMobile,
		fieldMouseAttraction,
		fieldSpreadStrength,
		fieldClickExplosion,
		fieldParticleStyle,
		sprinkleStyle,
		sprinkleEmoji,
		disableOnMobile,
	} = attributes;

	const isSprinkleTrail = experienceMode === 'sprinkle-trail';
	const isParticleField = experienceMode === 'particle-field';

	// Local state for collapsed/expanded view
	const [ isExpanded, setIsExpanded ] = useState( false );

	// Local state for custom emoji picker
	const PRESET_EMOJIS = ['✨', '⭐', '🌟', '❤️', '💜', '🦋', '🌸', '💎', '🍀'];
	const [ showCustomEmoji, setShowCustomEmoji ] = useState( ! PRESET_EMOJIS.includes( sprinkleEmoji ) );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Particle Experience', 'glitter-bomb' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Experience Mode', 'glitter-bomb' ) }
						value={ experienceMode }
						options={ [
							{ label: __( 'Sprinkle Trail', 'glitter-bomb' ), value: 'sprinkle-trail' },
							{ label: __( 'Particle Field', 'glitter-bomb' ), value: 'particle-field' },
						] }
						onChange={ ( value ) => setAttributes( { experienceMode: value } ) }
						help={ experienceMode === 'sprinkle-trail' 
							? __( 'Particles follow cursor with optional scatter or compact trail effect', 'glitter-bomb' )
							: __( 'Magical full-screen field of shimmering glitter particles with physics-based movement', 'glitter-bomb' )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Mobile Settings', 'glitter-bomb' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Disable on Mobile', 'glitter-bomb' ) }
						help={ __( 'Turn off particle effects entirely on mobile devices. Recommended for optimal performance on lower-end mobile devices.', 'glitter-bomb' ) }
						checked={ disableOnMobile }
						onChange={ ( value ) => setAttributes( { disableOnMobile: value } ) }
					/>
					<Notice status="info" isDismissible={ false }>
						{ __( '💡 Mobile Performance: This block is optimized for mobile with reduced canvas resolution, touch event throttling, and particle culling. However, disabling on mobile can further improve performance on older devices.', 'glitter-bomb' ) }
					</Notice>
				</PanelBody>

				<PanelBody title={ __( 'Button Settings', 'glitter-bomb' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Enable by default', 'glitter-bomb' ) }
						help={ __( 'When enabled, effects will be active when the page loads. Users can still toggle them off.', 'glitter-bomb' ) }
						checked={ enabledByDefault }
						onChange={ ( value ) => setAttributes( { enabledByDefault: value } ) }
					/>

					<TextControl
						label={ __( 'Enable Button Text', 'glitter-bomb' ) }
						value={ enableButtonText }
						onChange={ ( value ) => setAttributes( { enableButtonText: value } ) }
						help={ __( 'Text shown when effects are disabled', 'glitter-bomb' ) }
					/>

					<PanelColorSettings
						title={ __( 'Enable Button Colors', 'glitter-bomb' ) }
						colorSettings={ [
							{
								value: enableButtonTextColor,
								onChange: ( value ) => setAttributes( { enableButtonTextColor: value } ),
								label: __( 'Text Color', 'glitter-bomb' ),
							},
							{
								value: enableButtonBackgroundColor,
								onChange: ( value ) => setAttributes( { enableButtonBackgroundColor: value } ),
								label: __( 'Background Color', 'glitter-bomb' ),
							},
						] }
					/>

					<PanelColorSettings
						title={ __( 'Enable Button Gradient (Optional)', 'glitter-bomb' ) }
						colorSettings={ [
							{
								value: enableButtonGradientStart,
								onChange: ( value ) => setAttributes( { enableButtonGradientStart: value } ),
								label: __( 'Gradient Start', 'glitter-bomb' ),
							},
							{
								value: enableButtonGradientEnd,
								onChange: ( value ) => setAttributes( { enableButtonGradientEnd: value } ),
								label: __( 'Gradient End', 'glitter-bomb' ),
							},
						] }
					/>

					<TextControl
						label={ __( 'Disable Button Text', 'glitter-bomb' ) }
						value={ disableButtonText }
						onChange={ ( value ) => setAttributes( { disableButtonText: value } ) }
						help={ __( 'Text shown when effects are enabled', 'glitter-bomb' ) }
					/>

					<PanelColorSettings
						title={ __( 'Disable Button Colors', 'glitter-bomb' ) }
						colorSettings={ [
							{
								value: disableButtonTextColor,
								onChange: ( value ) => setAttributes( { disableButtonTextColor: value } ),
								label: __( 'Text Color', 'glitter-bomb' ),
							},
							{
								value: disableButtonBackgroundColor,
								onChange: ( value ) => setAttributes( { disableButtonBackgroundColor: value } ),
								label: __( 'Background Color', 'glitter-bomb' ),
							},
						] }
					/>

					<PanelColorSettings
						title={ __( 'Disable Button Gradient (Optional)', 'glitter-bomb' ) }
						colorSettings={ [
							{
								value: disableButtonGradientStart,
								onChange: ( value ) => setAttributes( { disableButtonGradientStart: value } ),
								label: __( 'Gradient Start', 'glitter-bomb' ),
							},
							{
								value: disableButtonGradientEnd,
								onChange: ( value ) => setAttributes( { disableButtonGradientEnd: value } ),
								label: __( 'Gradient End', 'glitter-bomb' ),
							},
						] }
					/>

					<SelectControl
						label={ __( 'Button Position', 'glitter-bomb' ) }
						value={ buttonPosition }
						options={ [
							{ label: __( 'Top Left', 'glitter-bomb' ), value: 'top-left' },
							{ label: __( 'Top Right', 'glitter-bomb' ), value: 'top-right' },
							{ label: __( 'Bottom Left', 'glitter-bomb' ), value: 'bottom-left' },
							{ label: __( 'Bottom Right', 'glitter-bomb' ), value: 'bottom-right' },
						] }
						onChange={ ( value ) => setAttributes( { buttonPosition: value } ) }
						help={ __( 'Choose where to display the toggle button', 'glitter-bomb' ) }
					/>
				</PanelBody>

				{ isSprinkleTrail && (
					<PanelBody title={ __( 'Sprinkle Trail Settings', 'glitter-bomb' ) } initialOpen={ true }>
						<SelectControl
							label={ __( 'Trail Style', 'glitter-bomb' ) }
							value={ sprinkleStyle }
							options={ [
								{ label: __( 'Particles', 'glitter-bomb' ), value: 'particles' },
								{ label: __( 'Emoji', 'glitter-bomb' ), value: 'emoji' },
							] }
							onChange={ ( value ) => setAttributes( { sprinkleStyle: value } ) }
							help={ __( 'Particles: colored circles. Emoji: drop any emoji as you move.', 'glitter-bomb' ) }
						/>

						<SelectControl
							label={ __( 'Display Behavior', 'glitter-bomb' ) }
							value={ displayBehavior }
							options={ [
								{ label: __( 'Scattered', 'glitter-bomb' ), value: 'scattered' },
								{ label: __( 'Compact', 'glitter-bomb' ), value: 'compact' },
							] }
							onChange={ ( value ) => setAttributes( { displayBehavior: value } ) }
							help={ __( 'Scattered: particles drift outward as they fade. Compact: particles stay close to cursor path with faster fade.', 'glitter-bomb' ) }
						/>

						{ sprinkleStyle !== 'emoji' && (
							<>
								<SelectControl
									label={ __( 'Color Palette', 'glitter-bomb' ) }
									value={ colorPalette }
									options={ [
										{ label: __( 'Rainbow (cycling)', 'glitter-bomb' ), value: 'rainbow-cycling' },
										{ label: __( 'Metallic (cycling)', 'glitter-bomb' ), value: 'metallic' },
										{ label: __( 'Neutral Spectrum (cycling)', 'glitter-bomb' ), value: 'neutral-spectrum' },
										{ label: __( 'Warm Sunset (cycling)', 'glitter-bomb' ), value: 'warm-sunset' },
										{ label: __( 'Cool Ocean (cycling)', 'glitter-bomb' ), value: 'cool-ocean' },
										{ label: __( 'Custom Color', 'glitter-bomb' ), value: 'custom' },
									] }
									onChange={ ( value ) => setAttributes( { colorPalette: value } ) }
									help={ __( 'Choose a color palette for the particles. All palettes except Custom cycle through colors automatically.', 'glitter-bomb' ) }
								/>

								{ colorPalette === 'custom' && (
									<PanelColorSettings
										title={ __( 'Custom Particle Color', 'glitter-bomb' ) }
										colorSettings={ [
											{
												value: customColor,
												onChange: ( value ) => setAttributes( { customColor: value } ),
												label: __( 'Particle Color', 'glitter-bomb' ),
											},
										] }
									/>
								) }
							</>
						) }

						{ sprinkleStyle === 'emoji' && (
							<>
								<SelectControl
									label={ __( 'Emoji', 'glitter-bomb' ) }
									value={ showCustomEmoji ? 'custom' : sprinkleEmoji }
									options={ [
										{ label: '✨  Sparkles', value: '✨' },
										{ label: '⭐  Star', value: '⭐' },
										{ label: '🌟  Glowing Star', value: '🌟' },
										{ label: '❤️  Heart', value: '❤️' },
										{ label: '💜  Purple Heart', value: '💜' },
										{ label: '🦋  Butterfly', value: '🦋' },
										{ label: '🌸  Cherry Blossom', value: '🌸' },
										{ label: '💎  Diamond', value: '💎' },
										{ label: '🍀  Four Leaf Clover', value: '🍀' },
										{ label: __( 'Custom…', 'glitter-bomb' ), value: 'custom' },
									] }
									onChange={ ( value ) => {
										if ( value === 'custom' ) {
											setShowCustomEmoji( true );
										} else {
											setShowCustomEmoji( false );
											setAttributes( { sprinkleEmoji: value } );
										}
									} }
								/>
								{ showCustomEmoji && (
									<TextControl
										label={ __( 'Custom Emoji', 'glitter-bomb' ) }
										value={ sprinkleEmoji }
										onChange={ ( value ) => setAttributes( { sprinkleEmoji: value } ) }
										help={ __( "Type or paste any emoji. Appears differently across platforms — that's part of the charm!", 'glitter-bomb' ) }
									/>
								) }
							</>
						) }

						<RangeControl
							label={ __( 'Particle Opacity', 'glitter-bomb' ) }
							value={ particleOpacity }
							onChange={ ( value ) => setAttributes( { particleOpacity: value } ) }
							min={ 0.1 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'Adjust the transparency of the particles', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Desktop (px)', 'glitter-bomb' ) }
							value={ particleSize }
							onChange={ ( value ) => setAttributes( { particleSize: value } ) }
							min={ 4 }
							max={ 30 }
							step={ 0.5 }
							help={ __( 'Set the size of each particle on desktop devices', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Mobile (px)', 'glitter-bomb' ) }
							value={ particleSizeMobile }
							onChange={ ( value ) => setAttributes( { particleSizeMobile: value } ) }
							min={ 3 }
							max={ 20 }
							step={ 0.5 }
							help={ __( 'Set the size of each particle on mobile devices', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Animation Duration (ms)', 'glitter-bomb' ) }
							value={ animationDuration }
							onChange={ ( value ) => setAttributes( { animationDuration: value } ) }
							min={ 500 }
							max={ 5000 }
							step={ 100 }
							help={ __( 'How long particles take to fade out', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Maximum Particles', 'glitter-bomb' ) }
							value={ maxParticles }
							onChange={ ( value ) => setAttributes( { maxParticles: value } ) }
							min={ 10 }
							max={ 100 }
							step={ 5 }
							help={ __( 'Limit the number of particles for performance (max 100)', 'glitter-bomb' ) }
						/>
					</PanelBody>
				) }

				{ isParticleField && (
					<PanelBody title={ __( 'Particle Field Settings', 'glitter-bomb' ) } initialOpen={ true }>
						<SelectControl
							label={ __( 'Particle Style', 'glitter-bomb' ) }
							value={ fieldParticleStyle }
							options={ [
								{ label: __( 'Glitter', 'glitter-bomb' ), value: 'glitter' },
								{ label: __( 'Pride Confetti', 'glitter-bomb' ), value: 'pride-confetti' },
								{ label: __( 'Love Bomb', 'glitter-bomb' ), value: 'love-bomb' },
							] }
							onChange={ ( value ) => setAttributes( { fieldParticleStyle: value } ) }
							help={ __( 'Choose the particle style for the field effect', 'glitter-bomb' ) }
						/>

						{ fieldParticleStyle !== 'pride-confetti' && fieldParticleStyle !== 'love-bomb' && (
							<>
								<SelectControl
									label={ __( 'Color Palette', 'glitter-bomb' ) }
									value={ fieldColorPalette }
									options={ [
										{ label: __( 'Metallic (cycling)', 'glitter-bomb' ), value: 'metallic' },
										{ label: __( 'Rainbow (cycling)', 'glitter-bomb' ), value: 'rainbow-cycling' },
										{ label: __( 'Neutral Spectrum (cycling)', 'glitter-bomb' ), value: 'neutral-spectrum' },
										{ label: __( 'Warm Sunset (cycling)', 'glitter-bomb' ), value: 'warm-sunset' },
										{ label: __( 'Cool Ocean (cycling)', 'glitter-bomb' ), value: 'cool-ocean' },
										{ label: __( 'Custom Color', 'glitter-bomb' ), value: 'custom' },
									] }
									onChange={ ( value ) => setAttributes( { fieldColorPalette: value } ) }
									help={ __( 'Choose a color palette for the glitter particles', 'glitter-bomb' ) }
								/>

								{ fieldColorPalette === 'custom' && (
									<PanelColorSettings
										title={ __( 'Custom Particle Color', 'glitter-bomb' ) }
										colorSettings={ [
											{
												value: customColor,
												onChange: ( value ) => setAttributes( { customColor: value } ),
												label: __( 'Particle Color', 'glitter-bomb' ),
											},
										] }
									/>
								) }
							</>
						) }

						<RangeControl
							label={ __( 'Particle Count', 'glitter-bomb' ) }
							value={ fieldParticleCount }
							onChange={ ( value ) => setAttributes( { fieldParticleCount: value } ) }
							min={ 50 }
							max={ 500 }
							step={ 25 }
							help={ __( 'Number of glitter particles in the field', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Desktop (px)', 'glitter-bomb' ) }
							value={ fieldParticleSize }
							onChange={ ( value ) => setAttributes( { fieldParticleSize: value } ) }
							min={ 2 }
							max={ 12 }
							step={ 0.5 }
							help={ __( 'Set the base size of each glitter particle on desktop devices', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Mobile (px)', 'glitter-bomb' ) }
							value={ fieldParticleSizeMobile }
							onChange={ ( value ) => setAttributes( { fieldParticleSizeMobile: value } ) }
							min={ 1.5 }
							max={ 8 }
							step={ 0.5 }
							help={ __( 'Set the base size of each glitter particle on mobile devices', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Mouse Attraction', 'glitter-bomb' ) }
							value={ fieldMouseAttraction }
							onChange={ ( value ) => setAttributes( { fieldMouseAttraction: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'How strongly particles are attracted to cursor', 'glitter-bomb' ) }
						/>

						<RangeControl
							label={ __( 'Spread Strength', 'glitter-bomb' ) }
							value={ fieldSpreadStrength }
							onChange={ ( value ) => setAttributes( { fieldSpreadStrength: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'How much particles spread apart from each other', 'glitter-bomb' ) }
						/>

						<ToggleControl
							label={ __( 'Click Explosion Effect', 'glitter-bomb' ) }
							help={ __( 'Enable sparkle explosion burst on mouse click', 'glitter-bomb' ) }
							checked={ fieldClickExplosion }
							onChange={ ( value ) => setAttributes( { fieldClickExplosion: value } ) }
						/>
					</PanelBody>
				) }

				<PanelBody title={ __( 'Accessibility', 'glitter-bomb' ) } initialOpen={ false }>
					<Notice status="info" isDismissible={ false }>
						{ __( 'This block is WCAG 2.2 AA compliant with full keyboard navigation, screen reader support, and reduced motion respect.', 'glitter-bomb' ) }
					</Notice>
					<p>
						{ __( 'Accessibility features:', 'glitter-bomb' ) }
					</p>
					<ul>
						<li>{ __( '✓ Keyboard activation (Enter/Space)', 'glitter-bomb' ) }</li>
						<li>{ __( '✓ Screen reader announcements', 'glitter-bomb' ) }</li>
						<li>{ __( '✓ Visible focus indicators', 'glitter-bomb' ) }</li>
						<li>{ __( '✓ Minimum 44x44px touch targets', 'glitter-bomb' ) }</li>
						<li>{ __( '✓ Respects prefers-reduced-motion', 'glitter-bomb' ) }</li>
					</ul>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps( { className: 'glitter-bomb-editor-placeholder' } ) }>
				<div className="glitter-bomb-placeholder-content">
					<button
						className="glitter-bomb-collapse-toggle"
						onClick={ () => setIsExpanded( ! isExpanded ) }
						aria-expanded={ isExpanded }
					>
						<div className="glitter-bomb-placeholder-header">
							<span className="glitter-bomb-placeholder-emoji">✨💎✨</span>
							<h3 className="glitter-bomb-placeholder-title">{ __( 'Glitter Bomb', 'glitter-bomb' ) }</h3>
							<Button
								icon={ isExpanded ? chevronUp : chevronDown }
								className="glitter-bomb-toggle-icon"
								label={ isExpanded ? __( 'Collapse settings', 'glitter-bomb' ) : __( 'Expand settings', 'glitter-bomb' ) }
							/>
						</div>
						<p className="glitter-bomb-placeholder-summary">
							{ experienceMode === 'sprinkle-trail' 
								? __( '✨ Sprinkle Trail Mode', 'glitter-bomb' )
								: __( '💫 Particle Field Mode', 'glitter-bomb' )
							}
							{ ' • ' }
							{ enabledByDefault ? __( 'Enabled by default', 'glitter-bomb' ) : __( 'Disabled by default', 'glitter-bomb' ) }
							{ disableOnMobile ? ' • ' + __( 'Disabled on mobile', 'glitter-bomb' ) : '' }
						</p>
					</button>

					{ isExpanded && (
						<>
							<p className="glitter-bomb-placeholder-description">
								{ __( 'Magical particle effects will sparkle on your frontend! 🎆', 'glitter-bomb' ) }
							</p>
							<div className="glitter-bomb-placeholder-settings">
								<p><strong>{ __( '✨ Current Settings:', 'glitter-bomb' ) }</strong></p>
								<ul>
									<li>
										{ __( '🎨 Experience: ', 'glitter-bomb' ) }
										{ experienceMode === 'sprinkle-trail' ? __( 'Sprinkle Trail', 'glitter-bomb' ) : __( 'Particle Field', 'glitter-bomb' ) }
									</li>
									<li>
										{ __( '⚡ Default state: ', 'glitter-bomb' ) }
										{ enabledByDefault ? __( 'Enabled', 'glitter-bomb' ) : __( 'Disabled', 'glitter-bomb' ) }
									</li>
									<li>
										{ __( '📱 Mobile: ', 'glitter-bomb' ) }
										{ disableOnMobile ? __( 'Disabled', 'glitter-bomb' ) : __( 'Enabled', 'glitter-bomb' ) }
									</li>
									{ isSprinkleTrail && (
										<>
											<li>
												{ __( '🌈 Display: ', 'glitter-bomb' ) }
												{ displayBehavior === 'scattered' ? __( 'Scattered', 'glitter-bomb' ) : __( 'Compact', 'glitter-bomb' ) }
											</li>
											<li>
												{ __( '🎨 Colors: ', 'glitter-bomb' ) }
												{ colorPalette === 'custom' ? __( 'Custom', 'glitter-bomb' ) : `${colorPalette} (cycling)` }
											</li>
											<li>
												{ __( '🔢 Max particles: ', 'glitter-bomb' ) }
												{ maxParticles }
											</li>
											<li>
												{ __( '📏 Size: Desktop ', 'glitter-bomb' ) }
												{ particleSize }px / Mobile { particleSizeMobile }px
											</li>
										</>
									) }
									{ isParticleField && (
										<>
											<li>
												{ __( '🎨 Colors: ', 'glitter-bomb' ) }
												{ fieldColorPalette === 'custom' ? __( 'Custom', 'glitter-bomb' ) : `${fieldColorPalette} (cycling)` }
											</li>
											<li>
												{ __( '🔢 Particle count: ', 'glitter-bomb' ) }
												{ fieldParticleCount }
											</li>
											<li>
												{ __( '📏 Size: Desktop ', 'glitter-bomb' ) }
												{ fieldParticleSize }px / Mobile { fieldParticleSizeMobile }px
											</li>
											<li>
												{ __( '💥 Click explosions: ', 'glitter-bomb' ) }
												{ fieldClickExplosion ? __( 'Enabled', 'glitter-bomb' ) : __( 'Disabled', 'glitter-bomb' ) }
											</li>
										</>
									) }
									<li>
										{ __( '📍 Button position: ', 'glitter-bomb' ) }
										{ buttonPosition }
									</li>
								</ul>
							</div>
							<p className="glitter-bomb-placeholder-tip">
								{ __( '💡 Tip: Use the settings panel on the right to customize your sparkle experience!', 'glitter-bomb' ) }
							</p>
						</>
					) }
				</div>
			</div>
		</>
	);
}