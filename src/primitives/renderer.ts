import AFRAME from "aframe";

/**
 * UI Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui":{}
    },
    mappings: {
        "ui-panel":"ui.uiPanel",
        "look-controls-el":"ui.lookControlsEl",
        "look-controls-component":"ui.lookControlsComponent",
        "panel-position":"ui.panelPosition",
        "panel-size":"ui.panelSize",
        "panel-depth":"ui.panelDepth",
        "panel-color":"ui.panelColor",
        "panel-alpha":"ui.panelAlpha",
        "render-resolution":"ui.renderResolution",
        "debug-raycaster":"ui.debugRaycaster",
        "fps":"ui.fps",
        "intersectable-class":"ui.intersectableClass",
        "render-debug":"ui.debug",
        "init-delay":"ui.initDelay"
    }
}));