/* global AFRAME */
/**
 * Application entry point
 * @author Shane Harris
 */

// Yoga
window.Yoga = require('./vendor/yoga-layout/entry-browser');

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>';
}

module.exports = {
    // Primitives
    a_ui_button: require('./primitives/button'),
    a_ui_fab_button: require('./primitives/fab_button'),
    a_ui_fab_button_small: require('./primitives/fab_button_small'),
    a_ui_switch: require('./primitives/switch'),
    a_ui_checkbox: require('./primitives/checkbox'),
    a_ui_radio: require('./primitives/radio'),
    a_ui_text_input: require('./primitives/text-input'),
    a_ui_number_input: require('./primitives/number-input'),
    a_ui_int_input: require('./primitives/int-input'),
    a_ui_password_input: require('./primitives/password-input'),
    a_ui_scroll_pane: require('./primitives/scroll-pane'),

    // Components
    text: require('./components/text'),
    btn: require('./components/btn'),
    icon: require('./components/icon'),
    rounded: require('./components/rounded'),
    ripple: require('./components/ripple'),
    ui_switch: require('./components/switch'),
    scroll_pane: require('./components/scroll-pane'),
    mouse_move: require('./components/mouse-move'),
    double_click: require('./components/double-click'),
    checkbox: require('./components/checkbox'),
    radio: require('./components/radio'),
    yoga_properties: require('./components/yoga'),
};


