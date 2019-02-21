import AFRAME from "aframe";
import THREE, {Raycaster} from "three";
import UI from '../ui';

/**
 * A component shim the mouse move event for the AFRAME cursor raycaster.
 * @namespace aframe-material-collection
 * @component ui-mouse-shim
 * @author Shane Harris
 */

export = AFRAME.registerComponent('ui-mouse-shim', {
    onmousewheele: (e: any) => {},
    lastMouseMoveTime: 0,
    schema:{
        fps:{type:'number',default:45}
    },
    init(){
        if (!this.el.components.raycaster) {
            throw 'ui-mouse-move component needs the raycaster component to be added.'
        }
        // Add support for mouse wheel
        this.onmousewheele = this.onMouseWheel.bind(this);
        (this.el.sceneEl as any).raycaster = this.el.components.raycaster;
    },
    pause(){
        this.el.sceneEl!!.renderer.domElement.removeEventListener( 'wheel',this.onmousewheele , false);
    },
    play(){
        this.el.sceneEl!!.renderer.domElement.addEventListener( 'wheel',this.onmousewheele , false);
    },
    onMouseWheel(e){
        this.emitMouseEvent('ui-mousewheel',e);
    },
    tick() {
        if(new Date().getTime()-this.lastMouseMoveTime<(1000/this.data.fps))return;
        this.emitMouseEvent('ui-mousemove', undefined);
        this.lastMouseMoveTime = new Date().getTime();
    },
    emitMouseEvent(eventType,event){
        if((this.el.sceneEl as any).cursorPoint&&(this.el.components.raycaster as any).intersections.length&&this.el.sceneEl!!.renderer.vr.enabled){
            (this.el.sceneEl as any).cursorPoint.position.copy((this.el.components.raycaster as any).intersections[0].point);
            (this.el.sceneEl as any).cursorPoint.scale.set(1,1,1);
        }else{
            if((this.el.sceneEl as any).cursorPoint&&!(this.el.sceneEl as any).hasSceneCursor){
                (this.el.sceneEl as any).cursorPoint.scale.set(0.00001,0.00001,0.00001);
            }
        }
        // Get current intersections from raycaster component.
        (this.el.components.raycaster as any).intersections.forEach(intersection=>{
            if(intersection.object.el){
                // Emit custom mouse move event ont he intersected element.
                intersection.object.el.emit(eventType,{cursorEl:this.el,intersection:intersection,evt:event})
            }
        });
    }
});