import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class Button extends UiElement {

    defaultZ = 0;
    is_clicked = false;

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-btn",
        /* Schema */ {
            duration: {type: 'int', default: 250},
            hoverHeight: {type: 'number', default: 0.01},
            activeHeight: {type: 'number', default: -0.001},
            disabled: {type: 'boolean', default: false},
            preventUpdates: {type: 'boolean', default: false}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Button(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        // Store the current button z value for animating mouse events
        this.defaultZ = this.component.el.object3D.position.z;
        // register input events for interaction
        if (!this.data.disabled) {
            this.component.el.addEventListener('mouseenter', e => this.mouseEnter(e as MouseEvent));
            this.component.el.addEventListener('mousedown', e => this.mouseDown(e as MouseEvent));
            this.component.el.addEventListener('mouseup', e => this.mouseUp(e as MouseEvent));
            this.component.el.addEventListener('mouseleave', e => this.mouseLeave(e as MouseEvent));
        }
    }
    
    mouseEnter(e: MouseEvent) {
        const _this = this;
        // Lift the button up for hover animation
        this.tween(this.defaultZ, this.defaultZ + this.data.hoverHeight,  function () {
            _this.component.el.object3D.position.z = this.x;
        }, function () {
            _this.component.el.object3D.position.z = _this.defaultZ + _this.data.hoverHeight;
        });
        //this.ui.preventDefault(e)
    };
    
    mouseLeave(e: MouseEvent) {
        // Ignore mouse leave event if the button was clicked - mouse up already resets to default state.
        if (this.is_clicked) {
            return this.is_clicked = false;
        }
        // Reset button state from hover
        this.resetAnimation(this.defaultZ + this.data.hoverHeight);
        //this.ui.preventDefault(e)
    };
    
    mouseUp(e: MouseEvent) {
        this.is_clicked = true;
        // Reset button state from pressed
        this.resetAnimation(this.defaultZ + this.data.activeHeight);
        this.ui.preventDefault(e)
    };
    
    mouseDown(e: MouseEvent) {
        const _this = this;
        // Press state animation from hovered
        this.tween(this.defaultZ + this.data.hoverHeight, this.defaultZ + this.data.activeHeight, function () {
            _this.component.el.object3D.position.z = this.x;
        }, function () {
            _this.component.el.object3D.position.z = _this.defaultZ + _this.data.activeHeight;
        });
        this.ui.preventDefault(e)
    };
    
    resetAnimation(start_z: number) {
        let _this = this;
        this.tween(start_z, this.defaultZ, function () {
            _this.component.el.object3D.position.z = this.x;
        }, function () {
            _this.component.el.object3D.position.z = _this.defaultZ;
        })
    };
    
    tween(from: number, to: number, callback: any, complete: any) {
        let _this = this;
        // Start changes
        if (!this.data.preventUpdates) this.ui.isChanging(this.component.el.sceneEl, this.component.el.object3D.uuid);
        return new TWEEN.Tween({x: from})
            .to({x: to}, this.data.duration)
            .onUpdate(callback)
            .onComplete( () => {
                // Stop changes
                if (!_this.data.preventUpdates) this.ui.stoppedChanging(_this.component.el.object3D.uuid);
                return complete.call(this);
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
}