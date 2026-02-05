/**
 * Glitter Bomb Particles - Frontend Interactive Script
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
		title.appendChild(document.createTextNode('✨ Glitter Bomb Particles ✨'));
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
		console.warn('Glitter Bomb Particles: Browser not supported. Missing features:', browserSupport.missing);
		
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
				fieldMouseAttraction: parseFloat(blockElement.dataset.fieldMouseAttraction) || 0.5,
				fieldSpreadStrength: parseFloat(blockElement.dataset.fieldSpreadStrength) || 0.3,
				fieldClickExplosion: blockElement.dataset.fieldClickExplosion === 'true',
				disableOnMobile: blockElement.dataset.disableOnMobile === 'true',
			};

			// Color palettes with cycling support
			this.colorPalettes = {
				'rainbow-cycling': ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
				'metallic': ['#C0C0C0', '#D4AF37', '#E5E4E2', '#B87333', '#AAA9AD', '#CD7F32', '#CFCFCF'],
				'neutral-spectrum': ['#8B8B8B', '#A9A9A9', '#C0C0C0', '#D3D3D3', '#E0E0E0'],
				'warm-sunset': ['#FF6B6B', '#FFA07A', '#FFD700', '#FF8C00', '#FF4500'],
				'cool-ocean': ['#00CED1', '#20B2AA', '#48D1CC', '#40E0D0', '#00FFFF'],
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

			// STEP 3: Update button UI to match state
			this.updateButtonUI();

			// STEP 4: If active and motion not reduced, initialize particles and start
			if (this.isActive && !prefersReducedMotion) {
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
			
			// Calculate canvas scaling for mobile devices
			this.calculateCanvasSize();
			
			document.body.appendChild(this.canvas);
			
			// SAFARI PRIVACY: Get context with explicit non-fingerprinting attributes
			// Setting willReadFrequently: false signals this is purely visual rendering
			// Setting alpha: true is standard for transparency (not fingerprinting)
			// Setting desynchronized: true can improve performance and signals animation intent
			this.ctx = this.canvas.getContext('2d', {
				alpha: true,
				willReadFrequently: false,
				desynchronized: true
			});
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
				
				if (this.isActive && !prefersReducedMotion) {
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
				if (!this.isActive || prefersReducedMotion) return;
				
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
				if (!this.isActive || prefersReducedMotion) return;
				
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
				if (this.isActive && !prefersReducedMotion && 
					this.config.experienceMode === 'particle-field' && 
					this.config.fieldClickExplosion) {
					this.createExplosion(e.clientX, e.clientY);
				}
			};

			// Touch tap handler for explosions
			this.touchTapHandler = (e) => {
				if (this.isActive && !prefersReducedMotion && 
					this.config.experienceMode === 'particle-field' && 
					this.config.fieldClickExplosion) {
					const touch = e.changedTouches[0];
					this.createExplosion(touch.clientX, touch.clientY);
				}
			};

			// SAFETY: Use smooth resize handler with debouncing
			this.resizeHandler = () => {
				this.handleResize();
			};

			// Visibility change handler - pause animation when tab is hidden
			this.visibilityChangeHandler = () => {
				this.isTabVisible = !document.hidden;
				
				if (this.isTabVisible && this.isActive && !prefersReducedMotion) {
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

			if (this.isActive && !prefersReducedMotion) {
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
			this.isInitialized = false;
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
		}

		// Initialize particle field with hundreds of particles
		initializeParticleField() {
			// Return all particles to pool first
			this.particlePool.releaseAll();
			
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
		}

		// Create powerful ripple explosion effect on click
		createExplosion(x, y) {
			// Much larger explosion radius to clear the area
			const explosionRadius = 250;
			const explosionForce = 8;
			
			// Push away all particles within radius
			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach(function(particle) {
				if (particle.isExplosion) return;
				
				const dx = particle.x - x;
				const dy = particle.y - y;
				const distance = Math.sqrt(dx * dx + dy * dy);
				
				// Apply force based on distance (closer = stronger push)
				if (distance < explosionRadius && distance > 0) {
					const force = (1 - distance / explosionRadius) * explosionForce;
					const angle = Math.atan2(dy, dx);
					
					// Add velocity away from explosion center
					particle.vx += Math.cos(angle) * force;
					particle.vy += Math.sin(angle) * force;
				}
			});
			
			// Create sparkle burst at click point
			const sparkleCount = 40;
			const baseSize = isMobile ? this.config.fieldParticleSizeMobile : this.config.fieldParticleSize;
			
			for (let i = 0; i < sparkleCount; i++) {
				const angle = (Math.PI * 2 * i) / sparkleCount;
				const speed = 3 + Math.random() * 5;
				
				// Acquire particle from pool
				const particle = this.particlePool.acquire();
				
				// Initialize explosion particle
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
			}
		}

		getParticleColor(particle) {
			const palette = this.config.experienceMode === 'particle-field' 
				? this.config.fieldColorPalette 
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

			// Process particles in reverse to safely remove dead ones
			for (let i = activeParticles.length - 1; i >= 0; i--) {
				const particle = activeParticles[i];
				
				// Calculate age and life ratio
				const age = currentTime - particle.birthTime;
				const lifeRatio = Math.max(0, 1 - (age / particle.maxLife));

				// Update position for scattered behavior
				if (!isCompact) {
					particle.x += particle.vx;
					particle.y += particle.vy;
				}

				// Smooth fade using cubic easing for more organic feel
				if (isCompact) {
					// Smooth cubic fade
					particle.opacity = this.config.particleOpacity * Math.pow(lifeRatio, 2);
				} else {
					// Gentler quadratic fade for scattered
					particle.opacity = this.config.particleOpacity * Math.pow(lifeRatio, 1.5);
				}

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
				
				// Update color cycling for non-custom palettes
				if (this.config.fieldColorPalette !== 'custom') {
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

		// Draw sprinkle trail particles
		drawSprinkleParticles() {
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach((particle) => {
				this.ctx.beginPath();
				this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
				this.ctx.fillStyle = particle.color.replace(/[\d.]+\)$/g, particle.opacity + ')');
				this.ctx.fill();
			});
		}

		// Draw particle field with glitter effect
		drawFieldParticles() {
			this.ctx.clearRect(0, 0, this.logicalWidth, this.logicalHeight);

			const activeParticles = this.particlePool.getActive();
			activeParticles.forEach((particle) => {
				this.ctx.save();
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
			});
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