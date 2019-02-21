import AFRAME from "aframe";

/**
 * Radio Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-radio
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-radio', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-radio":{},
        "geometry":{
            primitive:'ring',
            radiusInner:0.0575,
            radiusOuter:0.0675,
            segmentsTheta:6
        },
        "material":{
            shader:'flat',
            color:'#afafaf'
        },
        "ui-ripple":{
            size:{x:0.1,y:0.1},
            zIndex:-0.001,
            color:'#afafaf'
        }
    },
    mappings: {
        color:'ui-radio.selectedColor',
        value: 'ui-radio.value',
        selected: 'ui-radio.selected',
        disabled: 'ui-radio.disabled',
    }
}));