import AFRAME from "aframe";

/**
 * Scroll Pane Primitive for aframe-material-collection.
 * @namespace aframe-material-collection
 * @primitive a-ui-scroll-pane
 * @author Shane Harris
 */
export = AFRAME.registerPrimitive('a-ui-scroll-pane', AFRAME.utils.extendDeep({}, AFRAME.primitives.getMeshMixin(), {
    defaultComponents: {
        "ui-scroll-pane":{

        }
    },
    mappings: {
        width:"ui-scroll-pane.width",
        height:"ui-scroll-pane.height",
        "scroll-z-offset":"ui-scroll-pane.scrollZOffset",
        "handle-color":"ui-scroll-pane.scrollHandleColor",
        "scroll-padding":"ui-scroll-pane.scrollPadding",
        "look-controls-el":"ui-scroll-pane.cameraEl",
        "look-controls-component":"ui-scroll-pane.lookControlsComponent"
    }
}));