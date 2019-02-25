import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class Checkbox extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-checkbox",
        /* Schema */ {
            value: {type:'boolean',default: false},
            selectedColor: {default: '#009688'},
            unselectedColor: {default: '#7f7f7f'},
            disabledColor: {default: '#afafaf'},
            indeterminate: {type:'boolean',default: false},
            disabled:{type:'boolean',default: false},
            intersectableClass: {default: 'intersectable'},
            width:{type:'number',default: 0.15},
            height:{type:'number',default: 0.15},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Checkbox(component, entity, data));

    width= 0;
    height= 0;
    container= undefined as any as Entity;
    topLine= undefined as any as Entity;
    bottomLine= undefined as any as Entity;
    leftLine= undefined as any as Entity;
    rightLine= undefined as any as Entity;
    clickHandler= () => {};

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.width = 0.15;
        this.height = 0.15;
        this.container = document.createElement('a-entity');
        this.container.setAttribute('class','no-yoga-layout');
        this.component.el.appendChild(this.container);
        this.setupLines();
        // Add backing element to make the whole object clickable.
        let backing = document.createElement('a-plane');
        backing.setAttribute('width',0.105);
        backing.setAttribute('height',0.105);
        backing.setAttribute('position','0 0 -0.002');
        backing.setAttribute('shader','flat');
        backing.setAttribute('class',this.data.intersectableClass+' no-yoga-layout');
        backing.setAttribute('opacity',0.0001);
        backing.setAttribute('transparent',true);
        this.component.el.appendChild(backing);
        this.clickHandler = ()=>{
            this.data.value = !this.data.value;
            this.click();
        };
        // Setup initial state
        this.setSelected();
        this.setDisabled();
        this.setTransform(1);
    }

    updateSchema(){
        if(this.data){
            this.setDisabled();
            if(this.data.disabled){
                if(this.data.value){
                    this.data.value=false;
                    this.data.indeterminate=false;
                    this.click();
                }
            }else{
                this.click();
            }
        }
    };

    setTransform(x: number){
        // Adjust position and rotation based on the interpolated value x between 0 and 1.
        // Used to offset the checkbox when in a checked state
        if(this.data.value){
            this.container.setAttribute('rotation',{x:0,y:0,z:-45*x});
            this.container.setAttribute('position',{x:-0.025*x,y:0.05*x,z:0});
        }else{
            this.container.setAttribute('rotation',{x:0,y:0,z:-45+(45*x)});
            this.container.setAttribute('position',{x:0.025-(0.025*x),y:0.05-(0.05*x),z:0});
        }
    };
    click(){
        // Reset indeterminate state on click
        this.data.indeterminate = false;
        // Hide / Show left and top lines for checked state, or right line aswell for intermediate state.
        this.setSelected();
        // run animation
        this.animateSelected()
    };
    animateSelected(){
        let _this = this;
        // Start changes
        this.ui.isChanging(this.component.el.sceneEl,this.component.el.object3D.uuid);
        new TWEEN.Tween({x:0})
            .to({ x: 1}, 200)
            .onUpdate(function () {
                _this.setTransform(this.x);
            })
            .onComplete(function(){
                // Stop changes
                _this.ui.stoppedChanging(_this.component.el.object3D.uuid);
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    };
    setSelected(){
        // Hide / Show lines that make up checkbox based on the current state.
        if(this.data.value){
            this.topLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.leftLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('position','0.025 -0.05 0');
            this.rightLine.setAttribute('position','0.05 0 0');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('height',0.05);
            this.bottomLine.setAttribute('color',this.data.selectedColor);
            this.rightLine.setAttribute('color',this.data.selectedColor);
        }else if(this.data.indeterminate){
            this.topLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.leftLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('position','0 0 0');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('height',0.1);
            this.bottomLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.unselectedColor);
        }else{
            this.topLine.setAttribute('scale','1 1 1');
            this.leftLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('height',0.1);
            this.leftLine.setAttribute('position','-0.05 0 0');
            this.rightLine.setAttribute('position','0.05 0 0');
            this.topLine.setAttribute('position','0 0.05 0');
            this.bottomLine.setAttribute('position','0 -0.05 0');
            this.topLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.unselectedColor);
        }
    };
    setupLines(){
        // Add four lines to make a square wireframe
        this.leftLine = this.line(true);
        this.rightLine = this.line(true);
        this.topLine = this.line(true);
        this.bottomLine = this.line(true);
        this.container.appendChild(this.topLine);
        this.container.appendChild(this.leftLine);
        this.container.appendChild(this.bottomLine);
        this.container.appendChild(this.rightLine);
    };
    setDisabled(){
        // Check and set the disabled state of the checkbox - add / remove click handler.
        if(this.data.disabled){
            this.component.el.removeEventListener('mousedown',this.clickHandler);
            this.topLine.setAttribute('color',this.data.disabledColor);
            this.leftLine.setAttribute('color',this.data.disabledColor);
            this.rightLine.setAttribute('color',this.data.disabledColor);
            this.bottomLine.setAttribute('color',this.data.disabledColor);
        }else{
            this.component.el.addEventListener('mousedown',this.clickHandler);
            this.topLine.setAttribute('color',this.data.unselectedColor);
            this.leftLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.value?this.data.selectedColor:this.data.unselectedColor);
            this.bottomLine.setAttribute('color',this.data.value?this.data.selectedColor:this.data.unselectedColor);
        }
    };
    line(is_vertical: boolean){
        // Create horizontal/vertical line.
        let line = document.createElement('a-plane');
        line.setAttribute('width',is_vertical?0.01:0.105);
        line.setAttribute('height',is_vertical?0.105:0.01);
        line.setAttribute('class','no-yoga-layout');
        line.setAttribute('shader','flat');
        return line;
    }
}