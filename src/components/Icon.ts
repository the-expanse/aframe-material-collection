import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class Icon extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-icon",
        /* Schema */ {
            src: {default: 'icons/send_white_64dp.png'},
            spriteCoords:{type:'vec4'},
            size:{type:'vec2',default:{x:0.1,y:0.1}},
            zIndex:{type:'number',default:0.003},
            color:{default:'#fff'}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Icon(component, entity, data));

    icon: Entity = undefined as any as Entity;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.icon = document.createElement('a-entity');
        this.icon.className = 'no-yoga-layout';
        this.icon.setAttribute('geometry','primitive:plane; width: '+this.data.size.x+'; height: '+this.data.size.y+';skipCache: true;');
        this.icon.setAttribute('material','shader: flat; color:'+this.data.color+';alpha-test:0.4; transparent:true;src:'+this.data.src);
        if(this.data.spriteCoords){
            this.icon.setAttribute('sprite-sheet','coords:'+this.data.spriteCoords.x+' '+this.data.spriteCoords.y+' '+this.data.spriteCoords.z+' '+this.data.spriteCoords.w+';shape:square');
        }
        this.icon.setAttribute('position',"0 0 "+this.data.zIndex);
        this.component.el.appendChild(this.icon);
    }

}