<?php
/**
 * @package ArrayForms
*/

/*
 Plugin Name: BuildForms
 Plugin URI: https://www.buildarray.com/market/integrations
 Description: Allows easy integration and editing of BuildArray.com forms
 Version: 1.0.2
 Author: Array
 Author URI: https://www.buildarray.com
 License: GPLv2 or later
 License URI: https://www.gnu.org/licenses/gpl-2.0.html
 Text Domain: arrayforms
*/

/*
This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.
*/

// If this file is called directly, abort
defined( 'ABSPATH' ) or die( 'You cannot access this file.' );

define( 'ARRAYFORMS_PLUGIN_URL', plugins_url('arrayforms'));
define( 'ARRAYFORMS_PLUGIN_DIR_PATH', plugin_dir_path( __FILE__ ));

add_action( 'wp_logout', 'arrayforms_logout_user', 300);

function arrayforms_logout_user($user_id){
    nocache_headers();
    $array_api_url = arrayforms_get_buildarray_webserver_url($user_id);
    $login_url = wp_login_url() . '?loggedout=true';
    wp_redirect( $array_api_url . '/frame/logout?redirect=' . $login_url );
    exit();
}

// require_once the composer autoload
if (file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' )) {
    require_once dirname( __FILE__ ) . '/vendor/autoload.php';
}

/**
 * Code that runs during plugin activation
 */
function arrayforms_activate_arrayforms_plugin() {
    ArrayForms\Base\Activate::activate();
}

register_activation_hook( __FILE__, 'arrayforms_activate_arrayforms_plugin' );

/**
 * Code that runs during plugin deactivation
 */
function arrayforms_deactivate_arrayforms_plugin() {
    ArrayForms\Base\Deactivate::deactivate();
}

register_deactivation_hook( __FILE__, 'arrayforms_deactivate_arrayforms_plugin' );

/**
 * Initialize all the core classes of the plugin
 */
if (class_exists( 'ArrayForms\\Init' )) {
    ArrayForms\Init::register_services();
}

function arrayforms_get_buildarray_domain_only($host){
    $host = strtolower(trim($host));
    $host = ltrim(str_replace("http://","",str_replace("https://","",$host)),"www.");
    $count = substr_count($host, '.');
    if($count === 2){
        if(strlen(explode('.', $host)[1]) > 3) $host = explode('.', $host, 2)[1];
    } else if($count > 2){
        $host = arrayforms_get_buildarray_domain_only(explode('.', $host, 2)[1]);
    }
    $host = explode('/',$host);
    return $host[0];
}

function arrayforms_get_buildarray_webserver_url($user_id = null){
    $array_api_url = "https://www.buildarray.com";
    if( function_exists('wp_get_environment_type')) {
        $safe_buildarray_domains = ['buildarray.com'];
        $in_development_mode = wp_get_environment_type() == 'development';
        if($in_development_mode){
            $current_user_id = null;
            if($user_id){
                $current_user_id = $user_id;
            }else{
                $current_user_id = get_current_user_id();
            }
            if($current_user_id){
                $user_website = get_the_author_meta('user_url', $current_user_id);
                if($user_website){
                    $user_domain = arrayforms_get_buildarray_domain_only($user_website);
                    if(in_array($user_domain, $safe_buildarray_domains)){
                        $array_api_url = $user_website;
                    }
                }
            }
        }
    }
    return $array_api_url;
}

function arrayforms_block_init() {
	$array_block_type = register_block_type_from_metadata( __DIR__ );
    wp_localize_script($array_block_type->editor_script, 'arrayforms_php_vars', [
        'admin_url' => admin_url('', 'relative'),
        'arrayforms_webserver_url' => arrayforms_get_buildarray_webserver_url()
    ]);
}
add_action( 'init', 'arrayforms_block_init' );