<?php

/**
 * @package ArrayForms
 */

namespace ArrayForms\Base;

use \ArrayForms\Base\BaseController;

class Enqueue extends BaseController {

    public function register() {
        //ensure these functions are only added into the admin backend only, not on the front end as well
        if (is_admin() === true) {
            add_action('admin_enqueue_scripts', array($this, 'enqueue'));
            add_filter('tiny_mce_before_init', array($this, 'extend_tinymce_allowed_iframe_attributes'));
        }
    }
    function enqueue() {
        if (is_admin() && function_exists('get_current_screen')) {
            $pt = get_current_screen()->post_type;

            //ensure we only add classic editor when on editing page or post admin page
            if (current_user_can('edit_posts') && ($pt == 'post' || $pt == 'page')) {

                if($this->classic_editor_plugin_is_active()){
                    add_action('media_buttons', array($this,'arrayforms_add_my_media_button'), 15);
                    add_action('wp_after_admin_bar_render', array($this,'arrayforms_add_classic_editor_popup_container'));
                    wp_enqueue_script('arrayforms_media_button', $this->plugin_url . 'build/classicEditorIndex.js', array('wp-element', 'wp-blocks', 'wp-block-editor', 'wp-api-fetch'), '1.0', true);
                }

                wp_localize_script('arrayforms_media_button', 'arrayforms_php_vars', [
                    'plugin_dir' => $this->plugin_url,
                    'admin_url' => admin_url('', 'relative'),
                    'nonce' => wp_create_nonce( 'arrayforms_gutenberg_nonce' ),
                    'arrayforms_webserver_url' => arrayforms_get_buildarray_webserver_url()
                ]);
                add_action('wp_after_admin_bar_render', array($this, 'arrayforms_add_iframe_loggedin_check'));
            }
        }
    }
    /**
     * Check if Classic Editor plugin is active.
     */
    function classic_editor_plugin_is_active() {
        if ( ! function_exists( 'is_plugin_active' ) ) {
            include_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        if ( is_plugin_active( 'classic-editor/classic-editor.php' ) ) {
            return true;
        }

        return false;
    }
    /**
     * Adds media button container that is populated by a react component within classicEditorIndex.js
     */
    function arrayforms_add_my_media_button() {
        echo '<span id="arrayforms-classic-editor-add-form-media-button"></span>';
    }
    /**
     * Add div container for the classic editor popup, populated via react
     */
    function arrayforms_add_classic_editor_popup_container(){
        echo '<div id="arrayforms-classic-editor-form-select"></div>';
    }
    /**
     * Adds an iframe that checks if user has an authenticated cookie
     */
    function arrayforms_add_iframe_loggedin_check(){
        $array_api_url = arrayforms_get_buildarray_webserver_url();
        $this_site_domain = parse_url(site_url());
        $this_site_domain = $this_site_domain['host'];
        echo '<div id="arrayforms-logged-in-check-container" style="height:0px;width:0px;opacity:0;"><iframe id="arrayforms-logged-in-check" src="' . esc_url($array_api_url . '/frame/authorized?source=wordpress&domain='. $this_site_domain) .'"></iframe></div>';
    }
    /**
     * Extend allowed iframe attributes to include allowtransparency
     */
    function extend_tinymce_allowed_iframe_attributes($initArray) {
        $ext = 'iframe[align<bottom?left?middle?right?top|class|allowtransparency|frameborder|height|id|longdesc|marginheight|marginwidth|name|scrolling<auto?no?yes|src|style|title|width],';
        if (isset($initArray['extended_valid_elements'])) {
            $initArray['extended_valid_elements'] .= ',' . $ext;
        } else {
            $initArray['extended_valid_elements'] = $ext;
        }
        return $initArray;
    }
}
