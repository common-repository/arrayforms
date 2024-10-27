<?php

/**
 * @package ArrayForms
 */

namespace ArrayForms\Api\Callbacks;

use ArrayForms\Base\BaseController;

class AdminCallbacks extends BaseController {

    public function adminDashboard() {

        return require_once("$this->plugin_path/templates/admin.php");
    }

    public function arrayOptionsGroup($input) {

        return $input;
    }

    public function arrayFormsIcon() {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="28px" height="28px" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.121 0v6.06h-6.06l-.001 6.06H0V0Z" fill="#ec7965" /><path d="M20 7.879H7.878V20H20Z" fill="#000"/></svg>';
    }

    public function loadingSpinner() {
        return '<div class="array-loading-spinner-container"><div class="array-forms-icon">' . $this->arrayFormsIcon() . '</div><div class="array-loading-spinner"><div></div><div></div><div></div></div></div>';
    }

    public function outputLoadingSpinner(){
        $allowedTags = array(
            'div'   => array('class' => true),
            'svg'   => array('class' => true, 'xmlns' => true, 'xmlns:xlink' => true, 'width' => true, 'height' => true, 'viewBox' => true, 'viewbox' => true, 'version' => true),
            'g' => array('id' => true),
            'path' => array('d' => true, 'transform' => true, 'fill' => true, 'opacity' => true)
        );
        echo wp_kses($this->loadingSpinner(), $allowedTags);
    }

    public function outputLoginFrame(){
        $this_site_domain = parse_url(site_url());
        $this_site_domain = '/' . $this_site_domain['host'];

        $login_url = '/frame/login/wordpress';
        $logged_in_url = '/admin';
        $edit_form_id = filter_input(INPUT_GET, "arrayforms_editFormId", FILTER_SANITIZE_FULL_SPECIAL_CHARS);

        //forward to edit form if formId is passed on the querystring
        if (!empty($edit_form_id)) {
            $logged_in_url = '/admin/edit-forms/design/' . $edit_form_id;
        }

        echo '<input type="hidden" id="arrayforms-current-domain" value="' . substr(esc_url($this_site_domain), 1) . '" />';
        echo '<input type="hidden" id="arrayforms-login-url" value="' . substr(esc_url($logged_in_url), 1) . '" />';
        echo '<input type="hidden" id="arrayforms-logged-out-url" value="' . substr(esc_url($login_url), 1) . '" />';
    }

    public function arrayAdminSection() {
        $this->outputLoadingSpinner();
        $this->outputLoginFrame();
    }
}
