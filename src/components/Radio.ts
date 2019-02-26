import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Color} from "three";
import {UiElement} from "./UiElement";

export class Radio extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-radio",
        /* Schema */ {
            value: {default: ''},
            selected:{type: 'boolean', default: false},
            selectedColor: {default: '#009688'},
            selectedRadius: {type:'number',default: 0.045},
            unselectedColor: {default: '#5f5f5f'},
            disabledColor: {default: '#afafaf'},
            disabled: {type: 'boolean', default: false},
            intersectableClass: {default: 'intersectable'},
            width:{type:'number',default: 0.15},
            height:{type:'number',default: 0.15},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Radio(component, entity, data));

    width = 0;
    height = 0;
    filled_circle = undefined as any as Entity | null;
    isRippling = false;
    isSelecting = false;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.width = 0.15;
        this.height = 0.15;
        // Create center circle for checked state.
        this.component.el.addEventListener('loaded',()=>{

            let handle = `
            <a-circle radius="`+this.data.selectedRadius+`" color="`+(this.data.disabled?this.data.disabledColor:this.data.selectedColor)+`" 
            position="0 0 0" scale="0 0 0" shader="flat" class="no-yoga-layout" segments="6"></a-circle>`;
            this.component.el.insertAdjacentHTML('beforeend',handle);
            this.filled_circle = this.component.el.lastChild as Entity | null;
            (this.component.el.components.material as any).material.color = new Color(this.data.disabled?this.data.disabledColor:this.data.unselectedColor);

            // Create backing for getting click events.
            let backing = `
            <a-circle radius="`+this.data.selectedRadius+`" position="0 0 -0.002" opacity="0.0001" transparent="true" 
            shader="flat" class="`+this.data.intersectableClass+` no-yoga-layout" segments="6"></a-circle>`;
            this.component.el.insertAdjacentHTML('beforeend',backing);
            // Set this if it is checked.
            if(this.data.selected){
                this.filled_circle!!.addEventListener('loaded',()=>{
                    this.click();
                });
            }
            // TODO: need to add play/pause methods for registering/unregistering events.
            if(!this.data.disabled){
                this.component.el.addEventListener('mousedown', (e) => (this.click as any)(e));
            }
        });
    }

    deselect(){
        // Deselect this radio with a scale animation on the circle.
        this.component.el.setAttribute('selected',false);
        let _this = this;
        // Start changes
        this.ui.isChanging(this.component.el.sceneEl,this.component.el.object3D.uuid);
        new TWEEN.Tween({x:1})
            .to({ x: 0.000001}, 200)
            .onUpdate(function(){
                _this.filled_circle!!.object3D.scale.set(this.x,this.x,this.x);
            })
            .onComplete(()=>{
                // Stop changes
                this.ui.stoppedChanging(_this.component.el.object3D.uuid);
                this.isRippling = false;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
    
    click(){
        // Get all other radio siblings and reset their state if they are selected.
        [].slice.call(this.component.el.parentNode!!.querySelectorAll('a-ring,a-ui-radio')).filter(el=>el!==this.component.el).forEach((ring: Entity)=>{
            if(ring.components['ui-radio']&&ring.getAttribute('selected')==="true"){
                (ring.components['ui-radio'] as any).controller.deselect();
            }
        });
        // Emit the current selected value
        this.component.el.emit('ui-radio-changed',this.data.value);
        // Set this radio's selected state.
        this.component.el.setAttribute('selected',true);
        // Throttle animations.
        if(this.isSelecting)return;
        this.isSelecting = true;
        let _this = this;
        // Start changes
        this.ui.isChanging(this.component.el.sceneEl,this.filled_circle!!.object3D.uuid);
        new TWEEN.Tween({x:0.000001})
            .to({ x: 1}, 250)
            .onUpdate(function(){
                _this.filled_circle!!.object3D.scale.set(this.x,this.x,this.x);
            })
            .onComplete(()=>{
                // Stop changes
                this.ui.stoppedChanging(this.filled_circle!!.object3D.uuid);
                this.isSelecting = false;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
}