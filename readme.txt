=== Glitter Bomb ===

Contributors:      klate
Tags:              particles, animation, interactive, cursor, effects
Tested up to:      6.9
Stable tag:        1.0.1
License:           GPLv2 or later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.1
Requires PHP:      7.4

Maximalist particle effects for WordPress — touch-responsive sparkle trails and glitter fields. WCAG 2.2 AA compliant.

== Description ==

Haven't you ever wondered what the world would be like if GeoCities worked on your phone? Glitter Bomb brings interactive cursor effects and confetti-style particle fields to WordPress — with touch support that actually works. See it in action at [klatespencer.com/glitter-bomb](https://klatespencer.com/glitter-bomb/).

**[✨ Sprinkle Trail Mode](https://klatespencer.com/rainbow-sprinkle/)**
Particles follow your cursor on desktop and your finger on mobile with smooth gesture tracking. Choose between compact trails or scattered drifting patterns.

**[💫 Particle Field Mode](https://klatespencer.com/particle-field/)**
Your entire page becomes a canvas of shimmering glitter. Particles drift, attract to your cursor or touch, and explode into sparkles on click or tap.

**Honest assessment:** No site *needs* this. It adds JavaScript, it competes with your content, and enabling it by default on a checkout page would be irresponsible. On a hero section, birthday page, portfolio, or anywhere a little extra is exactly right? Absolutely your call.

**Features:**

* Touch-optimized from the start — particle trails follow your finger, tap triggers explosions, separate sizing controls for mobile vs. desktop, and an option to disable on mobile entirely
* WCAG 2.2 AA compliant — keyboard navigation, screen reader support, `prefers-reduced-motion` respect
* Six color palettes (Rainbow, Metallic, Neutral Spectrum, Warm Sunset, Cool Ocean, Custom)
* Customizable toggle button: position, text, and gradient colors
* No external dependencies, no tracking, no data collection
* Performance optimizations: object pooling, particle culling, canvas scaling, RAF animation

Built with [Telex](https://telex.im) and [Claude Code](https://claude.ai/code). More details at [klatespencer.com/glitter-bomb](https://klatespencer.com/glitter-bomb/).

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

= What's the difference between the two modes? =

**Sprinkle Trail** creates particles that follow cursor or touch movement in compact or scattered patterns. **Particle Field** fills the entire viewport with physics-based glitter that drifts, attracts to your cursor, and explodes on click.

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

== Contributing ==

Bug reports and contributions welcome: [github.com/klatespencer](https://github.com/klatespencer)
