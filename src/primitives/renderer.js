/* global AFRAME */
/**
 * Renderer Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-renderer
 * @author Shane Harris
 */
module.exports = AFRAME.registerPrimitive('a-ui-renderer', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-renderer":{}
    },
    mappings: {
        "ui-panel":"ui-renderer.uiPanel",
        "look-controls-el":"ui-renderer.lookControlsEl",
        "look-controls-component":"ui-renderer.lookControlsComponent",
        "panel-position":"ui-renderer.panelPosition",
        "panel-size":"ui-renderer.panelSize",
        "render-resolution":"ui-renderer.renderResolution",
        "debug-raycaster":"ui-renderer.debugRaycaster",
        "fps":"ui-renderer.fps",
        "intersectable-class":"ui-renderer.intersectableClass",
    }
}));