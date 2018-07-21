/* global AFRAME */
/**
 * Application entry point
 * @author Shane Harris
 */

// Yoga
window.Yoga = require('./vendor/yoga-layout/entry-browser');

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>'
}

// Primitives
const a_ui_button = require('./primitives/button');
const a_ui_fab_button = require('./primitives/fab_button');
const a_ui_fab_button_small = require('./primitives/fab_button_small');
const a_ui_switch = require('./primitives/switch');
const a_ui_checkbox = require('./primitives/checkbox');
const a_ui_radio = require('./primitives/radio');
const a_ui_text_input = require('./primitives/text-input');
const a_ui_number_input = require('./primitives/number-input');
const a_ui_int_input = require('./primitives/int-input');
const a_ui_password_input = require('./primitives/password-input');
const a_ui_scroll_pane = require('./primitives/scroll-pane');


// Components
const text = require('./components/text');
const btn = require('./components/btn');
const icon = require('./components/icon');
const rounded = require('./components/rounded');
const ripple = require('./components/ripple');
const ui_switch = require('./components/switch');
const scroll_pane = require('./components/scroll-pane');
const mouse_move = require('./components/mouse-move');
const double_click = require('./components/double-click');
const checkbox = require('./components/checkbox');
const radio = require('./components/radio');
const yoga_properties = require('./components/yoga');


