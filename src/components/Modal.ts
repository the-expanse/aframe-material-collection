import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class Modal extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-modal",
        /* Schema */ {
            modal:{type:'selector'},
            main:{type:'selector'}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Modal(component, entity, data));

    modalPanel = undefined as any as  Entity;
    mainComponents = {};
    modalComponents = {};
    openModal = () => {};
    modalTween = undefined as any;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        if(this.data.modal&&this.data.main){
            // Get the modal panel to be able to animate its scale on open/close.
            this.modalPanel = document.querySelector(this.data.modal.getAttribute('ui-panel'));

            this.mainComponents = this.data.main.components;
            this.modalComponents = this.data.modal.components;
            // Pause rendering of modal until opened.
            if(this.modalComponents&&this.modalComponents['ui']){
                this.modalComponents['ui'].pause();
            }
            // Setup close listeners for anything with the class close-modal.
            let close_buttons = this.data.modal.querySelectorAll('.close-modal');
            for(let i = 0; i < close_buttons.length; i++ ){
                let close_button = close_buttons[i];
                close_button.addEventListener('mousedown',()=>{
                    this.close();
                });
            }
            // Add click handler for opening the modal, pause the main render screen and play the modal renderer
            this.openModal = this.open.bind(this);
            this.component.el.addEventListener('mousedown',this.openModal);
            this.data.main.modal = this;

            // Expose methods to open/close the modal.
            (this.component.el as any).open = this.open.bind(this);
            (this.component.el as any).close = this.close.bind(this);
        }
    }

    remove(): void {
        this.component.el.removeEventListener('mousedown',this.openModal);
    }
    
    open(){
        if(this.mainComponents&&this.mainComponents['ui']){
            this.mainComponents['ui'].el.pauseRender();
            this.tweenModalScale(0.0000001,1);
            this.modalComponents['ui'].play();
        }
    }
    close(){
        // Pause the modal rendering and play the main rendering again.
        this.modalComponents['ui'].pause();
        this.mainComponents['ui'].play();
        this.mainComponents['ui'].el.playRender();
        this.tweenModalScale(1,0.0000001)
            .then(()=>{
                this.component.el.sceneEl!!.emit('modal-closed');
            });
    }
    tweenModalScale(from: number, to: number){
        return new Promise(r=>{
            let _this = this;
            if(this.modalTween)this.modalTween.stop();
            this.modalTween = new TWEEN.Tween({x:from})
                .to({x:to}, 250)
                .onUpdate(function () {
                    if(_this.modalPanel)
                        _this.modalPanel.setAttribute('scale',this.x+' '+this.x+' '+this.x);
                })
                .onComplete(r)
                .easing(TWEEN.Easing.Exponential.Out).start();
        });
    }
}