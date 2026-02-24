=== Glitter Bomb ===

Contributors:      klate
Tags:              particles, animation, interactive, cursor, sparkles, confetti, seasonal
Tested up to:      6.9
Stable tag:        1.0.1
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.1
Requires PHP:      7.4

Cursor sparkle trails, confetti fields, and particle animations for WordPress. Touch-friendly, WCAG 2.2 AA compliant, and questionable UX done well.

== Description ==

Glitter Bomb is a [Gutenberg block](https://developer.wordpress.org/block-editor/getting-started/faq/#what-is-gutenberg) — add it to any post or page from the WordPress block editor and configure in the sidebar.

Haven't you ever wondered what the world would be like if GeoCities worked on your phone? Glitter Bomb brings cursor effects, confetti, and particle animations to WordPress — with touch support that actually works. See it in action at [klatespencer.com/glitter-bomb](https://klatespencer.com/glitter-bomb/).

**[✨ Sprinkle Trail Mode](https://klatespencer.com/rainbow-sprinkle/)**
Particles follow your cursor on desktop and your finger on mobile. Choose compact or scattered trails, or switch to Emoji Trail mode and drop any character as you move — ❄️ in December, ❤️ in February, whatever fits.

**[💫 Particle Field Mode](https://klatespencer.com/particle-field/)**
Your entire page becomes a canvas of shimmering particles that drift, attract to your cursor, and explode into sparkles on click or tap. Six styles to choose from.

**Get your glitter on!** No site *needs* this. It adds JavaScript, it competes with your content, and enabling it by default on a checkout page would be irresponsible. On a hero section, birthday page, portfolio, or anywhere a little extra is exactly right? Absolutely your call.

**Features:**

* **Six Particle Field styles** — Glitter, Pride Confetti, Love Bomb, Snow, Fireworks, and Autumn Leaves, each with its own physics
* **Emoji Trail mode** — drop any emoji instead of particles: pick from presets or type your own
* **Seasonal Override** — schedule different particle styles for specific date ranges each year; stack multiple rules, first active rule wins
* **Six color palettes** for Sprinkle Trail (Rainbow, Metallic, Neutral Spectrum, Warm Sunset, Cool Ocean, Custom) plus independent palette control for Particle Field
* **Granular controls** — opacity, particle size, count, animation duration, mouse attraction (with on/off toggle), spread strength, and separate sizing for mobile vs. desktop
* **Customizable toggle button** — position, text, and gradient colors
* Touch-optimized — trails follow your finger, tap triggers explosions, disable on mobile if needed
* WCAG 2.2 AA compliant — keyboard navigation, screen reader support, `prefers-reduced-motion` respect
* No external dependencies, no tracking, no data collection
* Performance optimizations: object pooling, particle culling, canvas scaling, RAF animation loop

Built with [Telex](https://telex.im) and [Claude Code](https://claude.ai/code). More at [klatespencer.com/glitter-bomb](https://klatespencer.com/glitter-bomb/).

== Installation ==

1. In your WordPress dashboard, go to Plugins → Add New
2. Search for "Glitter Bomb" and click Install, then Activate
3. Add the "Glitter Bomb" block to any post or page from the block editor
4. Customize in the right sidebar — effects only appear on the frontend, not in the editor

**Manual install:** Download the ZIP, go to Plugins → Add New → Upload Plugin.

== Frequently Asked Questions ==

= Why don't I see particles in the editor? =

Effects only render on the frontend. The editor shows a settings summary instead.

= Does this work on mobile? =

Yes. Particle trails follow your finger with smooth gesture tracking, tap triggers sparkle explosions in Particle Field mode, and you can configure separate particle sizes for mobile vs. desktop. If you need to, you can disable effects on mobile entirely — but the touch interactions are the fun part.

= Is it accessible? =

Yes. WCAG 2.2 AA compliant: keyboard navigation, screen reader announcements via ARIA live regions, visible focus indicators, and automatic respect for `prefers-reduced-motion` per [WCAG 2.1 Success Criterion 2.3.3](https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions.html).

= What is the Seasonal Override? =

It lets you schedule different particle styles for specific dates each year — useful for holidays, events, or seasonal themes. Add as many rules as you like; each has a start date, end date, and style. The first active rule wins, so order matters. Rules are mode-locked: Particle Field rules pick from field styles, Sprinkle Trail rules pick trail styles or switch to a specific emoji. Everything repeats automatically every year.

= Will this slow down my site? =

Only on pages where the block is used — scripts and styles are loaded conditionally and won't touch pages that don't have the block. On pages that do have it, yes, there's an inordinate amount of JavaScript making this work. Object pooling, particle culling, canvas scaling, and smart particle limits help keep it reasonable — but it's still a lot. Plan accordingly.

= Can users turn it off? =

Yes, always. There's a customizable toggle button (position, text, colors) and the plugin remembers the user's choice for the session. If you're going to shove glitter in people's faces, at least have the decency to let them turn it off.

= How many particles? =

Sprinkle Trail: up to 100 (default 50). Particle Field: up to 500 (default 200).

= Does it collect data or set cookies? =

No. Zero tracking, zero analytics. It uses sessionStorage (not cookies) to remember whether a user turned effects on or off — that data never leaves their browser.

= One block per page? =

Yes, by design. Full-page effects don't stack well.

= Does it work with caching plugins? =

Yes — all effects run client-side, so cached pages work fine.

== Screenshots ==

1. Editor placeholder with settings summary
2. Settings panel
3. Sprinkle Trail mode on desktop
4. Particle Field mode
5. Click explosion effect
6. Color palette options
7. Mobile with touch controls
8. Accessibility settings
9. Button customization

== Changelog ==

= 1.0.1 - 2026 =
* Fix button width CLS by scoping transition to specific properties
* Add WordPress Playground Live Preview support via blueprint.json
* Update plugin description and readme copy
* Add WCAG 2.1 reduced motion criterion link to accessibility FAQ

= 1.0.0 - 2026 =
* Initial release

== Upgrade Notice ==

= 1.0.1 =
Bug fix for button width CLS and added Playground Live Preview support.

= 1.0.0 =
Initial release.

== Privacy & Data ==

Glitter Bomb respects your privacy:

* **No external requests**: All code runs locally in the browser
* **No tracking**: No analytics or user tracking
* **No cookies**: Uses sessionStorage for user preferences (not persistent)
* **No personal data**: Does not collect or transmit any user information
* **GDPR compliant**: No personal data processing
* **Safari privacy-friendly**: Non-fingerprinting canvas implementation

== Contributing ==

Bug reports and contributions welcome: [github.com/klatespencer](https://github.com/klatespencer)
