<?php
/**
 * @package ArrayForms
 */
namespace ArrayForms\Pages;

use ArrayForms\Api\SettingsApi;
use ArrayForms\Base\BaseController;
use ArrayForms\Api\Callbacks\AdminCallbacks;

class Admin extends BaseController {

    public $settings;

    public $callbacks;

    public $pages = array();

    public $subpages = array();

    public function register() {

        $this->settings = new SettingsApi();

        $this->callbacks = new AdminCallbacks();

        $this->setPages();

        $this->setSubPages();

        $this->setSettings();

        $this->setSections();

        //$this->settings->addPages( $this->pages )->withSubPage( 'Forms' )->addSubPages( $this->subpages )->register();
        $this->settings->addPages( $this->pages )->register();
    }
    
    public function setPages() {

		$this->pages = array(
			array(
				'page_title' => 'BuildForms Plugin', 
				'menu_title' => 'BuildForms', 
				'capability' => 'manage_options', 
				'menu_slug' => 'arrayforms', 
				'callback' => array( $this->callbacks, 'adminDashboard' ), 
				'icon_url' => 'data:image/svg+xml;base64,' . base64_encode('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.121 0v6.06h-6.06l-.001 6.06H0V0Z" fill="black" opacity=".5"/><path d="M20 7.879H7.878V20H20Z" fill="black"/></svg>'), 
				'position' => 25
			)
		);
	}

    public function setSubPages() {

        $this->subpages = [
            [    
                'parent_slug' => 'arrayforms', 
                'page_title' => 'BuildForms Pro',
                'menu_title' => 'BuildForms Pro',
                'capability' => 'manage_options',
                'menu_slug' => 'arrayforms_placholder',
                'callback' => function() { echo '<h1>Placeholder</h1>'; },
            ]
        ];
    }

    public function setSettings() {

        $args = array(
            array(
                'option_group' => 'array_options_group',
                'option_name' => 'array_example',
                'callback' => array( $this->callbacks, 'arrayOptionsGroup')
            )
        );

        $this->settings->setSettings( $args );
    }

    public function setSections() {

        $args = array(
            array(
                'id' => 'array_admin_index',
                'title' => '',
                'callback' => array( $this->callbacks, 'arrayAdminSection'),
                'page' => 'arrayforms'
            )
        );

        $this->settings->setSections( $args );
    }
}