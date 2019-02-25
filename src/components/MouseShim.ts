import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Intersection} from "three";
import {UiElement} from "./UiElement";

export class MouseShim extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-mouse-shim",
        /* Schema */ {
            fps:{type:'number',default:45}
        },
        /* Multiple */ false,
        /* Receive ticks */ true,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new MouseShim(component, entity, data));

    onmousewheele = (e: any) => {};
    lastMouseMoveTime = 0;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        if (!this.component.el.components.raycaster) {
            throw 'ui-mouse-move component needs the raycaster component to be added.'
        }
        // Add support for mouse wheel
        this.onmousewheele = this.onMouseWheel.bind(this);
        (this.component.el.sceneEl as any).raycaster = this.component.el.components.raycaster;
    }

    pause(): void {
        this.component.el.sceneEl!!.renderer.domElement.removeEventListener( 'wheel',this.onmousewheele , false);
    }

    play(): void {
        this.component.el.sceneEl!!.renderer.domElement.addEventListener( 'wheel',this.onmousewheele , false);
    }


    tick(time: number, timeDelta: number): void {
        if(new Date().getTime()-this.lastMouseMoveTime<(1000/this.data.fps))return;
        this.emitMouseEvent('ui-mousemove', new MouseEvent('ui-mousemove'));
        this.lastMouseMoveTime = new Date().getTime();
    }

    onMouseWheel(e: MouseEvent){
        this.emitMouseEvent('ui-mousewheel',e);
    }

    emitMouseEvent(eventType: string, event: MouseEvent){
        if((this.component.el.sceneEl as any).cursorPoint&&(this.component.el.components.raycaster as any).intersections.length&&this.component.el.sceneEl!!.renderer.vr.enabled){
            (this.component.el.sceneEl as any).cursorPoint.position.copy((this.component.el.components.raycaster as any).intersections[0].point);
            (this.component.el.sceneEl as any).cursorPoint.scale.set(1,1,1);
        }else{
            if((this.component.el.sceneEl as any).cursorPoint&&!(this.component.el.sceneEl as any).hasSceneCursor){
                (this.component.el.sceneEl as any).cursorPoint.scale.set(0.00001,0.00001,0.00001);
            }
        }
        // Get current intersections from raycaster component.
        (this.component.el.components.raycaster as any).intersections.forEach((intersection: Intersection) =>{
            if((intersection.object as any).el){
                // Emit custom mouse move event ont he intersected element.
                (intersection.object as any).el.emit(eventType,{cursorEl:this.component.el,intersection:intersection,evt:event})
            }
        });
    }
}