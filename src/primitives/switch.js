/* global AFRAME */
/**
 * Switch Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-switch
 * @author Shane Harris
 */
module.exports = AFRAME.registerPrimitive('a-ui-switch', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-switch":{
            hasShadow: true
        }
    },
    mappings: {
        value: 'ui-switch.value',
        disabled: 'ui-switch.disabled',
        "has-shadow":'ui-switch.hasShadow',
    }
}));