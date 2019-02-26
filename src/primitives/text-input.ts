import AFRAME from "aframe";

/**
 * Text Input Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-text-input
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-text-input', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-text":{
            placeHolder:'Text...'
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