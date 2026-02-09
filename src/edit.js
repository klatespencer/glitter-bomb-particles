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
		disableOnMobile,
	} = attributes;

	const isSprinkleTrail = experienceMode === 'sprinkle-trail';
	const isParticleField = experienceMode === 'particle-field';

	// Local state for collapsed/expanded view
	const [ isExpanded, setIsExpanded ] = useState( false );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Particle Experience', 'glitterbomb' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Experience Mode', 'glitterbomb' ) }
						value={ experienceMode }
						options={ [
							{ label: __( 'Sprinkle Trail', 'glitterbomb' ), value: 'sprinkle-trail' },
							{ label: __( 'Particle Field', 'glitterbomb' ), value: 'particle-field' },
						] }
						onChange={ ( value ) => setAttributes( { experienceMode: value } ) }
						help={ experienceMode === 'sprinkle-trail' 
							? __( 'Particles follow cursor with optional scatter or compact trail effect', 'glitterbomb' )
							: __( 'Magical full-screen field of shimmering glitter particles with physics-based movement', 'glitterbomb' )
						}
					/>
				</PanelBody>

				<PanelBody title={ __( 'Mobile Settings', 'glitterbomb' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Disable on Mobile', 'glitterbomb' ) }
						help={ __( 'Turn off particle effects entirely on mobile devices. Recommended for optimal performance on lower-end mobile devices.', 'glitterbomb' ) }
						checked={ disableOnMobile }
						onChange={ ( value ) => setAttributes( { disableOnMobile: value } ) }
					/>
					<Notice status="info" isDismissible={ false }>
						{ __( '💡 Mobile Performance: This block is optimized for mobile with reduced canvas resolution, touch event throttling, and particle culling. However, disabling on mobile can further improve performance on older devices.', 'glitterbomb' ) }
					</Notice>
				</PanelBody>

				<PanelBody title={ __( 'Button Settings', 'glitterbomb' ) } initialOpen={ false }>
					<ToggleControl
						label={ __( 'Enable by default', 'glitterbomb' ) }
						help={ __( 'When enabled, effects will be active when the page loads. Users can still toggle them off.', 'glitterbomb' ) }
						checked={ enabledByDefault }
						onChange={ ( value ) => setAttributes( { enabledByDefault: value } ) }
					/>

					<TextControl
						label={ __( 'Enable Button Text', 'glitterbomb' ) }
						value={ enableButtonText }
						onChange={ ( value ) => setAttributes( { enableButtonText: value } ) }
						help={ __( 'Text shown when effects are disabled', 'glitterbomb' ) }
					/>

					<PanelColorSettings
						title={ __( 'Enable Button Colors', 'glitterbomb' ) }
						colorSettings={ [
							{
								value: enableButtonTextColor,
								onChange: ( value ) => setAttributes( { enableButtonTextColor: value } ),
								label: __( 'Text Color', 'glitterbomb' ),
							},
							{
								value: enableButtonBackgroundColor,
								onChange: ( value ) => setAttributes( { enableButtonBackgroundColor: value } ),
								label: __( 'Background Color', 'glitterbomb' ),
							},
						] }
					/>

					<PanelColorSettings
						title={ __( 'Enable Button Gradient (Optional)', 'glitterbomb' ) }
						colorSettings={ [
							{
								value: enableButtonGradientStart,
								onChange: ( value ) => setAttributes( { enableButtonGradientStart: value } ),
								label: __( 'Gradient Start', 'glitterbomb' ),
							},
							{
								value: enableButtonGradientEnd,
								onChange: ( value ) => setAttributes( { enableButtonGradientEnd: value } ),
								label: __( 'Gradient End', 'glitterbomb' ),
							},
						] }
					/>

					<TextControl
						label={ __( 'Disable Button Text', 'glitterbomb' ) }
						value={ disableButtonText }
						onChange={ ( value ) => setAttributes( { disableButtonText: value } ) }
						help={ __( 'Text shown when effects are enabled', 'glitterbomb' ) }
					/>

					<PanelColorSettings
						title={ __( 'Disable Button Colors', 'glitterbomb' ) }
						colorSettings={ [
							{
								value: disableButtonTextColor,
								onChange: ( value ) => setAttributes( { disableButtonTextColor: value } ),
								label: __( 'Text Color', 'glitterbomb' ),
							},
							{
								value: disableButtonBackgroundColor,
								onChange: ( value ) => setAttributes( { disableButtonBackgroundColor: value } ),
								label: __( 'Background Color', 'glitterbomb' ),
							},
						] }
					/>

					<PanelColorSettings
						title={ __( 'Disable Button Gradient (Optional)', 'glitterbomb' ) }
						colorSettings={ [
							{
								value: disableButtonGradientStart,
								onChange: ( value ) => setAttributes( { disableButtonGradientStart: value } ),
								label: __( 'Gradient Start', 'glitterbomb' ),
							},
							{
								value: disableButtonGradientEnd,
								onChange: ( value ) => setAttributes( { disableButtonGradientEnd: value } ),
								label: __( 'Gradient End', 'glitterbomb' ),
							},
						] }
					/>

					<SelectControl
						label={ __( 'Button Position', 'glitterbomb' ) }
						value={ buttonPosition }
						options={ [
							{ label: __( 'Top Left', 'glitterbomb' ), value: 'top-left' },
							{ label: __( 'Top Right', 'glitterbomb' ), value: 'top-right' },
							{ label: __( 'Bottom Left', 'glitterbomb' ), value: 'bottom-left' },
							{ label: __( 'Bottom Right', 'glitterbomb' ), value: 'bottom-right' },
						] }
						onChange={ ( value ) => setAttributes( { buttonPosition: value } ) }
						help={ __( 'Choose where to display the toggle button', 'glitterbomb' ) }
					/>
				</PanelBody>

				{ isSprinkleTrail && (
					<PanelBody title={ __( 'Sprinkle Trail Settings', 'glitterbomb' ) } initialOpen={ true }>
						<SelectControl
							label={ __( 'Display Behavior', 'glitterbomb' ) }
							value={ displayBehavior }
							options={ [
								{ label: __( 'Scattered', 'glitterbomb' ), value: 'scattered' },
								{ label: __( 'Compact', 'glitterbomb' ), value: 'compact' },
							] }
							onChange={ ( value ) => setAttributes( { displayBehavior: value } ) }
							help={ __( 'Scattered: particles drift outward as they fade. Compact: particles stay close to cursor path with faster fade.', 'glitterbomb' ) }
						/>

						<SelectControl
							label={ __( 'Color Palette', 'glitterbomb' ) }
							value={ colorPalette }
							options={ [
								{ label: __( 'Rainbow (cycling)', 'glitterbomb' ), value: 'rainbow-cycling' },
								{ label: __( 'Metallic (cycling)', 'glitterbomb' ), value: 'metallic' },
								{ label: __( 'Neutral Spectrum (cycling)', 'glitterbomb' ), value: 'neutral-spectrum' },
								{ label: __( 'Warm Sunset (cycling)', 'glitterbomb' ), value: 'warm-sunset' },
								{ label: __( 'Cool Ocean (cycling)', 'glitterbomb' ), value: 'cool-ocean' },
								{ label: __( 'Custom Color', 'glitterbomb' ), value: 'custom' },
							] }
							onChange={ ( value ) => setAttributes( { colorPalette: value } ) }
							help={ __( 'Choose a color palette for the particles. All palettes except Custom cycle through colors automatically.', 'glitterbomb' ) }
						/>

						{ colorPalette === 'custom' && (
							<PanelColorSettings
								title={ __( 'Custom Particle Color', 'glitterbomb' ) }
								colorSettings={ [
									{
										value: customColor,
										onChange: ( value ) => setAttributes( { customColor: value } ),
										label: __( 'Particle Color', 'glitterbomb' ),
									},
								] }
							/>
						) }

						<RangeControl
							label={ __( 'Particle Opacity', 'glitterbomb' ) }
							value={ particleOpacity }
							onChange={ ( value ) => setAttributes( { particleOpacity: value } ) }
							min={ 0.1 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'Adjust the transparency of the particles', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Desktop (px)', 'glitterbomb' ) }
							value={ particleSize }
							onChange={ ( value ) => setAttributes( { particleSize: value } ) }
							min={ 4 }
							max={ 30 }
							step={ 0.5 }
							help={ __( 'Set the size of each particle on desktop devices', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Mobile (px)', 'glitterbomb' ) }
							value={ particleSizeMobile }
							onChange={ ( value ) => setAttributes( { particleSizeMobile: value } ) }
							min={ 3 }
							max={ 20 }
							step={ 0.5 }
							help={ __( 'Set the size of each particle on mobile devices', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Animation Duration (ms)', 'glitterbomb' ) }
							value={ animationDuration }
							onChange={ ( value ) => setAttributes( { animationDuration: value } ) }
							min={ 500 }
							max={ 5000 }
							step={ 100 }
							help={ __( 'How long particles take to fade out', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Maximum Particles', 'glitterbomb' ) }
							value={ maxParticles }
							onChange={ ( value ) => setAttributes( { maxParticles: value } ) }
							min={ 10 }
							max={ 100 }
							step={ 5 }
							help={ __( 'Limit the number of particles for performance (max 100)', 'glitterbomb' ) }
						/>
					</PanelBody>
				) }

				{ isParticleField && (
					<PanelBody title={ __( 'Particle Field Settings', 'glitterbomb' ) } initialOpen={ true }>
						<SelectControl
							label={ __( 'Color Palette', 'glitterbomb' ) }
							value={ fieldColorPalette }
							options={ [
								{ label: __( 'Metallic (cycling)', 'glitterbomb' ), value: 'metallic' },
								{ label: __( 'Rainbow (cycling)', 'glitterbomb' ), value: 'rainbow-cycling' },
								{ label: __( 'Neutral Spectrum (cycling)', 'glitterbomb' ), value: 'neutral-spectrum' },
								{ label: __( 'Warm Sunset (cycling)', 'glitterbomb' ), value: 'warm-sunset' },
								{ label: __( 'Cool Ocean (cycling)', 'glitterbomb' ), value: 'cool-ocean' },
								{ label: __( 'Custom Color', 'glitterbomb' ), value: 'custom' },
							] }
							onChange={ ( value ) => setAttributes( { fieldColorPalette: value } ) }
							help={ __( 'Choose a color palette for the glitter particles', 'glitterbomb' ) }
						/>

						{ fieldColorPalette === 'custom' && (
							<PanelColorSettings
								title={ __( 'Custom Particle Color', 'glitterbomb' ) }
								colorSettings={ [
									{
										value: customColor,
										onChange: ( value ) => setAttributes( { customColor: value } ),
										label: __( 'Particle Color', 'glitterbomb' ),
									},
								] }
							/>
						) }

						<RangeControl
							label={ __( 'Particle Count', 'glitterbomb' ) }
							value={ fieldParticleCount }
							onChange={ ( value ) => setAttributes( { fieldParticleCount: value } ) }
							min={ 50 }
							max={ 500 }
							step={ 25 }
							help={ __( 'Number of glitter particles in the field', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Desktop (px)', 'glitterbomb' ) }
							value={ fieldParticleSize }
							onChange={ ( value ) => setAttributes( { fieldParticleSize: value } ) }
							min={ 2 }
							max={ 12 }
							step={ 0.5 }
							help={ __( 'Set the base size of each glitter particle on desktop devices', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Particle Size - Mobile (px)', 'glitterbomb' ) }
							value={ fieldParticleSizeMobile }
							onChange={ ( value ) => setAttributes( { fieldParticleSizeMobile: value } ) }
							min={ 1.5 }
							max={ 8 }
							step={ 0.5 }
							help={ __( 'Set the base size of each glitter particle on mobile devices', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Mouse Attraction', 'glitterbomb' ) }
							value={ fieldMouseAttraction }
							onChange={ ( value ) => setAttributes( { fieldMouseAttraction: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'How strongly particles are attracted to cursor', 'glitterbomb' ) }
						/>

						<RangeControl
							label={ __( 'Spread Strength', 'glitterbomb' ) }
							value={ fieldSpreadStrength }
							onChange={ ( value ) => setAttributes( { fieldSpreadStrength: value } ) }
							min={ 0 }
							max={ 1 }
							step={ 0.1 }
							help={ __( 'How much particles spread apart from each other', 'glitterbomb' ) }
						/>

						<ToggleControl
							label={ __( 'Click Explosion Effect', 'glitterbomb' ) }
							help={ __( 'Enable sparkle explosion burst on mouse click', 'glitterbomb' ) }
							checked={ fieldClickExplosion }
							onChange={ ( value ) => setAttributes( { fieldClickExplosion: value } ) }
						/>
					</PanelBody>
				) }

				<PanelBody title={ __( 'Accessibility', 'glitterbomb' ) } initialOpen={ false }>
					<Notice status="info" isDismissible={ false }>
						{ __( 'This block is WCAG 2.2 AA compliant with full keyboard navigation, screen reader support, and reduced motion respect.', 'glitterbomb' ) }
					</Notice>
					<p>
						{ __( 'Accessibility features:', 'glitterbomb' ) }
					</p>
					<ul>
						<li>{ __( '✓ Keyboard activation (Enter/Space)', 'glitterbomb' ) }</li>
						<li>{ __( '✓ Screen reader announcements', 'glitterbomb' ) }</li>
						<li>{ __( '✓ Visible focus indicators', 'glitterbomb' ) }</li>
						<li>{ __( '✓ Minimum 44x44px touch targets', 'glitterbomb' ) }</li>
						<li>{ __( '✓ Respects prefers-reduced-motion', 'glitterbomb' ) }</li>
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
							<h3 className="glitter-bomb-placeholder-title">{ __( 'Glitter Bomb', 'glitterbomb' ) }</h3>
							<Button
								icon={ isExpanded ? chevronUp : chevronDown }
								className="glitter-bomb-toggle-icon"
								label={ isExpanded ? __( 'Collapse settings', 'glitterbomb' ) : __( 'Expand settings', 'glitterbomb' ) }
							/>
						</div>
						<p className="glitter-bomb-placeholder-summary">
							{ experienceMode === 'sprinkle-trail' 
								? __( '✨ Sprinkle Trail Mode', 'glitterbomb' )
								: __( '💫 Particle Field Mode', 'glitterbomb' )
							}
							{ ' • ' }
							{ enabledByDefault ? __( 'Enabled by default', 'glitterbomb' ) : __( 'Disabled by default', 'glitterbomb' ) }
							{ disableOnMobile ? ' • ' + __( 'Disabled on mobile', 'glitterbomb' ) : '' }
						</p>
					</button>

					{ isExpanded && (
						<>
							<p className="glitter-bomb-placeholder-description">
								{ __( 'Magical particle effects will sparkle on your frontend! 🎆', 'glitterbomb' ) }
							</p>
							<div className="glitter-bomb-placeholder-settings">
								<p><strong>{ __( '✨ Current Settings:', 'glitterbomb' ) }</strong></p>
								<ul>
									<li>
										{ __( '🎨 Experience: ', 'glitterbomb' ) }
										{ experienceMode === 'sprinkle-trail' ? __( 'Sprinkle Trail', 'glitterbomb' ) : __( 'Particle Field', 'glitterbomb' ) }
									</li>
									<li>
										{ __( '⚡ Default state: ', 'glitterbomb' ) }
										{ enabledByDefault ? __( 'Enabled', 'glitterbomb' ) : __( 'Disabled', 'glitterbomb' ) }
									</li>
									<li>
										{ __( '📱 Mobile: ', 'glitterbomb' ) }
										{ disableOnMobile ? __( 'Disabled', 'glitterbomb' ) : __( 'Enabled', 'glitterbomb' ) }
									</li>
									{ isSprinkleTrail && (
										<>
											<li>
												{ __( '🌈 Display: ', 'glitterbomb' ) }
												{ displayBehavior === 'scattered' ? __( 'Scattered', 'glitterbomb' ) : __( 'Compact', 'glitterbomb' ) }
											</li>
											<li>
												{ __( '🎨 Colors: ', 'glitterbomb' ) }
												{ colorPalette === 'custom' ? __( 'Custom', 'glitterbomb' ) : `${colorPalette} (cycling)` }
											</li>
											<li>
												{ __( '🔢 Max particles: ', 'glitterbomb' ) }
												{ maxParticles }
											</li>
											<li>
												{ __( '📏 Size: Desktop ', 'glitterbomb' ) }
												{ particleSize }px / Mobile { particleSizeMobile }px
											</li>
										</>
									) }
									{ isParticleField && (
										<>
											<li>
												{ __( '🎨 Colors: ', 'glitterbomb' ) }
												{ fieldColorPalette === 'custom' ? __( 'Custom', 'glitterbomb' ) : `${fieldColorPalette} (cycling)` }
											</li>
											<li>
												{ __( '🔢 Particle count: ', 'glitterbomb' ) }
												{ fieldParticleCount }
											</li>
											<li>
												{ __( '📏 Size: Desktop ', 'glitterbomb' ) }
												{ fieldParticleSize }px / Mobile { fieldParticleSizeMobile }px
											</li>
											<li>
												{ __( '💥 Click explosions: ', 'glitterbomb' ) }
												{ fieldClickExplosion ? __( 'Enabled', 'glitterbomb' ) : __( 'Disabled', 'glitterbomb' ) }
											</li>
										</>
									) }
									<li>
										{ __( '📍 Button position: ', 'glitterbomb' ) }
										{ buttonPosition }
									</li>
								</ul>
							</div>
							<p className="glitter-bomb-placeholder-tip">
								{ __( '💡 Tip: Use the settings panel on the right to customize your sparkle experience!', 'glitterbomb' ) }
							</p>
						</>
					) }
				</div>
			</div>
		</>
	);
}