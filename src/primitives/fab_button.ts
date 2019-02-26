import AFRAME from "aframe";

/**
 * Floating Action Button Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-fab-button
 * @author Shane Harris
 */

export = AFRAME.registerPrimitive('a-ui-fab-button', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
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
        "icon-color": 'ui-icon.color',
        transparent: 'material.transparent',
        src: 'ui-icon.src',
        "ripple-color":'ui-ripple.color',
        "ripple-size":'ui-ripple.size',
        "ripple-z-index":'ui-ripple.zIndex',
        disabled:'ui-btn.disabled',
        coords:'ui-icon.spriteCoords'
    }
}));