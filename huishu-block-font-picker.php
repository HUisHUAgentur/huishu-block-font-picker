<?php
/**
 * Plugin Name:       HUisHU Block Font Picker
 * Description:       Add Font Picker to Blocks
 * Version:           1.0.2
 * Requires at least: 5.8
 * Requires PHP:      7.3
 * Author: HUisHU. Digitale Kreativagentur GmbH
 * Author URI:        https://www.huishu-agentur.de
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 */

/**
 * Load Gutenberg Plugin.
 */
function hu_bfp_add_gutenberg_assets() {
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );
    $secondary_fonts = hu_bfp_get_secondary_fonts();
    $apply_to_blocks = hu_bfp_get_blocknames_for_secondary_fonts();
    $loc_secondary_fonts = array();
    foreach($secondary_fonts as $secondary_font){
        $loc_secondary_fonts[] = $secondary_font;
    }
    wp_register_script( 'hu-bfp-editor', plugin_dir_url( __FILE__ ).'build/index.js', $asset_file['dependencies'], $asset_file['version']);
    wp_localize_script( 'hu-bfp-editor', 'hu_bfp_settings', array( 'fonts' => $loc_secondary_fonts, 'apply_to_blocks' => $apply_to_blocks ) );
	wp_enqueue_script( 'hu-bfp-editor' );
    wp_enqueue_style( 'hu-bfp-style', plugin_dir_url( __FILE__ ).'assets/index.css', array(), $asset_file['version'] );
    $custom_styles = "";
    foreach( $secondary_fonts as $secondary_font_classname => $secondary_font ){
        if($secondary_font['value']){
            $custom_styles.= '.wp-block.has-custom-font-'.$secondary_font['value']." { font-family: '".$secondary_font_classname."'; } ";
        }
    }
    wp_add_inline_style( 
        'hu-bfp-style',
        $custom_styles
    );
}
add_action( 'enqueue_block_editor_assets', 'hu_bfp_add_gutenberg_assets' );

function hu_bfp_load_scripts_in_frontend(){
    $asset_file = include( plugin_dir_path( __FILE__ ) . 'build/index.asset.php' );
    $secondary_fonts = hu_bfp_get_secondary_fonts();
    $apply_to_blocks = hu_bfp_get_blocknames_for_secondary_fonts();
    wp_enqueue_style( 'hu-bfp-style', plugin_dir_url( __FILE__ ).'assets/index.css', array(), $asset_file['version'] );
    $custom_styles = "";
    foreach( $secondary_fonts as $secondary_font_classname => $secondary_font ){
        $custom_styles.= '.has-custom-font-'.$secondary_font['value']." { font-family: '".$secondary_font_classname."'; } ";
    }
    wp_add_inline_style( 
        'hu-bfp-style',
        $custom_styles
    );
}
add_action( 'wp_enqueue_scripts', 'hu_bfp_load_scripts_in_frontend' );

function hu_bfp_get_secondary_fonts(){
    //return as 'fontname-for-style' => array( 'label' => 'FontLabel', 'value' => 'fontname-for-select')
    $secondary_fonts = apply_filters( 
        'hu_bfp_secondary_fonts', 
        array( 
            'default' => array(
                'label' => __('Standardschrift'), 
                'value' => ''
            )
        )
    );
    return $secondary_fonts;
}

function hu_bfp_get_blocknames_for_secondary_fonts(){
    //return as 'core/cover' or whatever
    $apply_to_blocks = apply_filters( 
        'hu_bfp_blocks_for_secondary_fonts', 
        array() 
    );
    return $apply_to_blocks;
}
