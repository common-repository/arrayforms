<?php
/**
 * @package ArrayForms
*/
namespace ArrayForms\Base;

class Activate {

    public static function activate() {
        flush_rewrite_rules();
    }
}