=== Glitter Bomb ===

Contributors:      klate
Tags:              block, particles, glitter, animation, accessibility
Tested up to:      6.9
Stable tag:        1.0.0
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.1
Requires PHP:      7.4

Create magical, accessible particle effects with cursor-following sparkles and full-screen glitter fields. WCAG 2.2 AA compliant.

== Description ==

Glitter Bomb brings wildly extra, interactive particle effects to your WordPress site with two delightful experience modes that work beautifully on **desktop, tablet, and mobile devices** with full **touch and gesture support**.

**✨ Sprinkle Trail Mode**
Create zany particle trails that follow your cursor on desktop or touch path on mobile devices. Perfectly optimized for touch screens with smooth gesture tracking and responsive sizing. Perfect for adding a touch of magic to hero sections, landing pages, or special announcements.

**💫 Particle Field Mode**
Transform your entire page into a magical canvas filled with hundreds of shimmering glitter particles. Particles gently drift, attract to your cursor or touch, and explode into sparkles on click or tap - creating an enchanting, physics-based experience that works flawlessly across all devices.

**🎯 Why Choose Glitter Bomb?**

* **Fully Responsive & Mobile-Optimized**: Works beautifully on all screen sizes from mobile phones to desktop monitors with adaptive particle sizing and touch-optimized controls
* **Touch & Gesture Support**: Complete touch event optimization with smooth gesture tracking, tap explosions, and mobile-specific performance enhancements
* **Two Distinct Modes**: Choose between cursor-following sprinkle trails or immersive full-screen particle fields
* **Fully Accessible**: WCAG 2.2 AA compliant with keyboard navigation, screen reader support, and reduced motion respect
* **Performance Optimized**: Advanced optimizations including object pooling, canvas scaling, particle culling, and mobile-specific performance features ensure smooth framerates even on mobile devices
* **Highly Customizable**: Extensive controls for colors, sizes, animation speed, particle behavior, with separate desktop and mobile settings
* **Beautiful Color Palettes**: Choose from Rainbow, Metallic, Neutral Spectrum, Warm Sunset, Cool Ocean, or custom colors - all with smooth cycling animations
* **Zero Configuration**: Works beautifully out of the box with smart defaults, or customize every detail to match your brand

**📱 Mobile & Touch Features:**

* **Touch-Optimized Interface**: All controls meet minimum 44x44px touch target requirements
* **Gesture Tracking**: Smooth particle trails follow your finger movements with precision
* **Tap Explosions**: Dramatic sparkle bursts respond to touch taps (Particle Field mode)
* **Separate Mobile Sizing**: Configure different particle sizes for mobile vs desktop for optimal visual balance
* **Mobile Disable Option**: Optionally disable effects on mobile devices for maximum performance flexibility
* **Canvas Resolution Optimization**: Automatically reduces canvas resolution on high-DPI mobile screens for better performance without visual quality loss
* **Touch Event Throttling**: Smart touch event handling prevents overwhelming mobile processors
* **Responsive Viewport**: Automatically adapts to mobile browser UI changes (address bar appearance/disappearance)

**🎨 Key Features:**

* **Interactive Effects**: Smooth, animated particles that respond to cursor and touch movements
* **Color Cycling**: Beautiful color palette animations that smoothly transition between hues
* **Physics-Based Movement**: Natural particle behavior with attraction, drift, and spreading forces
* **Click/Tap Explosions**: Dramatic sparkle bursts on click or tap (Particle Field mode)
* **Customizable Controls**: Adjust opacity, size, speed, particle count, and behavior
* **Position Control**: Place toggle button in any screen corner
* **Enable by Default**: Choose whether effects are active on page load
* **User Preferences**: Remembers user's enable/disable choice across sessions
* **Gradient Buttons**: Beautiful gradient controls that automatically match your color palette
* **Compact or Scattered**: Choose particle display behavior (Sprinkle Trail mode)
* **Mobile Optimization**: Separate sizing controls and optional disable for mobile devices

**♿ Accessibility Features:**

* Keyboard activation with Enter and Space keys
* Screen reader announcements via ARIA live regions
* Semantic HTML structure
* Visible focus indicators
* Respects `prefers-reduced-motion` settings
* Minimum 44x44px touch targets for mobile
* WCAG 2.2 AA color contrast compliance

**⚡ Performance Features:**

* Object pooling for efficient memory usage
* RequestAnimationFrame optimization
* Particle culling for off-screen particles
* Canvas resolution scaling on mobile devices
* Touch event optimization
* Tab visibility detection to pause animations
* Smart particle limits to maintain smooth framerates
* Mobile-specific performance enhancements

**💻 Developer Friendly:**

* Clean-ish, well-documented code
* WordPress coding standards compliant
* No external dependencies
* Lightweight bundle size
* Proper cleanup and resource management
* Safari privacy-friendly (non-fingerprinting)

== Installation ==

**Automatic Installation:**

1. Log in to your WordPress dashboard
2. Navigate to Plugins → Add New
3. Search for "Glitter Bomb"
4. Click "Install Now" and then "Activate"
5. Add the block to any post or page using the block editor

**Manual Installation:**

1. Download the plugin ZIP file
2. Log in to your WordPress dashboard
3. Navigate to Plugins → Add New → Upload Plugin
4. Choose the downloaded ZIP file and click "Install Now"
5. Activate the plugin
6. Add the "Glitter Bomb" block to any post or page

**After Installation:**

1. Edit any post or page with the block editor
2. Click the "+" button to add a new block
3. Search for "Glitter Bomb" or find it in the Widgets category
4. Add the block to your content
5. Customize using the settings in the right sidebar
6. Preview on the frontend - effects only appear outside the editor
7. Test on mobile devices to experience the touch-optimized interface

== Frequently Asked Questions ==

= Why don't I see the particles in the editor? =

The particle effects only appear on the frontend to prevent performance issues in the editor. The editor displays a beautiful preview with settings summary and all customization controls. Click the expand/collapse toggle to view your current settings.

= Does this work on mobile devices and tablets? =

Absolutely! Glitter Bomb is fully optimized for mobile and tablet devices with:
* Complete touch event support for particle trails following your finger
* Tap-responsive explosion effects
* Separate mobile particle size controls for optimal visual balance
* Canvas resolution optimization for better performance on high-DPI screens
* Touch-optimized toggle button meeting minimum 44x44px touch target requirements
* Optional mobile disable feature for older devices
* Responsive viewport handling that adapts to mobile browser UI changes
* Smooth gesture tracking with touch event throttling

The plugin works beautifully on iOS (iPhone/iPad), Android phones and tablets, and all modern touch-enabled devices.

= Is this block accessible? =

Yes! Glitter Bomb was built with WCAG 2.2 AA criteria in mind and includes:
* Complete keyboard navigation support
* Screen reader announcements
* Focus indicators that meet contrast requirements
* Respect for `prefers-reduced-motion` user preferences
* Minimum touch target sizes for mobile (44x44px)
* Semantic HTML structure

= How many particles can be displayed at once? =

For optimal performance across all devices:
* **Sprinkle Trail mode**: Maximum 100 particles (default 50)
* **Particle Field mode**: Maximum 500 particles (default 200)

You can adjust these limits in the block settings. The plugin uses advanced optimizations to ensure smooth performance even at higher particle counts on both desktop and mobile devices.

= Will this affect my site's performance? =

Yes, 100% this is a wildly extra effect with a ton of JavaScript. However, I've done my best to mitigate that by applying:
* Object pooling reduces memory usage
* Particle culling prevents off-screen rendering
* Canvas scaling optimizes mobile performance
* Touch event throttling prevents overwhelming mobile processors
* Animation pauses when tab is hidden
* Smart particle limits maintain smooth framerates
* Proper resource cleanup prevents memory leaks
* Mobile-specific optimizations for high-DPI screens

= Can I customize the colors? =

Yes! You have multiple color options:
* **Pre-defined palettes**: Rainbow, Metallic, Neutral Spectrum, Warm Sunset, Cool Ocean
* **Color cycling**: All palettes smoothly cycle through their colors
* **Custom colors**: Use the color picker for precise color control
* **Gradient buttons**: Toggle buttons automatically match your palette or use custom gradients

= What's the difference between Sprinkle Trail and Particle Field modes? =

**Sprinkle Trail Mode**: Creates particles that follow your cursor or finger on touch devices, perfect for focused effects on specific content areas. Choose between:
* **Compact**: Tight trailing effect with faster fade
* **Scattered**: Particles drift outward as they fade

**Particle Field Mode**: Creates a full-screen magical experience with hundreds of particles that:
* Gently drift across the entire viewport
* Attract to your cursor or touch with physics-based movement
* Explode into sparkles on click or tap
* Return to their home positions when cursor/touch leaves

= Can users disable the effects? =

Yes! A customizable toggle button allows users to enable/disable effects at any time. The plugin remembers their preference using sessionStorage. You can also:
* Set whether effects are enabled by default
* Customize button text and colors
* Position the button in any screen corner
* Disable effects entirely on mobile if desired

= Is only one block allowed per page? =

Yes, by design. The Glitter Bomb block creates full-page effects and is limited to one instance per post/page. This ensures:
* Optimal performance
* Consistent user experience
* No conflicting particle systems

= What browsers are supported? =

The block works on all modern browsers:
* Chrome (latest)
* Firefox (latest)
* Safari (latest) - Privacy-friendly, non-fingerprinting implementation
* Edge (latest)
* Mobile browsers (iOS Safari, Chrome Mobile, Samsung Internet)

The plugin uses standard HTML5 Canvas and modern JavaScript features supported by all current browsers.

= Can I use this with page builders? =

Yes! Glitter Bomb works with any WordPress setup that supports Gutenberg blocks, including:
* Classic WordPress block editor
* Full Site Editing (FSE)
* Page builders that support Gutenberg blocks

= Does it work with caching plugins? =

Yes! The block is fully compatible with caching plugins. All interactive functionality runs in the browser, so cached pages work perfectly.

= How do I report bugs or request features? =

Please use the WordPress.org support forum for this plugin. We actively monitor and respond to all support requests.

== Screenshots ==

1. Beautiful editor placeholder with gradient background and settings summary
2. Comprehensive settings panel with all customization options
3. Sprinkle Trail mode following cursor movement on desktop
4. Particle Field mode with shimmering glitter particles
5. Click explosion effect in Particle Field mode
6. Color palette options with cycling animations
7. Mobile view with touch-optimized controls and finger tracking
8. Accessibility settings and features
9. Button customization with gradient support
10. Performance settings including mobile-specific optimizations

== Changelog ==

= 1.0.0 - 2026 =
* Initial release
* **Two Experience Modes**:
  * Sprinkle Trail: Cursor/touch-following particle effects
  * Particle Field: Full-screen glitter field with physics
* **Mobile & Touch Features**:
  * Complete touch event support with gesture tracking
  * Separate mobile particle sizing controls
  * Touch-optimized controls (44x44px minimum targets)
  * Canvas resolution optimization for mobile
  * Touch event throttling for performance
  * Tap explosion effects
  * Responsive viewport handling
* **Interactive Features**:
  * Smooth cursor and touch tracking
  * Click/tap explosion effects (Particle Field)
  * Physics-based particle movement
  * Color cycling animations
* **Customization Options**:
  * Multiple color palettes (Rainbow, Metallic, Neutral, Sunset, Ocean, Custom)
  * Particle size, opacity, and count controls
  * Separate desktop and mobile sizing
  * Animation speed adjustment
  * Display behavior options (Compact/Scattered)
  * Button position and styling
* **Accessibility Features**:
  * WCAG 2.2 AA compliance
  * Keyboard navigation support
  * Screen reader compatibility
  * Reduced motion respect
  * Visible focus indicators
  * Minimum touch target sizes
* **Performance Optimizations**:
  * Object pooling for memory efficiency
  * RequestAnimationFrame optimization
  * Particle culling
  * Canvas resolution scaling on mobile
  * Touch event optimization
  * Tab visibility detection
* **User Experience**:
  * Enable by default option
  * SessionStorage preference persistence
  * Collapsible editor preview
  * Gradient button support
  * Custom button text and colors
  * Optional mobile disable

== Upgrade Notice ==

= 1.0.0 =
Initial release of Glitter Bomb. Create magical, accessible particle effects with sprinkle trails and glitter fields! Fully responsive with complete mobile and touch support.

== Performance & Browser Support ==

The block uses modern JavaScript features and is optimized for performance with:
* Object pooling for efficient memory management
* Passive event listeners for smooth scrolling
* RequestAnimationFrame for optimized animations
* Particle culling to prevent off-screen rendering
* Canvas resolution scaling on mobile devices (reduces to 1.5x pixel ratio on high-DPI screens)
* Touch event throttling for mobile performance
* Tab visibility detection to pause animations
* Particle count limits to maintain framerates
* Proper cleanup to prevent memory leaks
* Safari privacy-friendly implementation (non-fingerprinting)

**Supported browsers**: Chrome, Firefox, Safari, Edge (latest versions)
**Mobile browsers**: iOS Safari, Chrome Mobile, Samsung Internet, Firefox Mobile

**Tested on**:
* WordPress 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8
* PHP 7.4, 8.0, 8.1, 8.2, 8.3
* Desktop: Windows, macOS, Linux
* Mobile: iOS (iPhone/iPad), Android phones and tablets
* Various screen sizes: 320px to 4K displays
* Touch devices: phones, tablets, touch-enabled laptops

== Privacy & Data ==

Glitter Bomb respects your privacy:
* **No external requests**: All code runs locally in the browser
* **No tracking**: No analytics or user tracking 
* **No cookies**: Uses sessionStorage for user preferences (not persistent)
* **No personal data**: Does not collect or transmit any user information
* **GDPR compliant**: No personal data processing
* **Safari privacy-friendly**: Non-fingerprinting canvas implementation

== Support ==

For support, please use the WordPress.org support forum for this plugin. 

== Contributing ==

I welcome contributions! If you'd like to contribute code, report bugs, or suggest features, please visit the GitHub repository: https://github.com/klatespencer