import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Mesh, MeshBasicMaterial, Object3D, Vector3} from "three";
import {UiElement} from "./UiElement";

export class Switch extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-switch",
        /* Schema */ {
            value: {type:'boolean',default: false},
            disabled:{type:'boolean',default: false},
            progressColor:{default:'#4db6ac'},
            handleColor:{default:'#009688'},
            handleDisabledColor:{default:'#afafaf'},
            railColor:{default:'#fff'},
            switchDuration:{type:'int',default: 350},
            handleZIndex:{type:'number',default:0.01},
            intersectableClass: {default: 'intersectable'},
            width:{type:'number',default: 0.3},
            height:{type:'number',default: 0.1},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory Switch */ (component: Component, entity: Entity, data: any) =>
            new Switch(component, entity, data));

    width = 0;
    height = 0;

    handleEl: Entity = undefined as any as Entity;
    railEl: Entity = undefined as any as Entity;

    progress: Mesh = undefined as any as Mesh;

    clickHandler = (e)=>{};

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.width = 0.3;
        this.height = 0.1;
        // Setup handle circle entity.
        let handle = `
            <a-circle radius="0.055" shader="flat" color="`+this.data.handleColor+`" 
            ui-ripple="size:0.1 0.1;color:#999;fadeDelay:300;duration:500" class="`+this.data.intersectableClass+` no-yoga-layout"
            position="-0.05 0 `+this.data.handleZIndex+`" segments="6"></a-circle>`;
        this.component.el.insertAdjacentHTML('beforeend',handle);
        this.handleEl = this.component.el.lastChild as Entity;

        // Setup rail entity.
        let rail = `<a-plane width="0.15" shader="flat" height="0.05" 
            ui-rounded="borderRadius:0.025" class="`+this.data.intersectableClass+` no-yoga-layout"
            color="`+this.data.railColor+`" segments="6"></a-plane>`;
        this.component.el.insertAdjacentHTML('beforeend',rail);
        this.railEl = this.component.el.lastChild as Entity;
        // Wait for the rounded edge on the rail to load to clone the geometry for the
        // selected progress bar part of the rail
        this.railEl.addEventListener('rounded-loaded',()=>{
            this.getRailObject(this.railEl.object3D);
            this.setDisabled();
            this.click();
        });
        (this.component.el as any).getValue = this.getValue.bind(this);
        this.clickHandler = (e: MouseEvent)=>{
            this.data.value = !this.data.value;
            this.click();
            // Prevent default behaviour of event
            if((e.detail as any).preventDefault){
                (e.detail as any).preventDefault();
            }
        };
    }

    updateSchema(){
        if(this.data){
            if(this.data.disabled){
                if(this.data.value){
                    this.data.value=false;
                    this.click();
                }
            }else{
                this.click();
            }
            this.setDisabled();
        }
    }
    getValue(){
        return this.data.value;
    }
    setDisabled(){
        // Add / Remove click handlers based on disabled state.
        if(this.data.disabled){
            this.handleEl.removeEventListener('mousedown',this.clickHandler);
            this.handleEl.setAttribute('color',this.data.handleDisabledColor);
        }else{
            this.handleEl.addEventListener('mousedown',this.clickHandler);
            this.handleEl.setAttribute('color',this.data.handleColor);
        }
    }
    click(){
        // Emit the current selected value
        this.component.el.emit('ui-switch-changed',this.data.value);
        // Animate the switch handle and the progress bar.
        this.tweenHandle();
        this.tweenProgress();
    }
    getRailObject(object: Object3D){
        // Get the rounded shape geomtery.
        object.traverse(child=>{
            if((child as Mesh).geometry&&(child as Mesh).geometry.type==="ShapeBufferGeometry"){
                this.progress = new Mesh((child as Mesh).geometry.clone(),new MeshBasicMaterial({color:this.data.progressColor}));
                this.progress.position.set(-0.075,0,0.001);
                this.progress.scale.set(0.00001,1,1);
                this.component.el.object3D.add(this.progress);
            }
        });
    }
    tweenProgress(){
        if(this.progress){
            new TWEEN.Tween(this.progress.position)
                .to(new Vector3(this.data.value?0:-0.075,0,0.001), this.data.switchDuration)
                .easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(this.progress.scale)
                .to(new Vector3(this.data.value?1:0.00001,1,1), this.data.switchDuration)
                .easing(TWEEN.Easing.Exponential.Out).start();
        }
    }
    tweenHandle(){
        if(this.handleEl){
            // Start changes
            this.ui.isChanging(this.component.el.sceneEl,this.component.el.object3D.uuid);
            new TWEEN.Tween(this.handleEl.object3D.position)
                .to(new Vector3(this.data.value?0.05:-0.05,0,this.data.handleZIndex), this.data.switchDuration)
                .onComplete(()=>{
                    // Stop changes
                    this.ui.stoppedChanging(this.component.el.object3D.uuid);
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        }
    }
}