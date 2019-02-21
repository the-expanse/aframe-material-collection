import AFRAME from "aframe";

/**
 * Integer Input Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-int-input
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-int-input', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-text":{
            type:'int',
            placeHolder:'Whole Number...'
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