import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class DoubleClick extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-double-click",
        /* Schema */ {
            timeout:{type:'int',default:200}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new DoubleClick(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        let last_click = 0;
        // Add click event for listening for two clicks within the specified timespan.
        this.component.el.addEventListener('mousedown',(e) =>{
            let now = new Date().getTime();
            if(now-last_click<this.data.timeout){
                this.component.el.emit('dblclick',e);
                // Reset last click
                last_click = 0;
                e.preventDefault();
            }
            last_click = now;
        });
    }

}