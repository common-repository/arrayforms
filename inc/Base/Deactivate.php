<?php
/**
 * @package ArrayForms
*/
namespace ArrayForms\Base;

class Deactivate {

    public static function deactivate() {
        flush_rewrite_rules();
    }
}