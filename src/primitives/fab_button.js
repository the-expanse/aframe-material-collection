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
            radius: 0.2,
            segments:6
        },
        material: {
            color: '#009688',
            shader: 'flat',
        },
        "ui-btn":{},
        "ui-ripple":{size:{x:0.2,y:0.2},zIndex:0.002,fadeDelay:300,duration:500},
        "ui-icon":{size:{x:0.21,y:0.21}}
    },
    mappings: {
        radius: 'geometry.radius',
        color: 'material.color',
        url: 'ui-icon.url',
        "ripple-color":'ui-ripple.color',
        disabled:'ui-btn.disabled'
    }
}));