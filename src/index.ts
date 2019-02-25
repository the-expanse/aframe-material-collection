/* global AFRAME */
/**
 * Application entry point
 * @author Shane Harris
 */

import * as Package from '../package.json';
import {registerComponentController, registerSystemController} from "aframe-typescript-boilerplate/built";
import {ExampleUiComponent} from "./component/ExampleUiComponent";
import {MaterialUiSystem} from "./MaterialUiSystem";
import {Border} from "./component/Border";
import {Button} from "./component/Button";
import {Checkbox} from "./component/Checkbox";
import {ColorPicker} from "./component/ColorPicker";
import {CurvedPlane} from "./component/CurvedPlane";
import {DoubleClick} from "./component/DoubleClick";
import {Icon} from "./component/Icon";
import {InputText} from "./component/InputText";
import {Modal} from "./component/Modal";
import {MouseShim} from "./component/MouseShim";
import {NumberComponent} from "./component/NumberComponent";
import {Radio} from "./component/Radio";
import {Ripple} from "./component/Ripple";

let version = Package.version;
console.log('aframe-material-collection version '+version);

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>';
}

let UI = import('./ui');

(window as any).UI = UI;

registerSystemController(MaterialUiSystem.DEFINITION);

registerComponentController(ExampleUiComponent.DEFINITION);
registerComponentController(Border.DEFINITION);
registerComponentController(Button.DEFINITION);
registerComponentController(Checkbox.DEFINITION);
registerComponentController(ColorPicker.DEFINITION);
registerComponentController(CurvedPlane.DEFINITION);
registerComponentController(DoubleClick.DEFINITION);
registerComponentController(Icon.DEFINITION);
registerComponentController(InputText.DEFINITION);
registerComponentController(Modal.DEFINITION);
registerComponentController(MouseShim.DEFINITION);
registerComponentController(NumberComponent.DEFINITION);
registerComponentController(Radio.DEFINITION);
registerComponentController(Ripple.DEFINITION);
