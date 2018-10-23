/* global AFRAME */
/**
 * Slider Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-slider
 * @author Shane Harris
 */
module.exports = AFRAME.registerPrimitive('a-ui-slider', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-slider":{}
    },
    mappings: {
        value: 'ui-slider.value',
        disabled: 'ui-slider.disabled',
        "camera-el": 'ui-slider.cameraEl'
    }
}));