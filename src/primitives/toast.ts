import AFRAME from "aframe";

/**
 * Toast Message Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-toast
 * @author Shane Harris
 */

export = AFRAME.registerPrimitive('a-ui-toast', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        geometry: {
            primitive: 'plane',
            width: 0.5,
            height: 0.2
        },
        material: {
            color: '#010e0f',
            shader: 'flat',
            transparent:true,
            opacity: 0.8
        },
        "ui-rounded":{borderRadius:0.01,curveSegments:3},
        text:{
            font:'roboto',
            value:'Toast Message!',
            align:'center',
            zOffset:0.002,
            wrapCount:20,
        }
    },
    mappings: {
        height: 'geometry.height',
        width: 'geometry.width',
        color: 'material.color',
        transparent: 'material.transparent',
        "font-color":'text.color',
        "text-value": 'text.value',
        "wrap-count":'text.wrapCount',
        "border-radius":"ui-rounded.borderRadius",
        "curve-segments":"ui-rounded.curveSegments"
    }
}));