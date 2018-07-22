/* global AFRAME */
/**
 * Floating Action Button Small Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-fab-button-small
 * @author Shane Harris
 */
module.exports = AFRAME.registerPrimitive('a-ui-fab-button-small', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        geometry: {
            primitive: 'circle',
            radius: 0.075,
            segments:6
        },
        material: {
            color: '#009688',
            shader: 'flat',
        },
        "ui-btn":{},
        "ui-ripple":{size:{x:0.125,y:0.125},zIndex:-0.001,color:'#ff0000'},
        "ui-icon":{size:{x:0.075,y:0.075}, src:'/icons/sort_white_64dp.png'}
    },
    mappings: {
        radius: 'geometry.radius',
        color: 'material.color',
        url: 'ui-icon.url',
        "ripple-color":'ui-ripple.color',
        disabled:'ui-btn.disabled'
    }
}));