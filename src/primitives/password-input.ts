import AFRAME from "aframe";

/**
 *  Password Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-password-input
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-password-input', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-text":{
            type:'password',
            placeHolder:''
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