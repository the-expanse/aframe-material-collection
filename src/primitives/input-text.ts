import AFRAME from "aframe";

/**
 * Text Input Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-input-text
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-input-text', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-input-text":{
            placeHolder:'Text...',
            width:1,
            height:0.2,
            value:''
        },
        "ui-double-click":{}
    },
    mappings: {
        width:"ui-input-text.width",
        height:"ui-input-text.height",
        type:"ui-input-text.type",
        value:"ui-input-text.value",
        "background-color":"ui-input-text.backgroundColor",
        "place-holder":"ui-input-text.placeHolder",
        "camera-el":"ui-input-text.cameraEl",
        "rig-el":"ui-input-text.rigEl",
        "tab-next":"ui-input-text.tabNext",
        "look-controls-component":"ui-input-text.lookControlsComponent",
        "wasd-controls-component":"ui-input-text.wasdControlsComponent",
    }
}));