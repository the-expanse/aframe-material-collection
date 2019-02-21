/* global AFRAME */
/**
 * Number Input Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-number-input
 * @author Shane Harris
 */
module.exports = AFRAME.registerPrimitive('a-ui-number-input', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-text":{
            type:'number',
            placeHolder:'Number...'
        },
        "ui-double-click":{}
    },
    mappings: {
        width:"ui-text.width",
        height:"ui-text.height",
        value:"ui-text.value",
        "place-holder":"ui-text.placeHolder"
    }
}));