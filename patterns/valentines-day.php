<?php
register_block_pattern(
	'glitter-bomb/valentines-day',
	array(
		'title'       => __( 'Valentine\'s Day', 'glitter-bomb' ),
		'description' => __( 'A romantic Valentine\'s Day hero with floating heart particle field.', 'glitter-bomb' ),
		'categories'  => array( 'glitter-bomb' ),
		'keywords'    => array( 'valentine', 'love', 'hearts', 'romantic', 'february' ),
		'content'     => '<!-- wp:group {"align":"full","style":{"color":{"background":"#1a0510"},"spacing":{"padding":{"top":"8em","bottom":"8em","left":"2em","right":"2em"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group alignfull has-background" style="background-color:#1a0510;padding-top:8em;padding-bottom:8em;padding-left:2em;padding-right:2em">

<!-- wp:glitter-bomb/glitter-bomb {"experienceMode":"particle-field","fieldParticleStyle":"love-bomb","fieldParticleCount":150,"fieldParticleSize":7,"fieldParticleSizeMobile":4.5,"fieldMouseAttraction":0.7,"fieldSpreadStrength":0.2,"fieldClickExplosion":true,"enabledByDefault":true,"fieldParticleOpacity":0.95} /-->

<!-- wp:group {"layout":{"type":"constrained","contentSize":"680px"}} -->
<div class="wp-block-group">

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"rgba(255,255,255,0.5)"},"typography":{"fontSize":"0.85rem","letterSpacing":"0.15em","textTransform":"uppercase"}}} -->
<p class="has-text-align-center" style="color:rgba(255,255,255,0.5);font-size:0.85rem;letter-spacing:0.15em;text-transform:uppercase">February 14th</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"textAlign":"center","level":1,"style":{"color":{"text":"#ffffff"},"typography":{"fontSize":"clamp(2.5rem, 5vw, 4.5rem)","fontWeight":"700"},"spacing":{"margin":{"top":"0.5rem","bottom":"0"}}}} -->
<h1 class="wp-block-heading has-text-align-center" style="color:#ffffff;font-size:clamp(2.5rem, 5vw, 4.5rem);font-weight:700;margin-top:0.5rem;margin-bottom:0">❤️ With Love</h1>
<!-- /wp:heading -->

<!-- wp:paragraph {"align":"center","style":{"color":{"text":"rgba(255,255,255,0.8)"},"typography":{"fontSize":"1.2rem"},"spacing":{"margin":{"top":"1.5rem","bottom":"0"}}}} -->
<p class="has-text-align-center" style="color:rgba(255,255,255,0.8);font-size:1.2rem;margin-top:1.5rem;margin-bottom:0">Made for someone worth a little extra. Celebrate the people you love.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons {"layout":{"type":"flex","justifyContent":"center"},"style":{"spacing":{"margin":{"top":"2.5rem"}}}} -->
<div class="wp-block-buttons" style="margin-top:2.5rem">
<!-- wp:button {"style":{"color":{"background":"#FF6B9D","text":"#ffffff"},"border":{"radius":"8px"},"spacing":{"padding":{"top":"0.8em","bottom":"0.8em","left":"2em","right":"2em"}}}} -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" style="background-color:#FF6B9D;color:#ffffff;border-radius:8px;padding-top:0.8em;padding-bottom:0.8em;padding-left:2em;padding-right:2em">Send Some Love</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->

</div>
<!-- /wp:group -->

</div>
<!-- /wp:group -->',
	)
);
