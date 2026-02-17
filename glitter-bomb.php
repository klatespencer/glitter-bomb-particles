<?php
/**
 * Plugin Name:       Glitter Bomb
 * Plugin URI:        https://klatespencer.com/
 * Description:       Create magical, accessible particle effects with cursor-following sparkles and full-screen glitter fields. Two experience modes: Sprinkle Trail and Particle Field. WCAG 2.2 AA compliant with full keyboard and screen reader support.
 * Version:           1.0.0
 * Requires at least: 6.1
 * Requires PHP:      7.4
 * Author:            klatespencer
 * Author URI:        https://github.com/klatespencer
 * License:           GPLv2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       glitter-bomb
 * Domain Path:       /languages
 *
 * @package GlitterBomb
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Define plugin constants
define( 'GLITTER_BOMB_VERSION', '1.0.0' );
define( 'GLITTER_BOMB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'GLITTER_BOMB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function glitter_bomb_block_init() {
	register_block_type( __DIR__ . '/build/' );
}
add_action( 'init', 'glitter_bomb_block_init' );

/**
 * Add plugin action links.
 *
 * @since 1.0.0
 * @param array $links Plugin action links.
 * @return array Modified plugin action links.
 */
function glitter_bomb_plugin_action_links( $links ) {
	$settings_link = sprintf(
		'<a href="%s">%s</a>',
		admin_url( 'post-new.php?post_type=page' ),
		__( 'Add Block', 'glitter-bomb' )
	);
	
	array_unshift( $links, $settings_link );
	
	return $links;
}
add_filter( 'plugin_action_links_' . plugin_basename( __FILE__ ), 'glitter_bomb_plugin_action_links' );