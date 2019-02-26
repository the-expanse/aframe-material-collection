import AFRAME from "aframe";

/**
 * Checkbox Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-checkbox
 * @author Shane Harris
 */

export = AFRAME.registerPrimitive('a-ui-checkbox', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-checkbox":{

        },
        "ui-ripple":{
            size:{x:0.1,y:0.1},
            zIndex:-0.001,
            color:'#afafaf'
        }
    },
    mappings: {
        value: 'ui-checkbox.value',
        disabled: 'ui-checkbox.disabled',
        indeterminate:'ui-checkbox.indeterminate'
    }
}));