/**
 * Glitter Bomb - Frontend Interactive Script
 * 
 * Creates accessible, animated particle effects with two experience modes:
 * 1. Sprinkle Trail: Particles following cursor/touch movement
 * 2. Particle Field: Full-screen magical glitter field with physics
 * 
 * WCAG 2.2 AA compliant with full keyboard and screen reader support
 * Performance optimized with object pooling, RAF optimization, and mobile canvas scaling
 * Enhanced safety features to prevent rapid flashing that could trigger seizures
 * Safari privacy-friendly with explicit non-fingerprinting context attributes
 * Progressive enhancement with feature detection for older browsers
 * Frame rate throttling to 60 FPS for consistent physics across all displays
 */

(function() {
	'use strict';

	// =======================
	// FEATURE DETECTION
	// =======================

	/**
	 * Check if browser supports required features
	 * @returns {Object} Feature support status and missing features
	 */
	function checkBrowserSupport() {
		const support = {
			supported: true,
			missing: [],
		};

		// Check for Canvas API support
		if (!window.HTMLCanvasElement || !document.createElement('canvas').getContext) {
			support.supported = false;
			support.missing.push('Canvas API');
		}

		// Check for requestAnimationFrame
		if (!window.requestAnimationFrame) {
			// Try to polyfill if possible
			window.requestAnimationFrame = 
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(callback) {
					return window.setTimeout(callback, 1000 / 60);
				};
		}

		// Check for cancelAnimationFrame
		if (!window.cancelAnimationFrame) {
			window.cancelAnimationFrame = 
				window.webkitCancelAnimationFrame ||
				window.mozCancelAnimationFrame ||
				window.oCancelAnimationFrame ||
				window.msCancelAnimationFrame ||
				window.clearTimeout;
		}

		// Check for sessionStorage
		if (!window.sessionStorage) {
			// Create a polyfill using in-memory storage
			window.sessionStorage = {
				_data: {},
				getItem: function(key) {
					return this._data[key] || null;
				},
				setItem: function(key, value) {
					this._data[key] = String(value);
				},
				removeItem: function(key) {
					delete this._data[key];
				},
			};
		}

		// Check for addEventListener
		if (!window.addEventListener) {
			support.supported = false;
			support.missing.push('Event Listeners');
		}

		// Check for Array methods (ES5)
		if (!Array.prototype.forEach || !Array.prototype.indexOf) {
			support.supported = false;
			support.missing.push('ES5 Array Methods');
		}

		// Check for performance.now()
		if (!window.performance || !window.performance.now) {
			// Polyfill with Date.now()
			if (!window.performance) {
				window.performance = {};
			}
			window.performance.now = function() {
				return Date.now();
			};
		}

		return support;
	}

	/**
	 * Display fallback message for unsupported browsers
	 * Uses DOM creation methods instead of innerHTML for WordPress coding standards
	 * 
	 * @param {HTMLElement} blockElement The block element
	 * @param {Array} missingFeatures List of missing features
	 */
	function showFallbackMessage(blockElement, missingFeatures) {
		// Create container
		const message = document.createElement('div');
		message.className = 'glitter-bomb-fallback';
		message.style.cssText = 
			'padding: 20px; ' +
			'margin: 20px; ' +
			'background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); ' +
			'border-radius: 12px; ' +
			'color: #ffffff; ' +
			'text-align: center; ' +
			'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;';
		
		// Create title
		const title = document.createElement('h3');
		title.style.cssText = 'margin: 0 0 12px 0; font-size: 20px;';
		title.appendChild(document.createTextNode('✨ Glitter Bomb ✨'));
		message.appendChild(title);
		
		// Create description paragraph
		const description = document.createElement('p');
		description.style.cssText = 'margin: 0 0 12px 0; font-size: 14px;';
		description.appendChild(document.createTextNode(
			'Your browser doesn\'t support the features needed for particle effects.'
		));
		message.appendChild(description);
		
		// Create missing features paragraph
		const missingPara = document.createElement('p');
		missingPara.style.cssText = 'margin: 0; font-size: 12px; opacity: 0.9;';
		missingPara.appendChild(document.createTextNode('Missing: '));
		missingPara.appendChild(document.createTextNode(missingFeatures.join(', ')));
		message.appendChild(missingPara);
		
		// Create update suggestion paragraph
		const updatePara = document.createElement('p');
		updatePara.style.cssText = 'margin: 12px 0 0 0; font-size: 12px; opacity: 0.8;';
		updatePara.appendChild(document.createTextNode(
			'Please update to a modern browser for the best experience.'
		));
		message.appendChild(updatePara);
		
		// Append to block element
		blockElement.appendChild(message);
	}

	// Check browser support before proceeding
	const browserSupport = checkBrowserSupport();

	if (!browserSupport.supported) {
		// Browser doesn't support required features - show fallback
		console.warn('Glitter Bomb: Browser not supported. Missing features:', browserSupport.missing);
		
		// Show fallback message in all blocks
		function showFallbacks() {
			const blocks = document.querySelectorAll('.wp-block-glitter-bomb-glitter-bomb');
			blocks.forEach(function(block) {
				if (!block.querySelector('.glitter-bomb-fallback')) {
					showFallbackMessage(block, browserSupport.missing);
				}
			});
		}
		
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', showFallbacks);
		} else {
			showFallbacks();
		}
		
		// Exit early - don't initialize particle system
		return;
	}

	// Check for reduced motion preference
	const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Detect mobile devices
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

	// FRAME RATE THROTTLING: Target 60 FPS for consistent physics
	const TARGET_FPS = 60;
	const FRAME_DURATION = 1000 / TARGET_FPS; // ~16.67ms per frame

	// Particle Pool for object reuse
	class ParticlePool {
		constructor(initialSize) {
			initialSize = initialSize || 100;
			this.pool = [];
			this.activeParticles = [];
			
			// Pre-allocate particles
			for (let i = 0; i < initialSize; i++) {
				this.pool.push(this.createParticleObject());
			}
		}

		createParticleObject() {
			// Create a reusable particle object with all possible properties
			return {
				x: 0,
				y: 0,
				homX: 0,
				homY: 0,
				vx: 0,
				vy: 0,
				baseSize: 0,
				size: 0,
				opacity: 0,
				color: '',
				birthTime: 0,
				maxLife: 0,
				shimmerPhase: 0,
				shimmerSpeed: 0,
				rotation: 0,
				rotationSpeed: 0,
				colorIndex: 0,
				colorCycleSpeed: 0,
				isExplosion: false,
				explosionLife: 0,
				driftAngle: 0,
				driftSpeed: 0,
				driftPhase: 0,
				active: false,
			};
		}

		acquire() {
			// Get particle from pool or create new one if pool is empty
			let particle;
			if (this.pool.length > 0) {
				particle = this.pool.pop();
			} else {
				particle = this.createParticleObject();
			}
			particle.active = true;
			this.activeParticles.push(particle);
			return particle;
		}

		release(particle) {
			// Return particle to pool for reuse
			const index = this.activeParticles.indexOf(particle);
			if (index > -1) {
				this.activeParticles.splice(index, 1);
			}
			particle.active = false;
			this.pool.push(particle);
		}

		releaseAll() {
			// Return all active particles to pool
			while (this.activeParticles.length > 0) {
				const particle = this.activeParticles.pop();
				particle.active = false;
				this.pool.push(particle);
			}
		}

		getActive() {
			return this.activeParticles;
		}

		getPoolSize() {
			return this.pool.length;
		}

		getActiveCount() {
			return this.activeParticles.length;
		}
	}

	class GlitterBombParticles {
		constructor(blockElement) {
			this.blockElement = blockElement;
			this.canvas = null;
			this.ctx = null;
			this.particlePool = null;
			this.isActive = false;
			this.animationFrameId = null;
			this.lastFrameTime = 0;
			this.lastUpdateTime = 0; // FRAME RATE THROTTLING: Track last physics update
			this.lastTouchX = 0;
			this.lastTouchY = 0;
			this.paletteIndex = 0;
			this.mouseX = window.innerWidth / 2;
			this.mouseY = window.innerHeight / 2;
			this.mouseInViewport = false;
			this.isTabVisible = !document.hidden;
			this.lastParticleX = 0;
			this.lastParticleY = 0;
			this.isInitialized = false;
			this.rockets = [];
			this.rocketLaunchTimer = 0;
			
			// Simplified touch optimization
			this.lastTouchTime = 0;
			
			// Canvas scaling for mobile performance
			this.canvasScale = 1;
			this.logicalWidth = 0;
			this.logicalHeight = 0;

			// SAFETY: Resize debouncing and fade transitions to prevent seizure-inducing flashing
			this.isResizing = false;
			this.resizeDebounceTimer = null;
			this.lastResizeTime = 0;
			this.canvasOpacity = 1;
			this.targetOpacity = 1;
			this.isFading = false;

			// Get attributes from data attributes
			this.config = {
				experienceMode: blockElement.dataset.experienceMode || 'particle-field',
				colorPalette: blockElement.dataset.colorPalette || 'rainbow-cycling',
				particleOpacity: parseFloat(blockElement.dataset.particleOpacity) || 0.9,
				particleSize: parseFloat(blockElement.dataset.particleSize) || 10,
				particleSizeMobile: parseFloat(blockElement.dataset.particleSizeMobile) || 7.5,
				animationDuration: parseInt(blockElement.dataset.animationDuration) || 1500,
				enableButtonText: blockElement.dataset.enableButtonText || '✨ Enable Sparkles',
				disableButtonText: blockElement.dataset.disableButtonText || '✨ Disable Sparkles',
				buttonPosition: blockElement.dataset.buttonPosition || 'bottom-right',
				customColor: blockElement.dataset.customColor || '#ff69b4',
				maxParticles: parseInt(blockElement.dataset.maxParticles) || 50,
				enabledByDefault: blockElement.dataset.enabledByDefault === 'true',
				enableButtonTextColor: blockElement.dataset.enableButtonTextColor || '#ffffff',
				enableButtonBgColor: blockElement.dataset.enableButtonBgColor || '#667eea',
				enableButtonGradientStart: blockElement.dataset.enableButtonGradientStart || '',
				enableButtonGradientEnd: blockElement.dataset.enableButtonGradientEnd || '',
				disableButtonTextColor: blockElement.dataset.disableButtonTextColor || '#ffffff',
				disableButtonBgColor: blockElement.dataset.disableButtonBgColor || '#f093fb',
				disableButtonGradientStart: blockElement.dataset.disableButtonGradientStart || '',
				disableButtonGradientEnd: blockElement.dataset.disableButtonGradientEnd || '',
				displayBehavior: blockElement.dataset.displayBehavior || 'compact',
				fieldColorPalette: blockElement.dataset.fieldColorPalette || 'metallic',
				fieldParticleCount: parseInt(blockElement.dataset.fieldParticleCount) || 200,
				fieldParticleSize: parseFloat(blockElement.dataset.fieldParticleSize) || 6,
				fieldParticleSizeMobile: parseFloat(blockElement.dataset.fieldParticleSizeMobile) || 3,
				fieldMouseAttraction: blockElement.dataset.fieldMouseAttraction !== undefined ? parseFloat(blockElement.dataset.fieldMouseAttraction) : 0.5,
				fieldSpreadStrength: parseFloat(blockElement.dataset.fieldSpreadStrength) || 0.3,
				fieldParticleOpacity: blockElement.dataset.fieldParticleOpacity !== undefined ? parseFloat(blockElement.dataset.fieldParticleOpacity) : 1,
				fieldClickExplosion: blockElement.dataset.fieldClickExplosion === 'true',
			fieldParticleStyle: blockElement.dataset.fieldParticleStyle || 'glitter',
			sprinkleStyle: blockElement.dataset.sprinkleStyle || 'particles',
				sprinkleClickExplosion: blockElement.dataset.sprinkleClickExplosion !== 'false',
			sprinkleEmoji: blockElement.dataset.sprinkleEmoji || '✨',
				disableOnMobile: blockElement.dataset.disableOnMobile === 'true',
			};

			// Color palettes with cycling support
			this.colorPalettes = {
				'rainbow-cycling': ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
				'metallic': ['#C0C0C0', '#D4AF37', '#E5E4E2', '#B87333', '#AAA9AD', '#CD7F32', '#CFCFCF'],
				'neutral-spectrum': ['#8B8B8B', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#E0E0E0'],
				'warm-sunset': ['#FF6B6B', '#FFA07A', '#FFD700', '#FF8C00', '#FF4500'],
				'cool-ocean': ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0', '#00FFFF'],
			'pride-confetti': ['#FF0024', '#FF8C00', '#FFED00', '#008026', '#004DFF', '#750787'],
			'love-bomb': ['#FF6B6B', '#FF85A1', '#FFB3BA', '#E8365D', '#FF4F6E', '#FFAEC9'],
			'snow': ['#FFFFFF', '#F0F8FF', '#E8F4F8'],
			'fourth-of-july': ['#FF0000', '#CC1111', '#FFFFFF', '#FFFAF0', '#0033CC', '#1155EE', '#0022AA'],
			'autumn': ['#C44B0C', '#D4522A', '#8B2500', '#DAA520', '#9B1B0A', '#B8500A', '#CC7722'],
				'custom': [this.config.customColor],
			};

			// Initialize particle pool with appropriate size
			const poolSize = this.config.experienceMode === 'particle-field' 
				? Math.max(this.config.fieldParticleCount + 100, 300) // Extra for explosions
				: Math.max(this.config.maxParticles + 20, 70);
			this.particlePool = new ParticlePool(poolSize);

			this.init();
		}

		init() {
			// Check if mobile is disabled
			if (isMobile && this.config.disableOnMobile) {
				// Don't initialize anything on mobile if disabled
				return;
			}

			// STEP 1: Create UI elements
			this.createCanvas();
			this.createToggleButton();
			this.setupEventListeners();

			// STEP 2: Determine initial state from sessionStorage or enabledByDefault
			const savedState = sessionStorage.getItem('glitterBombActive');

			// CRITICAL FIX: Use a single source of truth
			if (savedState !== null) {
				// User has previously set a preference - respect it
				this.isActive = savedState === 'true';
			} else {
				// No saved preference - use enabledByDefault setting
				this.isActive = this.config.enabledByDefault;
				// Save the initial state
				sessionStorage.setItem('glitterBombActive', this.isActive.toString());
			}

			// Respect reduced motion preference by not auto-starting,
			// but users can still opt in via the toggle button
			if (prefersReducedMotion) {
				this.isActive = false;
			}

			// STEP 3: Update button UI to match state
			this.updateButtonUI();

			// STEP 4: If active, initialize particles and start
			if (this.isActive) {
				// For particle field, initialize the field FIRST
				if (this.config.experienceMode === 'particle-field') {
					this.initializeParticleField();
					this.isInitialized = true;
				}
				// Then start the animation loop
				this.start();
			}
		}

		// Centralized button UI update
		updateButtonUI() {
			if (!this.button) return;
			
			this.button.setAttribute('aria-pressed', this.isActive);
			this.button.textContent = this.isActive ? this.config.disableButtonText : this.config.enableButtonText;
			this.applyButtonStyles(this.button, this.isActive);
		}

		createCanvas() {
			this.canvas = document.createElement('canvas');
			this.canvas.className = 'glitter-bomb-canvas';
			this.canvas.setAttribute('aria-hidden', 'true');

			document.body.appendChild(this.canvas);

			// SAFARI PRIVACY: Get context with explicit non-fingerprinting attributes
			// Setting willReadFrequently: false signals this is purely visual rendering
			// Setting alpha: true is standard for transparency (not fingerprinting)
			// Setting desynchronized: true can improve performance and signals animation intent
			// IMPORTANT: Context must be created BEFORE calculateCanvasSize so ctx.scale() is applied
			this.ctx = this.canvas.getContext('2d', {
				alpha: true,
				willReadFrequently: false,
				desynchronized: true
			});

			// Calculate canvas scaling (must be after ctx is set for proper DPI scaling)
			this.calculateCanvasSize();
		}

		// Get true viewport height accounting for mobile browser UI
		getViewportHeight() {
			// On mobile browsers, use visualViewport API if available (more accurate)
			if (window.visualViewport) {
				return window.visualViewport.height;
			}
			// Fallback to window.innerHeight
			return window.innerHeight;
		}

		// Calculate optimal canvas size based on device and pixel density
		calculateCanvasSize() {
			const viewportWidth = window.innerWidth;
			const viewportHeight = this.getViewportHeight();
			const devicePixelRatio = window.devicePixelRatio || 1;
			
			// Store logical dimensions
			this.logicalWidth = viewportWidth;
			this.logicalHeight = viewportHeight;
			
			if (isMobile && devicePixelRatio > 1) {
				// On mobile with high DPI, reduce canvas resolution to 1.5x instead of full devicePixelRatio
				// This significantly improves performance while maintaining visual quality
				this.canvasScale = Math.min(1.5, devicePixelRatio);
			} else {
				// On desktop or low-DPI mobile, use native resolution
				this.canvasScale = devicePixelRatio;
			}
			
			// Set canvas resolution
			this.canvas.width = viewportWidth * this.canvasScale;
			this.canvas.height = viewportHeight * this.canvasScale;
			
			// Set display size (CSS pixels) - use fixed positioning to cover full viewport
			this.canvas.style.width = '100vw';
			this.canvas.style.height = '100vh';
			
			// Scale context to match
			if (this.ctx) {
				this.ctx.scale(this.canvasScale, this.canvasScale);
			}
		}

		// SAFETY: Smooth resize handler with debouncing and fade transitions
		handleResize() {
			const now = performance.now();
			
			// Clear existing debounce timer
			if (this.resizeDebounceTimer) {
				clearTimeout(this.resizeDebounceTimer);
			}

			// If resize is happening too rapidly (within 150ms), fade out canvas
			if (now - this.lastResizeTime < 150) {
				if (!this.isResizing) {
					this.isResizing = true;
					this.targetOpacity = 0.3; // Fade to 30% opacity during rapid resize
					this.isFading = true;
				}
			}
			
			this.lastResizeTime = now;

			// Debounce the actual resize operation
			this.resizeDebounceTimer = setTimeout(() => {
				// Recalculate canvas size
				this.calculateCanvasSize();
				
				// Reinitialize particle field on resize
				if (this.config.experienceMode === 'particle-field' && this.isActive) {
					this.initializeParticleField();
				}
				
				// Fade back in
				this.isResizing = false;
				this.targetOpacity = 1;
				this.isFading = true;
			}, 250); // Wait 250ms after last resize event
		}

		// SAFETY: Smooth opacity transitions to prevent abrupt visual changes
		updateCanvasOpacity() {
			if (!this.isFading) return;
			
			const fadeSpeed = 0.05; // Smooth fade speed
			const diff = this.targetOpacity - this.canvasOpacity;
			
			if (Math.abs(diff) < 0.01) {
				// Close enough - snap to target
				this.canvasOpacity = this.targetOpacity;
				this.isFading = false;
			} else {
				// Smooth interpolation
				this.canvasOpacity += diff * fadeSpeed;
			}
			
			// Apply opacity to canvas
			this.canvas.style.opacity = this.canvasOpacity.toString();
		}

		// Get gradient colors from palette
		getPaletteGradient() {
			const palette = this.config.experienceMode === 'particle-field' 
				? this.config.fieldColorPalette 
				: this.config.colorPalette;
			
			const colors = this.colorPalettes[palette];
			
			if (palette === 'custom') {
				return {
					start: this.config.customColor,
					end: this.config.customColor
				};
			}
			
			// Return first and last color for gradient
			return {
				start: colors[0],
				end: colors[colors.length - 1]
			};
		}

		createToggleButton() {
			const button = document.createElement('button');
			button.className = 'glitter-bomb-toggle position-' + this.config.buttonPosition;
			button.setAttribute('type', 'button');

			// Add screen reader announcement area
			const srAnnouncement = document.createElement('div');
			srAnnouncement.className = 'glitter-bomb-sr-only';
			srAnnouncement.setAttribute('role', 'status');
			srAnnouncement.setAttribute('aria-live', 'polite');
			srAnnouncement.id = 'glitter-bomb-announcement';
			document.body.appendChild(srAnnouncement);

			this.button = button;
			this.srAnnouncement = srAnnouncement;
			document.body.appendChild(button);
		}

		applyButtonStyles(button, isActive) {
			const textColor = isActive ? this.config.disableButtonTextColor : this.config.enableButtonTextColor;
			const bgColor = isActive ? this.config.disableButtonBgColor : this.config.enableButtonBgColor;
			let gradientStart = isActive ? this.config.disableButtonGradientStart : this.config.enableButtonGradientStart;
			let gradientEnd = isActive ? this.config.disableButtonGradientEnd : this.config.enableButtonGradientEnd;

			button.style.color = textColor;

			// If no custom gradient is set, use palette gradient
			if (!gradientStart && !gradientEnd) {
				const paletteGradient = this.getPaletteGradient();
				gradientStart = paletteGradient.start;
				gradientEnd = paletteGradient.end;
			}

			// Use gradient if both gradient colors are set, otherwise use solid color
			if (gradientStart && gradientEnd) {
				button.style.background = 'linear-gradient(135deg, ' + gradientStart + ', ' + gradientEnd + ')';
			} else {
				button.style.background = bgColor;
			}
		}

		setupEventListeners() {
			// Button click
			this.button.addEventListener('click', () => this.toggle());

			// Keyboard support
			this.button.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					this.toggle();
				}
			});

			// Mouse movement handler
			this.mouseMoveHandler = (e) => {
				this.mouseX = e.clientX;
				this.mouseY = e.clientY;
				this.mouseInViewport = true;
				
				if (this.isActive) {
					if (this.config.experienceMode === 'sprinkle-trail') {
						this.createParticle(e.clientX, e.clientY);
					}
				}
			};

			// Mouse leave handler
			this.mouseLeaveHandler = () => {
				this.mouseInViewport = false;
			};

			// Mouse enter handler
			this.mouseEnterHandler = () => {
				this.mouseInViewport = true;
			};

			// Touch events - simpler without aggressive throttling
			this.touchMoveHandler = (e) => {
				if (!this.isActive) return;
				
				const touch = e.touches[0];
				
				// Update mouse position for particle field
				this.mouseX = touch.clientX;
				this.mouseY = touch.clientY;
				this.mouseInViewport = true;
				
				// Create particles for sprinkle trail
				if (this.config.experienceMode === 'sprinkle-trail') {
					this.createParticle(touch.clientX, touch.clientY);
				}
				
				this.lastTouchX = touch.clientX;
				this.lastTouchY = touch.clientY;
			};

			// Touch start handler
			this.touchStartHandler = (e) => {
				if (!this.isActive) return;
				
				const touch = e.touches[0];
				this.mouseX = touch.clientX;
				this.mouseY = touch.clientY;
				this.mouseInViewport = true;
			};

			// Touch end handler
			this.touchEndHandler = () => {
				this.mouseInViewport = false;
			};

			// Click handler for particle field explosions
			this.clickHandler = (e) => {
				if (this.isActive) {
					if (this.config.experienceMode === 'particle-field' && this.config.fieldClickExplosion) {
						this.createExplosion(e.clientX, e.clientY);
					} else if (this.config.experienceMode === 'sprinkle-trail' && this.config.sprinkleClickExplosion) {
						this.createSprinkleExplosion(e.clientX, e.clientY);
					}
				}
			};

			// Touch tap handler for explosions
			this.touchTapHandler = (e) => {
				if (this.isActive) {
					const touch = e.changedTouches[0];
					if (this.config.experienceMode === 'particle-field' && this.config.fieldClickExplosion) {
						this.createExplosion(touch.clientX, touch.clientY);
					} else if (this.config.experienceMode === 'sprinkle-trail' && this.config.sprinkleClickExplosion) {
						this.createSprinkleExplosion(touch.clientX, touch.clientY);
					}
				}
			};

			// SAFETY: Use smooth resize handler with debouncing
			this.resizeHandler = () => {
				this.handleResize();
			};

			// Visibility change handler - pause animation when tab is hidden
			this.visibilityChangeHandler = () => {
				this.isTabVisible = !document.hidden;
				
				if (this.isTabVisible && this.isActive) {
					// Resume animation when tab becomes visible
					if (!this.animationFrameId) {
						this.lastFrameTime = performance.now();
						this.lastUpdateTime = this.lastFrameTime; // FRAME RATE THROTTLING: Reset update time
						this.animate();
					}
				} else {
					// Pause animation when tab is hidden
					if (this.animationFrameId) {
						cancelAnimationFrame(this.animationFrameId);
						this.animationFrameId = null;
					}
				}
			};

			// SAFETY: Visual viewport resize handler with smooth transitions
			if (window.visualViewport) {
				this.visualViewportResizeHandler = () => {
					this.handleResize();
				};
				window.visualViewport.addEventListener('resize', this.visualViewportResizeHandler);
			}

			document.addEventListener('mousemove', this.mouseMoveHandler);
			document.addEventListener('mouseleave', this.mouseLeaveHandler);
			document.addEventListener('mouseenter', this.mouseEnterHandler);
			
			// Passive touch events for better scroll performance
			document.addEventListener('touchstart', this.touchStartHandler, { passive: true });
			document.addEventListener('touchmove', this.touchMoveHandler, { passive: true });
			document.addEventListener('touchend', this.touchEndHandler, { passive: true });
			document.addEventListener('touchcancel', this.touchEndHandler, { passive: true });
			
			document.addEventListener('click', this.clickHandler);
			// MEMORY LEAK FIX: Register touchTapHandler on touchend for tap explosions
			document.addEventListener('touchend', this.touchTapHandler);
			window.addEventListener('resize', this.resizeHandler);
			document.addEventListener('visibilitychange', this.visibilityChangeHandler);
		}

		toggle() {
			this.isActive = !this.isActive;
			
			// Save preference immediately
			sessionStorage.setItem('glitterBombActive', this.isActive.toString());
			
			// Update button UI
			this.updateButtonUI();

			// Announce to screen readers
			const announcement = this.isActive 
				? 'Sparkle effects enabled. ' + (this.config.experienceMode === 'particle-field' ? 'Magical glitter field activated.' : 'Particles will follow your cursor.')
				: 'Sparkle effects disabled.';
			this.srAnnouncement.textContent = announcement;

			if (this.isActive) {
				// Initialize particles if needed
				if (this.config.experienceMode === 'particle-field') {
					this.initializeParticleField();
					this.isInitialized = true;
				}
				this.start();
			} else {
				this.stop();
			}
		}

		start() {
			if (!this.animationFrameId && this.isTabVisible) {
				this.lastFrameTime = performance.now();
				this.lastUpdateTime = this.lastFrameTime; // FRAME RATE THROTTLING: Initialize update time
				this.animate();
			}
		}

		stop() {
			if (this.animationFrameId) {
				cancelAnimationFrame(this.animationFrameId);
				this.animationFrameId = null;
			}
			// Return all particles to pool
			this.particlePool.releaseAll();
			this.rockets = [];
			this.isInitialized = false;
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
		}

		// Initialize particle field with hundreds of particles
		initializeParticleField() {
			this.particlePool.releaseAll();

			if (this.config.fieldParticleStyle === 'fireworks') {
				this.rockets = [];
				this.rocketLaunchTimer = 0;
				return;
			}

			const count = this.config.fieldParticleCount;
			for (let i = 0; i < count; i++) {
				this.createFieldParticle();
			}
		}

		// Create a single field particle with physics properties
		createFieldParticle() {
			// Use mobile size if on mobile device
			const baseSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
			const x = Math.random() * this.logicalWidth;
			const y = Math.random() * this.logicalHeight;
			
			// Acquire particle from pool
			const particle = this.particlePool.acquire();
			
			// Initialize properties
			particle.x = x;
			particle.y = y;
			particle.homeX = x;
			particle.homeY = y;
			particle.vx = (Math.random() - 0.5) * 0.5;
			particle.vy = (Math.random() - 0.5) * 0.5;
			particle.baseSize = baseSize * (0.7 + Math.random() * 0.6);
			particle.size = particle.baseSize;
			particle.opacity = 0.6 + Math.random() * 0.4;
			particle.shimmerPhase = Math.random() * Math.PI * 2;
			particle.shimmerSpeed = 0.02 + Math.random() * 0.03;
			particle.rotation = Math.random() * Math.PI * 2;
			particle.rotationSpeed = (Math.random() - 0.5) * 0.02;
			particle.colorIndex = Math.random();
			particle.colorCycleSpeed = 0.001 + Math.random() * 0.002;
			particle.isExplosion = false;
			particle.explosionLife = 0;
			particle.driftAngle = Math.random() * Math.PI * 2;
			particle.driftSpeed = 0.2 + Math.random() * 0.3;
			particle.driftPhase = Math.random() * Math.PI * 2;

			// Pride confetti: assign fixed color and faster tumble speed
			if (this.config.fieldParticleStyle === 'pride-confetti') {
				const prideColors = this.colorPalettes['pride-confetti'];
				particle.color = prideColors[Math.floor(Math.random() * prideColors.length)];
				const tumbleSpeed = 0.03 + Math.random() * 0.06;
				particle.rotationSpeed = Math.random() < 0.5 ? tumbleSpeed : -tumbleSpeed;
			}

			// Snow: override size distribution for realistic flake variation; add fall physics
			if (this.config.fieldParticleStyle === 'snow') {
				const maxSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
				particle.baseSize = 1.5 + Math.pow(Math.random(), 1.8) * (maxSize - 1.5);
				particle.size = particle.baseSize;
				particle.fallSpeed = 0.4 + (particle.baseSize / maxSize) * 1.8;
				particle.vy = particle.fallSpeed * (0.2 + Math.random() * 0.5);
				particle.vx = 0;
				particle.driftPhase = Math.random() * Math.PI * 2;
				particle.driftSpeed = 0.008 + Math.random() * 0.015;
				particle.driftAngle = 0.3 + Math.random() * 0.5;
				particle.baseOpacity = 0.35 + Math.random() * 0.65;
				particle.opacity = particle.baseOpacity;
			}

			// Autumn leaves: fixed color from autumn palette, gravity fall, tumbling rotation
			if (this.config.fieldParticleStyle === 'autumn-leaves') {
				const maxSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
				particle.baseSize = maxSize * (0.5 + Math.pow(Math.random(), 0.5) * 0.8);
				particle.size = particle.baseSize;
				particle.fallSpeed = 0.3 + (particle.baseSize / Math.max(maxSize, 1)) * 1.0;
				particle.vy = particle.fallSpeed * (0.3 + Math.random() * 0.4);
				particle.vx = (Math.random() - 0.5) * 0.6;
				particle.driftPhase = Math.random() * Math.PI * 2;
				particle.driftSpeed = 0.012 + Math.random() * 0.018;
				particle.driftAngle = 0.6 + Math.random() * 1.0;
				particle.rotation = Math.random() * Math.PI * 2;
				particle.rotationSpeed = (Math.random() - 0.5) * 0.04;
				particle.baseOpacity = 0.75 + Math.random() * 0.25;
				particle.opacity = particle.baseOpacity;
				const autumnPalette = this.colorPalettes['autumn'];
				particle.leafColor = autumnPalette[Math.floor(Math.random() * autumnPalette.length)];
			}
		}

		// Create sprinkle burst on click/tap
		createSprinkleExplosion(x, y) {
			const isEmoji = this.config.sprinkleStyle === 'emoji';
			const count = isEmoji ? 10 : 20;
			const baseSize = isMobile ? this.config.particleSizeMobile : this.config.particleSize;
			for (let i = 0; i < count; i++) {
				const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
				const speed = 2 + Math.random() * 4;
				const particle = this.particlePool.acquire();
				particle.x = x;
				particle.y = y;
				particle.homeX = x;
				particle.homeY = y;
				particle.vx = Math.cos(angle) * speed;
				particle.vy = Math.sin(angle) * speed;
				particle.size = baseSize * (0.8 + Math.random() * 0.6);
				particle.baseSize = particle.size;
				particle.opacity = 1;
				particle.isExplosion = true;
				particle.explosionLife = 0.8 + Math.random() * 0.4;
				particle.color = this.getParticleColor();
				particle.colorIndex = Math.random();
				particle.colorCycleSpeed = 0;
				particle.rotation = 0;
				particle.rotationSpeed = 0;
				particle.driftAngle = 0;
				particle.driftSpeed = 0;
				particle.driftPhase = 0;
				particle.birthTime = 0;
				particle.maxLife = 0;
				particle.shimmerPhase = 0;
				particle.shimmerSpeed = 0;
			}
		}

		// Create powerful ripple explosion effect on click
		createExplosion(x, y) {
			// Fireworks: instant detonation at click point — skip regular explosion
			if (this.config.fieldParticleStyle === 'fireworks') {
				const paletteName = this.config.fieldColorPalette;
				const palette = this.colorPalettes[paletteName] || this.colorPalettes['fourth-of-july'];
				const clickRocket = {
					x: x,
					y: y,
					color: palette[Math.floor(Math.random() * palette.length)],
				};
				clickRocket.colorRgb = this.hexToRgb(clickRocket.color);
				const sparkleCount = Math.min(Math.floor(this.config.fieldParticleCount / 4), 60);
				this.explodeRocket(clickRocket, sparkleCount * 2);
				return;
			}
			const explosionRadius = 250;
			const explosionForce = 8;
			const isSnow = this.config.fieldParticleStyle === 'snow';
			const baseSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
			const self = this;

			// Push away existing particles (snow gets upward bias)
			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach(function(particle) {
				if (particle.isExplosion) return;
				const dx = particle.x - x;
				const dy = particle.y - y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				if (distance < explosionRadius && distance > 0) {
					const force = (1 - distance / explosionRadius) * explosionForce;
					const angle = Math.atan2(dy, dx);
					particle.vx += Math.cos(angle) * force * (isSnow ? 0.4 : 1);
					particle.vy += Math.sin(angle) * force * (isSnow ? 0.4 : 1);
					if (isSnow) { particle.vy -= force * 0.6; }
				}
			});

			if (isSnow) {
				// Snow burst: flakes kicked upward in an arc, falling back under gravity
				const burstCount = 35;
				for (let i = 0; i < burstCount; i++) {
					const burstAngle = -(Math.random() * Math.PI); // upward hemisphere
					const speed = 3 + Math.random() * 7;
					const sz = Math.max(1.5, 1.5 + Math.pow(Math.random(), 1.8) * (baseSize - 1.5));
					const particle = this.particlePool.acquire();
					particle.x = x + (Math.random() - 0.5) * 30;
					particle.y = y;
					particle.homeX = x;
					particle.homeY = y;
					particle.vx = Math.cos(burstAngle) * speed;
					particle.vy = Math.sin(burstAngle) * speed;
					particle.baseSize = sz;
					particle.size = sz;
					particle.fallSpeed = 0.4 + (sz / Math.max(baseSize, 1)) * 1.8;
					particle.baseOpacity = 0.8 + Math.random() * 0.2;
					particle.opacity = particle.baseOpacity;
					particle.shimmerPhase = Math.random() * Math.PI * 2;
					particle.driftPhase = Math.random() * Math.PI * 2;
					particle.driftSpeed = 0.008 + Math.random() * 0.015;
					particle.driftAngle = 0.5;
					particle.isExplosion = true;
					particle.explosionLife = 1;
					particle.colorIndex = 0;
					particle.colorCycleSpeed = 0;
					particle.rotation = 0;
					particle.rotationSpeed = 0;
				}
			} else {
				// Regular sparkle burst
				const sparkleCount = 40;
				for (let i = 0; i < sparkleCount; i++) {
					const angle = (Math.PI * 2 * i) / sparkleCount;
					const speed = 3 + Math.random() * 5;
					const particle = this.particlePool.acquire();
					particle.x = x;
					particle.y = y;
					particle.homeX = x;
					particle.homeY = y;
					particle.vx = Math.cos(angle) * speed;
					particle.vy = Math.sin(angle) * speed;
					particle.baseSize = baseSize * (1 + Math.random() * 0.8);
					particle.size = particle.baseSize;
					particle.opacity = 1;
					particle.shimmerPhase = Math.random() * Math.PI * 2;
					particle.shimmerSpeed = 0.05 + Math.random() * 0.05;
					particle.rotation = Math.random() * Math.PI * 2;
					particle.rotationSpeed = (Math.random() - 0.5) * 0.1;
					particle.colorIndex = Math.random();
					particle.colorCycleSpeed = 0.002;
					particle.isExplosion = true;
					particle.explosionLife = 1;
					particle.driftAngle = 0;
					particle.driftSpeed = 0;
					particle.driftPhase = 0;
					if (self.config.fieldParticleStyle === 'pride-confetti') {
						const prideColors = self.colorPalettes['pride-confetti'];
						particle.color = prideColors[Math.floor(Math.random() * prideColors.length)];
					}
					if (self.config.fieldParticleStyle === 'autumn-leaves') {
						const autumnPalette = self.colorPalettes['autumn'];
						particle.leafColor = autumnPalette[Math.floor(Math.random() * autumnPalette.length)];
						particle.rotation = Math.random() * Math.PI * 2;
						particle.rotationSpeed = (Math.random() - 0.5) * 0.06;
					}
				}
			}
		}
		getParticleColor(particle) {
			// Pride confetti: color is fixed at creation and stored directly on the particle
			if (this.config.fieldParticleStyle === 'pride-confetti' && particle && particle.color) {
				return this.hexToRgba(particle.color, particle.opacity);
			}

			const palette = this.config.experienceMode === 'particle-field'
				? (this.config.fieldParticleStyle === 'love-bomb' ? 'love-bomb' : this.config.fieldColorPalette)
				: this.config.colorPalette;
			
			// Custom color doesn't cycle
			if (palette === 'custom') {
				const opacity = particle ? particle.opacity : this.config.particleOpacity;
				return this.hexToRgba(this.config.customColor, opacity);
			}

			// Get color from palette
			const colors = this.colorPalettes[palette];
			
			if (this.config.experienceMode === 'particle-field' && particle) {
				// For particle field, use particle's cycling colorIndex
				const colorCount = colors.length;
				const currentIndex = Math.floor(particle.colorIndex * colorCount) % colorCount;
				const nextIndex = (currentIndex + 1) % colorCount;
				
				// Calculate blend factor for smooth transition
				const blendFactor = (particle.colorIndex * colorCount) % 1;
				
				// Blend between current and next color
				const currentColor = this.hexToRgb(colors[currentIndex]);
				const nextColor = this.hexToRgb(colors[nextIndex]);
				
				const r = Math.round(currentColor.r + (nextColor.r - currentColor.r) * blendFactor);
				const g = Math.round(currentColor.g + (nextColor.g - currentColor.g) * blendFactor);
				const b = Math.round(currentColor.b + (nextColor.b - currentColor.b) * blendFactor);
				
				return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + particle.opacity + ')';
			} else {
				// For sprinkle trail, cycle through colors
				this.paletteIndex = (this.paletteIndex + 0.05) % colors.length;
				const color = colors[Math.floor(this.paletteIndex)];
				return this.hexToRgba(color, this.config.particleOpacity);
			}
		}

		hexToRgb(hex) {
			const r = parseInt(hex.slice(1, 3), 16);
			const g = parseInt(hex.slice(3, 5), 16);
			const b = parseInt(hex.slice(5, 7), 16);
			return { r: r, g: g, b: b };
		}

		hexToRgba(hex, opacity) {
			const rgb = this.hexToRgb(hex);
			return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + opacity + ')';
		}

		// Create sprinkle trail particle with distance-based spacing
		createParticle(x, y) {
			// Calculate distance from last particle
			const dx = x - this.lastParticleX;
			const dy = y - this.lastParticleY;
			const distance = Math.sqrt(dx * dx + dy * dy);
			
			// Minimum spacing between particles (adjust this value for desired spacing)
			// Use larger spacing for mobile, smaller for desktop
			const minSpacing = isMobile ? 12 : 8;
			
			// Only create particle if we've moved far enough
			if (distance < minSpacing) {
				return;
			}
			
			// Update last particle position
			this.lastParticleX = x;
			this.lastParticleY = y;

			// Enforce particle limit
			const activeParticles = this.particlePool.getActive();
			if (activeParticles.length >= this.config.maxParticles) {
				// Release oldest particle
				this.particlePool.release(activeParticles[0]);
			}

			const isCompact = this.config.displayBehavior === 'compact';
			const timestamp = performance.now();
			// Use mobile size if on mobile device
			const size = isMobile ? this.config.particleSizeMobile : this.config.particleSize;

			// Acquire particle from pool
			const particle = this.particlePool.acquire();
			
			// Initialize properties
			particle.x = x;
			particle.y = y;
			particle.size = size;
			particle.color = this.getParticleColor();
			particle.opacity = this.config.particleOpacity;
			particle.birthTime = timestamp;
			particle.maxLife = this.config.animationDuration;
			particle.vx = isCompact ? 0 : (Math.random() - 0.5) * 2;
			particle.vy = isCompact ? 0 : (Math.random() - 0.5) * 2;
		}

		// Update sprinkle trail particles
		updateSprinkleParticles(currentTime) {
			const isCompact = this.config.displayBehavior === 'compact';
			const activeParticles = this.particlePool.getActive();
			const particleCount = activeParticles.length;

			// Process particles in reverse to safely remove dead ones
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];

				// Explosion particles from click burst — handled separately
				if (particle.isExplosion) {
					particle.explosionLife -= 0.02;
					particle.opacity = Math.max(0, particle.explosionLife);
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.vx *= 0.94;
					particle.vy *= 0.94;
					if (particle.explosionLife <= 0) { this.particlePool.release(particle); }
					continue;
				}

				// Calculate age and life ratio
				const age = currentTime - particle.birthTime;
				const lifeRatio = Math.max(0, 1 - (age / particle.maxLife));

				// Update position for scattered behavior
				if (!isCompact) {
					particle.x += particle.vx;
					particle.y += particle.vy;
				}

				// Sequential fade using both age and position in trail
				// positionRatio: oldest particle (index 0) is dimmest, newest is brightest
				const positionRatio = particleCount > 1 ? (i + 1) / particleCount : 1;

				// Use the lower of age-based or position-based fade:
				// - Slow movement: lifeRatio naturally varies, creating gradient
				// - Fast movement: lifeRatio is similar for all, positionRatio creates gradient
				particle.opacity = this.config.particleOpacity * Math.min(lifeRatio, positionRatio);

				// Remove dead particles or particles that went too far off-screen
				if (age >= particle.maxLife || particle.opacity <= 0.01 ||
					(Math.abs(particle.x) > this.logicalWidth * 2 || Math.abs(particle.y) > this.logicalHeight * 2)) {
					this.particlePool.release(particle);
				}
			}
		}

		// Update particle field particles with physics
		updateFieldParticles() {
			const activeParticles = this.particlePool.getActive();
			
			// Process particles in reverse to safely remove dead ones
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];
				
				// Update color cycling: always cycle for love-bomb (own palette), skip for pride-confetti (fixed colors), skip for custom palette
				const shouldCycle = this.config.fieldParticleStyle === 'love-bomb' ||
					(this.config.fieldColorPalette !== 'custom' && this.config.fieldParticleStyle !== 'pride-confetti');
				if (shouldCycle) {
					particle.colorIndex = (particle.colorIndex + particle.colorCycleSpeed) % 1;
				}
				
				// Handle explosion particles
				if (particle.isExplosion) {
					particle.explosionLife -= 0.02;
					particle.opacity = Math.max(0, particle.explosionLife);
					
					// Apply velocity with decay
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.vx *= 0.95;
					particle.vy *= 0.95;
					
					if (particle.explosionLife <= 0) {
						this.particlePool.release(particle);
						continue;
					}
				} else {
					// Add gentle ambient drift movement - increased for more visible motion
					particle.driftPhase += 0.015;
					const driftX = Math.cos(particle.driftAngle + particle.driftPhase) * particle.driftSpeed;
					const driftY = Math.sin(particle.driftAngle + particle.driftPhase * 0.7) * particle.driftSpeed;
					
					particle.vx += driftX * 0.03;
					particle.vy += driftY * 0.03;
					
					// Mouse attraction or return home force
					if (this.mouseInViewport) {
						// Refined mouse attraction when mouse is in viewport
						const dx = this.mouseX - particle.x;
						const dy = this.mouseY - particle.y;
						const distance = Math.sqrt(dx * dx + dy * dy);
						
						// Larger attraction range - affects whole screen but more subtle
						const maxAttractionDistance = Math.max(this.logicalWidth, this.logicalHeight);
						
						if (distance > 0 && distance < maxAttractionDistance) {
							// Use exponential falloff (^3) for much slower movement at distance
							const normalizedDistance = distance / maxAttractionDistance;
							const attractionStrength = Math.pow(1 - normalizedDistance, 3);
							const force = attractionStrength * this.config.fieldMouseAttraction * 0.08;
							
							particle.vx += (dx / distance) * force;
							particle.vy += (dy / distance) * force;
						}
					} else {
						// Gentle return home force when mouse leaves viewport
						const homeX = particle.homeX;
						const homeY = particle.homeY;
						const dx = homeX - particle.x;
						const dy = homeY - particle.y;
						const distance = Math.sqrt(dx * dx + dy * dy);
						
						if (distance > 1) {
							// Gentle elastic force pulling toward home position
							const returnForce = 0.002;
							particle.vx += (dx / distance) * returnForce * distance * 0.05;
							particle.vy += (dy / distance) * returnForce * distance * 0.05;
						}
					}

					// Particle spreading (separation) - simplified for performance
					for (let j = i + 1; j < activeParticles.length; j++) {
						const other = activeParticles[j];
						if (other.isExplosion) continue;
						
						const dx2 = other.x - particle.x;
						const dy2 = other.y - particle.y;
						const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
						
						if (dist2 > 0 && dist2 < 30) {
							const force = (30 - dist2) / 30 * this.config.fieldSpreadStrength * 0.05;
							particle.vx -= (dx2 / dist2) * force;
							particle.vy -= (dy2 / dist2) * force;
						}
					}
				}

				// Apply velocity
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Damping
				if (!particle.isExplosion) {
					particle.vx *= 0.95;
					particle.vy *= 0.95;
				}

				// Wrap around screen edges
				if (particle.x < 0) particle.x = this.logicalWidth;
				if (particle.x > this.logicalWidth) particle.x = 0;
				if (particle.y < 0) particle.y = this.logicalHeight;
				if (particle.y > this.logicalHeight) particle.y = 0;

				// Update shimmer animation
				particle.shimmerPhase += particle.shimmerSpeed;
				const shimmer = (Math.sin(particle.shimmerPhase) + 1) / 2;
				particle.size = particle.baseSize * (0.7 + shimmer * 0.3);

				// Update rotation
				particle.rotation += particle.rotationSpeed;
			}
		}

		// Update fireworks — manages rocket launching, ascent, explosion, and falling sparkles
		updateFireworksParticles() {
			const paletteName = this.config.fieldColorPalette;
			const palette = this.colorPalettes[paletteName] || this.colorPalettes['fourth-of-july'];
			// Launch rate: fieldMouseAttraction 0→1 maps to ~3s→0.4s interval
			const launchInterval = Math.max(25, Math.round(180 - this.config.fieldMouseAttraction * 155));
			const sparklesPerBurst = Math.min(Math.floor(this.config.fieldParticleCount / 4), 60);

			// Auto-launch rockets on timer
			this.rocketLaunchTimer++;
			if (this.rocketLaunchTimer >= launchInterval && this.rockets.length < 12) {
				this.launchRocket(palette);
				if (Math.random() < 0.35) { this.launchRocket(palette); } // occasional double
				this.rocketLaunchTimer = 0;
			}

			// Update rockets — move upward, detect peak, explode
			for (let i = this.rockets.length - 1; i >= 0; i--) {
				const rocket = this.rockets[i];
				rocket.vy += 0.09; // gravity decelerates the ascent
				rocket.x += rocket.vx;
				rocket.y += rocket.vy;
				// Explode at peak (velocity crosses zero) or if off-screen
				if (rocket.vy >= -0.3) {
					this.explodeRocket(rocket, sparklesPerBurst);
					this.rockets.splice(i, 1);
				} else if (rocket.y < -100) {
					this.rockets.splice(i, 1);
				}
			}

			// Update falling sparkles
			const activeParticles = this.particlePool.getActive();
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];
				particle.vy += 0.1;
				particle.vx *= 0.99;
				particle.x += particle.vx;
				particle.y += particle.vy;
				particle.explosionLife -= 0.01;
				particle.opacity = Math.max(0, particle.explosionLife);
				particle.size = particle.baseSize * Math.max(0, particle.explosionLife);
				if (particle.explosionLife <= 0 || particle.y > this.logicalHeight + 50) {
					this.particlePool.release(particle);
				}
			}
		}

		// Launch a single rocket from a scattered position in the lower screen
		launchRocket(palette) {
			const color = palette[Math.floor(Math.random() * palette.length)];
			const speed = 7 + Math.random() * 5;
			this.rockets.push({
				x: Math.random() * this.logicalWidth,
				y: this.logicalHeight * (0.45 + Math.random() * 0.45),
				vx: (Math.random() - 0.5) * 1.5,
				vy: -speed,
				color: color,
				colorRgb: this.hexToRgb(color),
			});
		}

		// Spawn sparkle particles at explosion point
		explodeRocket(rocket, sparkleCount) {
			const baseSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
			const rgb = rocket.colorRgb;
			for (let i = 0; i < sparkleCount; i++) {
				const angle = (Math.PI * 2 * i / sparkleCount) + (Math.random() - 0.5) * 0.4;
				const speed = 1 + Math.random() * 3;
				const particle = this.particlePool.acquire();
				particle.x = rocket.x;
				particle.y = rocket.y;
				particle.homeX = rocket.x;
				particle.homeY = rocket.y;
				particle.vx = Math.cos(angle) * speed;
				particle.vy = Math.sin(angle) * speed - 0.8;
				particle.baseSize = baseSize * (0.3 + Math.random() * 0.5);
				particle.size = particle.baseSize;
				particle.color = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
				particle.opacity = 1;
				particle.isExplosion = true;
				particle.explosionLife = 0.6 + Math.random() * 0.6;
				particle.colorIndex = 0;
				particle.colorCycleSpeed = 0;
				particle.rotation = 0;
				particle.rotationSpeed = 0;
				particle.driftAngle = 0;
				particle.driftSpeed = 0;
				particle.driftPhase = 0;
			}
		}

		// Draw rockets (glowing trail + bright head) and falling sparkles
		drawFireworksParticles() {
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

			// Rockets
			this.rockets.forEach((rocket) => {
				const rgb = rocket.colorRgb;
				const trailX = rocket.x - rocket.vx * 18;
				const trailY = rocket.y - rocket.vy * 18;
				const grad = this.ctx.createLinearGradient(rocket.x, rocket.y, trailX, trailY);
				grad.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.9)`);
				grad.addColorStop(0.5, 'rgba(255, 220, 120, 0.5)');
				grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
				this.ctx.beginPath();
				this.ctx.moveTo(rocket.x, rocket.y);
				this.ctx.lineTo(trailX, trailY);
				this.ctx.strokeStyle = grad;
				this.ctx.lineWidth = 2;
				this.ctx.stroke();
				// Bright white head
				this.ctx.beginPath();
				this.ctx.arc(rocket.x, rocket.y, 2.5, 0, Math.PI * 2);
				this.ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
				this.ctx.fill();
			});

			// Sparkles with glow
			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach((particle) => {
				if (particle.opacity <= 0 || particle.size <= 0) return;
				const color = particle.color.replace(/[\d.]+\)$/, particle.opacity + ')');
				const glow = particle.color.replace(/[\d.]+\)$/, (particle.opacity * 0.25) + ')');
				// Outer glow
				this.ctx.beginPath();
				this.ctx.arc(particle.x, particle.y, particle.size * 2.5, 0, Math.PI * 2);
				this.ctx.fillStyle = glow;
				this.ctx.fill();
				// Bright core
				this.ctx.beginPath();
				this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				this.ctx.fillStyle = color;
				this.ctx.fill();
			});
		}

		// Update snow field particles with gravity and drift physics
		updateSnowParticles() {
			const attraction = this.config.fieldMouseAttraction;
			const disturbanceRadius = 120;
			const activeParticles = this.particlePool.getActive();
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];

				if (particle.isExplosion) {
					// Snow explosion: upward burst arcing back down under gravity
					particle.vy += 0.25;
					particle.vx *= 0.98;
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.explosionLife -= 0.016;
					particle.opacity = Math.max(0, particle.explosionLife * (particle.baseOpacity || 0.9));
					if (particle.explosionLife <= 0) {
						this.particlePool.release(particle);
					}
					continue;
				}

				// Gravity: accelerate toward terminal velocity
				if (particle.vy < particle.fallSpeed) {
					particle.vy += 0.04;
				}

				// Sinusoidal horizontal drift — each flake has a unique phase and frequency
				particle.driftPhase += particle.driftSpeed;
				particle.vx = Math.sin(particle.driftPhase) * particle.driftAngle;

				// Mouse disturbance: warm air rising from cursor pushes snow outward and upward
				if (attraction > 0 && this.mouseInViewport) {
					const dx = particle.x - this.mouseX;
					const dy = particle.y - this.mouseY;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < disturbanceRadius && dist > 0) {
						const force = (1 - dist / disturbanceRadius) * attraction * 1.5;
						particle.vx += (dx / dist) * force * 0.5;
						particle.vy -= force * 0.4;
					}
				}

				// Update position
				particle.x += particle.vx;
				particle.y += particle.vy;

				// Wrap horizontally
				if (particle.x < -particle.size) particle.x = this.logicalWidth + particle.size;
				if (particle.x > this.logicalWidth + particle.size) particle.x = -particle.size;

				// Respawn at top when flake exits the bottom
				if (particle.y > this.logicalHeight + particle.size) {
					particle.x = Math.random() * this.logicalWidth;
					particle.y = -particle.size - Math.random() * 30;
					particle.vy = particle.fallSpeed * (0.2 + Math.random() * 0.3);
				}

				// Subtle opacity shimmer for depth realism
				particle.shimmerPhase += 0.018;
				const shimmer = (Math.sin(particle.shimmerPhase) + 1) / 2;
				particle.opacity = particle.baseOpacity * (0.75 + shimmer * 0.25);
			}
		}

		updateAutumnParticles() {
			const attraction = this.config.fieldMouseAttraction;
			const windRadius = 150;
			const activeParticles = this.particlePool.getActive();
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];

				if (particle.isExplosion) {
					particle.vy += 0.18;
					particle.vx *= 0.97;
					particle.rotation += particle.rotationSpeed * 2;
					particle.x += particle.vx;
					particle.y += particle.vy;
					particle.explosionLife -= 0.018;
					particle.opacity = Math.max(0, particle.explosionLife * (particle.baseOpacity || 0.8));
					if (particle.explosionLife <= 0) {
						this.particlePool.release(particle);
					}
					continue;
				}

				// Gravity: gentle — leaves fall slower than snow
				if (particle.vy < particle.fallSpeed) {
					particle.vy += 0.025;
				}

				// Sinusoidal horizontal drift — leaves sway in the breeze
				particle.driftPhase += particle.driftSpeed;
				particle.vx = Math.sin(particle.driftPhase) * particle.driftAngle;

				// Tumbling rotation as the leaf falls
				particle.rotation += particle.rotationSpeed;

				// Mouse as wind gust: pushes leaves sideways
				if (attraction > 0 && this.mouseInViewport) {
					const dx = particle.x - this.mouseX;
					const dy = particle.y - this.mouseY;
					const dist = Math.sqrt(dx * dx + dy * dy);
					if (dist < windRadius && dist > 0) {
						const force = (1 - dist / windRadius) * attraction * 1.2;
						particle.vx += (dx / dist) * force * 0.8;
						particle.vy -= force * 0.1;
					}
				}

				particle.x += particle.vx;
				particle.y += particle.vy;

				// Wrap horizontally
				if (particle.x < -particle.size * 2) particle.x = this.logicalWidth + particle.size * 2;
				if (particle.x > this.logicalWidth + particle.size * 2) particle.x = -particle.size * 2;

				// Respawn at top when leaf exits bottom
				if (particle.y > this.logicalHeight + particle.size * 2) {
					particle.x = Math.random() * this.logicalWidth;
					particle.y = -particle.size * 2 - Math.random() * 30;
					particle.vy = particle.fallSpeed * (0.3 + Math.random() * 0.3);
					particle.rotation = Math.random() * Math.PI * 2;
				}
			}
		}

		// Draw sprinkle trail particles
		drawSprinkleParticles() {
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

			const isEmoji = this.config.sprinkleStyle === 'emoji';
			const emoji = this.config.sprinkleEmoji || '✨';

			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach((particle) => {
				if (isEmoji) {
					this.ctx.save();
					this.ctx.globalAlpha = particle.opacity;
					this.ctx.font = `${Math.round(particle.size * 2)}px serif`;
					this.ctx.textAlign = 'center';
					this.ctx.textBaseline = 'middle';
					this.ctx.fillText(emoji, particle.x, particle.y);
					this.ctx.restore();
					this.ctx.globalAlpha = 1;
				} else {
					this.ctx.beginPath();
					this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
					this.ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, particle.opacity + ')');
					this.ctx.fill();
				}
			});
		}

		// Draw particle field with glitter effect
		drawFieldParticles() {
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

			const style = this.config.fieldParticleStyle;
			const opacityMult = this.config.fieldParticleOpacity !== undefined ? this.config.fieldParticleOpacity : 1;
			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach((particle) => {
				const origOpacity = particle.opacity;
				particle.opacity = origOpacity * opacityMult;
				if (style === 'pride-confetti') {
					this.drawPrideConfetti(particle);
				} else if (style === 'love-bomb') {
					this.drawLoveBombHeart(particle);
				} else if (style === 'snow') {
					this.drawSnowParticle(particle);
				} else if (style === 'autumn-leaves') {
					this.drawAutumnLeaf(particle);
				} else {
					this.ctx.save();
					this.ctx.globalAlpha = particle.opacity;
					this.ctx.translate(particle.x, particle.y);
					this.ctx.rotate(particle.rotation);

					// Get color with current particle state for cycling
					const color = this.getParticleColor(particle);
					
					// Draw 5-element glitter sparkle
					const elements = 5;
					for (let i = 0; i < elements; i++) {
						this.ctx.beginPath();
						const angle = (Math.PI * 2 * i) / elements;
						const length = particle.size * 1.5;
						
						// Create diamond shape for each element
						this.ctx.moveTo(0, 0);
						this.ctx.lineTo(
							Math.cos(angle) * length,
							Math.sin(angle) * length
						);
						this.ctx.lineTo(
							Math.cos(angle + 0.1) * (length * 0.5),
							Math.sin(angle + 0.1) * (length * 0.5)
						);
						this.ctx.closePath();
						
						this.ctx.fillStyle = color;
						this.ctx.fill();
					}
					
					// Draw center glow
					this.ctx.beginPath();
					this.ctx.arc(0, 0, particle.size * 0.5, 0, Math.PI * 2);
					this.ctx.fillStyle = color;
					this.ctx.fill();
					
					this.ctx.restore();
				}
				particle.opacity = origOpacity;
			});
		}

		// Draw love bomb heart particle — bezier heart path with cycling love palette
		drawLoveBombHeart(particle) {
			const s = particle.size;
			const color = this.getParticleColor(particle);

			this.ctx.save();
			this.ctx.translate(particle.x, particle.y);
			this.ctx.rotate(particle.rotation);

			this.ctx.beginPath();
			// Start at top-center dip, draw right lobe to bottom point, then left lobe back
			this.ctx.moveTo(0, -s * 0.5);
			this.ctx.bezierCurveTo(s * 0.5, -s * 1.1, s * 1.2, -s * 0.3, 0, s * 0.7);
			this.ctx.bezierCurveTo(-s * 1.2, -s * 0.3, -s * 0.5, -s * 1.1, 0, -s * 0.5);
			this.ctx.closePath();

			this.ctx.globalAlpha = particle.opacity;
			this.ctx.fillStyle = color;
			this.ctx.fill();
			this.ctx.restore();
			this.ctx.globalAlpha = 1;
		}

		// Draw pride confetti particle — flat tumbling rectangle in a fixed pride color
		drawPrideConfetti(particle) {
			const halfH = particle.size * 0.5;
			const halfW = particle.size * 1.0; // 2:1 width-to-height rectangle

			this.ctx.save();
			this.ctx.translate(particle.x, particle.y);
			this.ctx.rotate(particle.rotation);
			this.ctx.globalAlpha = particle.opacity;
			this.ctx.fillStyle = particle.color;
			this.ctx.fillRect(-halfW, -halfH, halfW * 2, halfH * 2);
			this.ctx.restore();
			this.ctx.globalAlpha = 1;
		}

		// Draw individual snow particle — soft radial gradient for photorealistic look
		drawSnowParticle(particle) {
			const x = particle.x;
			const y = particle.y;
			const s = particle.size;
			const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, s);
			gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
			gradient.addColorStop(0.45, 'rgba(240, 248, 255, 0.85)');
			gradient.addColorStop(1, 'rgba(200, 228, 255, 0)');
			this.ctx.save();
			this.ctx.globalAlpha = particle.opacity;
			this.ctx.beginPath();
			this.ctx.arc(x, y, s, 0, Math.PI * 2);
			this.ctx.fillStyle = gradient;
			this.ctx.fill();
			this.ctx.restore();
		}

		drawAutumnLeaf(particle) {
			const ctx = this.ctx;
			ctx.save();
			ctx.globalAlpha = particle.opacity;
			ctx.translate(particle.x, particle.y);
			ctx.rotate(particle.rotation);
			const s = particle.size;

			// Pointed-oval leaf shape: two bezier curves
			ctx.beginPath();
			ctx.moveTo(0, -s * 1.2);
			ctx.bezierCurveTo(s * 0.75, -s * 0.5, s * 0.75, s * 0.5, 0, s * 1.0);
			ctx.bezierCurveTo(-s * 0.75, s * 0.5, -s * 0.75, -s * 0.5, 0, -s * 1.2);
			ctx.fillStyle = particle.leafColor || '#C44B0C';
			ctx.fill();

			// Midrib vein
			ctx.beginPath();
			ctx.moveTo(0, -s * 1.2);
			ctx.lineTo(0, s * 1.0);
			ctx.strokeStyle = 'rgba(0,0,0,0.18)';
			ctx.lineWidth = Math.max(0.5, s * 0.08);
			ctx.stroke();

			// Short stem
			ctx.beginPath();
			ctx.moveTo(0, s * 1.0);
			ctx.lineTo(0, s * 1.6);
			ctx.strokeStyle = 'rgba(101, 67, 33, 0.55)';
			ctx.lineWidth = Math.max(0.5, s * 0.1);
			ctx.stroke();

			ctx.restore();
			ctx.globalAlpha = 1;
		}

		animate() {
			// Only continue if tab is visible and effects are active
			if (!this.isTabVisible || !this.isActive) {
				this.animationFrameId = null;
				return;
			}

			const currentTime = performance.now();
			
			// FRAME RATE THROTTLING: Only update physics at target FPS (60 FPS)
			const deltaTime = currentTime - this.lastUpdateTime;
			
			if (deltaTime >= FRAME_DURATION) {
				// Time to update physics
				// SAFETY: Update canvas opacity for smooth transitions
				this.updateCanvasOpacity();
				
				if (this.config.experienceMode === 'sprinkle-trail') {
					this.updateSprinkleParticles(currentTime);
					this.drawSprinkleParticles();
				} else if (this.config.fieldParticleStyle === 'snow') {
					this.updateSnowParticles();
					this.drawFieldParticles();
				} else if (this.config.fieldParticleStyle === 'autumn-leaves') {
					this.updateAutumnParticles();
					this.drawFieldParticles();
				} else if (this.config.fieldParticleStyle === 'fireworks') {
					this.updateFireworksParticles();
					this.drawFireworksParticles();
				} else {
					this.updateFieldParticles();
					this.drawFieldParticles();
				}
				
				// Update last update time, accounting for any drift
				this.lastUpdateTime = currentTime - (deltaTime % FRAME_DURATION);
			} else {
				// Too soon for physics update, but we can still redraw for smoother visuals on high-Hz displays
				// This keeps the rendering smooth even when physics is capped at 60 FPS
				if (this.config.experienceMode === 'sprinkle-trail') {
					this.drawSprinkleParticles();
				} else if (this.config.fieldParticleStyle === 'fireworks') {
					this.drawFireworksParticles();
				} else {
					this.drawFieldParticles();
				}
			}
			
			// Continue animation loop at display's native refresh rate
			this.animationFrameId = requestAnimationFrame(() => this.animate());
		}

		destroy() {
			// Clear debounce timer
			if (this.resizeDebounceTimer) {
				clearTimeout(this.resizeDebounceTimer);
			}

			// Clean up event listeners
			document.removeEventListener('mousemove', this.mouseMoveHandler);
			document.removeEventListener('mouseleave', this.mouseLeaveHandler);
			document.removeEventListener('mouseenter', this.mouseEnterHandler);
			document.removeEventListener('touchstart', this.touchStartHandler);
			document.removeEventListener('touchmove', this.touchMoveHandler);
			document.removeEventListener('touchend', this.touchEndHandler);
			document.removeEventListener('touchcancel', this.touchEndHandler);
			document.removeEventListener('click', this.clickHandler);
			// MEMORY LEAK FIX: Remove touchTapHandler that was registered on touchend
			document.removeEventListener('touchend', this.touchTapHandler);
			window.removeEventListener('resize', this.resizeHandler);
			document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
			
			if (window.visualViewport && this.visualViewportResizeHandler) {
				window.visualViewport.removeEventListener('resize', this.visualViewportResizeHandler);
			}

			// Stop animation
			this.stop();

			// Remove DOM elements
			if (this.canvas && this.canvas.parentNode) {
				this.canvas.parentNode.removeChild(this.canvas);
			}
			if (this.button && this.button.parentNode) {
				this.button.parentNode.removeChild(this.button);
			}
			if (this.srAnnouncement && this.srAnnouncement.parentNode) {
				this.srAnnouncement.parentNode.removeChild(this.srAnnouncement);
			}
		}
	}

	// Initialize when DOM is ready
	function init() {
		const blocks = document.querySelectorAll('.wp-block-glitter-bomb-glitter-bomb');
		
		blocks.forEach(function(block) {
			// Only initialize once per block
			if (!block.glitterBombInstance) {
				block.glitterBombInstance = new GlitterBombParticles(block);
			}
		});
	}

	// Run on DOM ready
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	// Cleanup on page unload
	window.addEventListener('beforeunload', function() {
		const blocks = document.querySelectorAll('.wp-block-glitter-bomb-glitter-bomb');
		blocks.forEach(function(block) {
			if (block.glitterBombInstance) {
				block.glitterBombInstance.destroy();
			}
		});
	});

})();