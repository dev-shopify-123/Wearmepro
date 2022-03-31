"use strict";

var $ = j341;

$(document).ready(function () {
    if (document.querySelectorAll('.cocoen').length) {
        $(function () {
            $(".cocoen").twentytwenty({
                default_offset_pct: 0.4,
                before_label: false,
                after_label: false,
                no_overlay: true,
                move_with_handle_only: true,
                click_to_move: true
            });
        });
    }
});