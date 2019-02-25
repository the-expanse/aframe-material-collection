/**
 * Application entry point
 * @author Shane Harris
 */

import {registerMaterialUiSystem} from "./ui";

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>';
}

registerMaterialUiSystem();