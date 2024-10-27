<?php

/**
 * @package ArrayForms
 */

namespace ArrayForms\Api;

class SettingsApi {

    public $admin_pages = array();

    public $admin_subpages = array();

    public $settings = array();

    public $sections = array();


    public function __construct() {
        $this->plugin_url = plugin_dir_url( dirname( __FILE__, 2));
    }

    public function register() {

        if (!empty($this->admin_pages)) {
            add_action('admin_menu', array($this, 'addAdminMenu'));
        }

        if (!empty($this->settings)) {
            add_action('admin_init', array($this, 'registerCustomFields'));
        }
    }

    public function addPages(array $pages) {

        $this->admin_pages = $pages;

        return $this;
    }

    public function withSubPage(string $title = null) {

        if (empty($this->admin_pages)) {
            return $this;
        }

        $admin_page = $this->admin_pages[0];

        $subpage = [
            [
                'parent_slug' => $admin_page['menu_slug'],
                'page_title' => $admin_page['page_title'],
                'menu_title' => ($title) ? $title : $admin_page['menu_title'],
                'capability' => $admin_page['capability'],
                'menu_slug' => $admin_page['menu_slug'],
                'callback' => function () {
                    echo '<h1>BuildForms Plugin</h1>';
                },
            ]
        ];

        $this->admin_subpages = $subpage;

        return $this;
    }

    public function addSubPages(array $pages) {

        $this->admin_subpages = array_merge($this->admin_subpages, $pages);

        return $this;
    }

    public function addAdminMenu() {

        foreach ($this->admin_pages as $page) {
            $new_admin_page = add_menu_page($page['page_title'], $page['menu_title'], $page['capability'], $page['menu_slug'], $page['callback'], $page['icon_url'], $page['position']);
            add_action('load-' . $new_admin_page, array($this, 'loadAdminDependencies'));
        }

        foreach ($this->admin_subpages as $page) {
            add_submenu_page($page['parent_slug'], $page['page_title'], $page['menu_title'], $page['capability'], $page['menu_slug'], $page['callback']);
        }
    }
    /**
     * Enqueuing dependencies this way, so that they're only included on a specific admin page
     */
    public function loadAdminDependencies() {
        add_action('admin_enqueue_scripts', array($this, 'enqueueAdminDependencies'));
    }

    public function enqueueAdminDependencies() {
        wp_enqueue_style('arrayforms_settings_style', $this->plugin_url . 'assets/settings.css');
        wp_enqueue_script('arrayforms_login', $this->plugin_url . 'assets/login.js');
        wp_localize_script('arrayforms_login', 'arrayforms_vars', [
            'nonce' => wp_create_nonce( 'wp_rest' ), 
            'rest_api_endpoint' => rest_url(),
            'arrayforms_webserver_url' => arrayforms_get_buildarray_webserver_url()
        ]);
    }

    public function setSettings(array $settings) {

        $this->settings = $settings;

        return $this;
    }

    public function setSections(array $sections) {

        $this->sections = $sections;

        return $this;
    }

    public function registerCustomFields() {

        // register setting
        foreach ($this->settings as $setting) {
            register_setting($setting["option_group"], $setting["option_name"], (isset($setting["callback"]) ? $setting["callback"] : ''));
        }

        // add settings section
        foreach ($this->sections as $section) {
            add_settings_section(
                $section["id"],
                $section["title"],
                (isset($section["callback"]) ? $section["callback"] : ''),
                $section["page"]
            );
        }

    }
}
