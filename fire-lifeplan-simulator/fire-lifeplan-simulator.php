<?php
/**
 * Plugin Name: FIRE Lifeplan Simulator
 * Plugin URI:  https://fire-lifeplan-lab.com
 * Description: 住宅ローン × 教育費 × FIRE 統合シミュレーター。[fire_lifeplan_simulator] ショートコードで表示。
 * Version:     1.0.0
 * Author:      fire-lifeplan-lab.com
 * License:     GPL-2.0-or-later
 * Text Domain: fire-lifeplan-simulator
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'FLSIM_VERSION', '1.0.0' );
define( 'FLSIM_DIR', plugin_dir_path( __FILE__ ) );
define( 'FLSIM_URL', plugin_dir_url( __FILE__ ) );

add_shortcode( 'fire_lifeplan_simulator', 'flsim_render_shortcode' );

function flsim_enqueue_assets() {
    global $post;
    if ( is_a( $post, 'WP_Post' ) && has_shortcode( $post->post_content, 'fire_lifeplan_simulator' ) ) {
        wp_enqueue_style(
            'flsim-noto-sans-jp',
            'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700&family=Inter:wght@400;500;600;700&display=swap',
            [],
            null
        );
        wp_enqueue_style(
            'flsim-style',
            FLSIM_URL . 'assets/css/simulator.css',
            [ 'flsim-noto-sans-jp' ],
            FLSIM_VERSION
        );
        wp_enqueue_script(
            'chart-js',
            'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
            [],
            '4.4.0',
            true
        );
        wp_enqueue_script(
            'flsim-script',
            FLSIM_URL . 'assets/js/simulator.js',
            [ 'chart-js' ],
            FLSIM_VERSION,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'flsim_enqueue_assets' );

function flsim_render_shortcode( $atts ) {
    ob_start();
    include FLSIM_DIR . 'templates/simulator.php';
    return ob_get_clean();
}
