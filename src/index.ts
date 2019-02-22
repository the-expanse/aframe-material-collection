/* global AFRAME */
/**
 * Application entry point
 * @author Shane Harris
 */

import * as Package from '../package.json';
import Yoga from "yoga-layout";

let version = Package.version;
console.log('aframe-material-collection version '+version);

if (typeof AFRAME === 'undefined') {
    throw 'aframe-material-collection requires AFRAME to be loaded first. - <script src="https://aframe.io/releases/0.8.2/aframe.min.js"></script>';
}

let UI = import('./ui');

(window as any).UI = UI;


