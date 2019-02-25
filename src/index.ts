/**
 * Application entry point
 * @author Shane Harris
 */

import * as Package from '../package.json';
import {registerComponentController, registerSystemController} from "aframe-typescript-boilerplate/built";
import {MaterialUiSystem} from "./MaterialUiSystem";
import {Border} from "./components/Border";
import {Button} from "./components/Button";
import {Checkbox} from "./components/Checkbox";
import {ColorPicker} from "./components/ColorPicker";
import {CurvedPlane} from "./components/CurvedPlane";
import {DoubleClick} from "./components/DoubleClick";
import {Icon} from "./components/Icon";
import {InputText} from "./components/InputText";
import {Modal} from "./components/Modal";
import {MouseShim} from "./components/MouseShim";
import {NumberComponent} from "./components/NumberComponent";
import {Radio} from "./components/Radio";
import {Ripple} from "./components/Ripple";
import {Rounded} from "./components/Rounded";
import {Slider} from "./components/Slider";
import {Switch} from "./components/Switch";
import {Toast} from "./components/Toast";
import {Yoga} from "./components/Yoga";
import {Renderer} from "./components/Renderer";
import {ScrollPane} from "./components/ScrollPane";

let version = Package.version;
console.log('aframe-material-collection version '+version);

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>';
}

registerSystemController(MaterialUiSystem.DEFINITION);

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
registerComponentController(Rounded.DEFINITION);
registerComponentController(Slider.DEFINITION);
registerComponentController(Switch.DEFINITION);
registerComponentController(Toast.DEFINITION);
registerComponentController(Yoga.DEFINITION);
registerComponentController(Renderer.DEFINITION);
registerComponentController(ScrollPane.DEFINITION);
