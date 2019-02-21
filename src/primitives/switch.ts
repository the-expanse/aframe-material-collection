import AFRAME from "aframe";

/**
 * Switch Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-switch
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-switch', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-switch":{}
    },
    mappings: {
        value: 'ui-switch.value',
        disabled: 'ui-switch.disabled',
    }
}));