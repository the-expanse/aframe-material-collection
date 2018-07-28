/* global AFRAME */
/**
 * Floating Action Button Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-fab-button
 * @author Shane Harris
 */

module.exports = AFRAME.registerPrimitive('a-ui-fab-button', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        geometry: {
            primitive: 'circle',
            radius: 0.1,
            segments:6
        },
        material: {
            color: '#009688',
            shader: 'flat',
        },
        "ui-btn":{},
        "ui-ripple":{size:{x:0.1,y:0.1},zIndex:0.002,fadeDelay:300,duration:500},
        "ui-icon":{size:{x:0.105,y:0.105}}
    },
    mappings: {
        radius: 'geometry.radius',
        color: 'material.color',
        src: 'ui-icon.src',
        "ripple-color":'ui-ripple.color',
        disabled:'ui-btn.disabled'
    }
}));