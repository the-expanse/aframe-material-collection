import AFRAME from "aframe";

/**
 * Number Widget Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-number
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-number', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-number":{}
    },
    mappings: {

    }
}));