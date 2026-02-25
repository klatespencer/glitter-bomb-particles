<?php
register_block_pattern(
	'glitter-bomb/new-years-eve',
	array(
		'title'       => __( 'New Year\'s Eve', 'glitter-bomb' ),
		'description' => __( 'A midnight New Year\'s Eve hero with fireworks and rainbow sparkles.', 'glitter-bomb' ),
		'categories'  => array( 'glitter-bomb' ),
		'keywords'    => array( 'new year', 'new years eve', 'fireworks', 'midnight', 'celebration', 'countdown' ),
		'content'     => '<!-- wp:group {"align":"full","style":{"color":{"background":"#08081a"},"spacing":{"padding":{"top":"8em","bottom":"8em","left":"2em","right":"2em"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#08081a;padding-top:8em;padding-bottom:8em;padding-left:2em;padding-right:2em">

<!-- wp:glitter-bomb/glitter-bomb {"experienceMode":"particle-field","fieldParticleStyle":"fireworks","fieldColorPalette":"rainbow-cycling","fieldParticleCount":200,"fieldParticleSize":6,"fieldParticleSizeMobile":4,"fieldMouseAttraction":0.5,"fieldSpreadStrength":0.3,"fieldClickExplosion":true,"enabledByDefault":true} /-->

<!-- wp:group {"layout":{"type":"constrained","contentSize":"680px"}} -->
<div class="wp-block-group">

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"rgba(255,255,255,0.5)"},"typography":{"fontSize":"0.85rem","letterSpacing":"0.15em","textTransform":"uppercase"}}} -->
<p class="has-text-align-center" style="color:rgba(255,255,255,0.5);font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase">New Year\'s Eve</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"clamp(2.5rem, 5vw, 4.5rem)","fontWeight":"700"},"spacing":{"margin":{"top":"0.5rem","bottom":"0"}}}} -->
<h1 class="wp-block-heading has-text-align-center" style="color:#ffffff;font-size:clamp(2.5rem, 5vw, 4.5rem);font-weight:700;margin-top:0.5rem;margin-bottom:0">🎉 Ring in the New Year</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"rgba(255,255,255,0.8)"},"typography":{"fontSize":"1.2rem"},"spacing":{"margin":{"top":"1.5rem","bottom":"0"}}}} -->
<p class="has-text-align-center" style="color:rgba(255,255,255,0.8);font-size:1.2rem;margin-top:1.5rem;margin-bottom:0">Out with the old, in with more glitter. Make it a night to remember.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2.5rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:2.5rem">
<!-- wp:button {"style":{"color":{"background":"#D4AF37","text":"#08081a"},"border":{"radius":"8px"},"spacing":{"padding":{"top":"0.8em","bottom":"0.8em","left":"2em","right":"2em"}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="background-color:#D4AF37;color:#08081a;border-radius:8px;padding-top:0.8em;padding-bottom:0.8em;padding-left:2em;padding-right:2em">Celebrate With Us</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->',
	)
);
