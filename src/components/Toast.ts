import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Vector3} from "three";
import {UiElement} from "./UiElement";

export class Toast extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-toast",
        /* Schema */ {
            toastEl:{type:'selector'},
            message:{default:'Hello from toast!'}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Toast(component, entity, data));

    originalPosition: Vector3 = undefined as any as Vector3;
    closeTween: TWEEN.Tween = undefined as any as TWEEN.Tween;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.originalPosition = this.data.toastEl.getAttribute('position').clone();
        this.component.el.addEventListener('mousedown',()=>{
            if(this.closeTween)this.closeTween.stop();
            this.ui.isChanging(this.component.el.sceneEl,this.data.toastEl.object3D.uuid);
            this.data.toastEl.setAttribute('visible',true);
            this.data.toastEl.setAttribute('text-value',this.ui.shorten(this.data.message,85));
            let _this = this;
            new TWEEN.Tween({x:this.originalPosition.x,y:this.originalPosition.y-0.1,z:this.originalPosition.z})
                .to(this.originalPosition, 350)
                .onUpdate(function(){
                    _this.data.toastEl.setAttribute('position',this);
                })
                .onComplete(()=>{
                    // Stop changes
                    this.closeTween = new TWEEN.Tween({x:0.8})
                        .delay(2000)
                        .to({x:0.0001}, 350)
                        .onUpdate(function(){
                            _this.data.toastEl.setAttribute('opacity',this.x);
                        })
                        .onComplete(()=>{
                            this.data.toastEl.setAttribute('visible',false);
                            this.ui.stoppedChanging(this.data.toastEl.object3D.uuid);
                        })
                        .easing(TWEEN.Easing.Exponential.Out).start();
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween({x:0.0001})
                .to({x:0.8}, 350)
                .onUpdate(function(){
                    _this.data.toastEl.setAttribute('opacity',this.x);
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        });
    }

}