import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Utils} from "../utils";
import {Vector3} from "three";
import Tween = TWEEN.Tween;

export class Toast extends AbstractComponentController {

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
            Utils.isChanging(this.component.el.sceneEl,this.data.toastEl.object3D.uuid);
            this.data.toastEl.setAttribute('visible',true);
            this.data.toastEl.setAttribute('text-value',Utils.shorten(this.data.message,85));
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
                            Utils.stoppedChanging(this.data.toastEl.object3D.uuid);
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

    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {}

}