
import './primitives/button';
import './primitives/fab_button';
import './primitives/switch';
import './primitives/slider';
import './primitives/number';
import './primitives/toast';
import './primitives/checkbox';
import './primitives/radio';
import './primitives/input-text';
import './primitives/text-input';
import './primitives/number-input';
import './primitives/int-input';
import './primitives/password-input';
import './primitives/scroll-pane';
import './primitives/renderer';

import * as Package from '../package.json';
import {registerComponentController, registerSystemController} from "aframe-typescript-boilerplate/built";
import {MaterialUiSystem} from "./systems/MaterialUiSystem";
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
import {UI} from "./components/UI";
import {ScrollPane} from "./components/ScrollPane";

export function registerMaterialUiSystem() {

    console.log('aframe-material-collection version ' + Package.version);

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
    registerComponentController(UI.DEFINITION);
    registerComponentController(ScrollPane.DEFINITION);

}