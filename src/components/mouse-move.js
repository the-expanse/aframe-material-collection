/* global AFRAME */
/**
 * A component shim the mouse move evetn for the AFRAME cursor raycaster.
 * @namespace aframe-material-collection
 * @component ui-mouse-move
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-mouse-move', {
    init(){
        if (!this.el.components.raycaster) {
            throw 'ui-mouse-move component needs the raycaster component to be added.'
        }
    },
    tick() {
        // Get current intersections from raycaster component.
        this.el.components.raycaster.intersections.forEach(intersection=>{
            if(intersection.object.el){
                // Emit custom mouse move event ont he intersected element.
                intersection.object.el.emit('ui-mousemove',{cursorEl:this.el,intersection:intersection})
            }
        });
    }
});