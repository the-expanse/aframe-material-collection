import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {UiElement} from "./UiElement";

export class NumberComponent extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-number",
        /* Schema */ {
            value: {type: 'number', default: 0},
            increment: {type: 'number', default: 0.001},
            width:{type: 'number',default: 0.65},
            height:{type: 'number',default: 0.2},
            intersectableClass: {default: 'intersectable'},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new NumberComponent(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        let numberText = document.createElement('a-plane');
        numberText.setAttribute('width',"0.55");
        numberText.setAttribute('height',"0.2");
        numberText.className = 'no-yoga-layout';
        numberText.setAttribute('color',"#212121");
        numberText.setAttribute('text',"value:"+this.data.value.toFixed(3)+";color:#212121;wrapCount:12;align:center");
        numberText.setAttribute('ui-border',"borderRadius:0.1;borderWidth:0.008");

        let upButton = document.createElement('a-ui-fab-button-small');
        upButton.setAttribute('scale','0.75 0.75 0.75');
        upButton.className = 'no-yoga-layout '+this.data.intersectableClass;
        upButton.setAttribute('color','#009688');
        upButton.setAttribute('position','0.33 0.055 0.001');
        upButton.setAttribute('color','#009688');
        upButton.setAttribute('icon-color','#fff');
        upButton.setAttribute('ripple-color','#009688');
        upButton.setAttribute('src','https://cdn.theexpanse.app/images/icons/baseline_keyboard_arrow_up_white_18dp.png');
        upButton.addEventListener('click',()=>{
            this.data.value+=this.data.increment;
            numberText.setAttribute('text',"value:"+(this.data.value).toFixed(3)+";color:#212121;wrapCount:12;align:center");
            this.component.el.emit('change',this.data.value);
        });
        let downButton = document.createElement('a-ui-fab-button-small');
        downButton.setAttribute('scale','0.75 0.75 0.75');
        downButton.className = 'no-yoga-layout '+this.data.intersectableClass;
        downButton.setAttribute('color','#009688');
        downButton.setAttribute('position','0.33 -0.055 0.001');
        downButton.setAttribute('color','#009688');
        downButton.setAttribute('icon-color','#fff');
        downButton.setAttribute('ripple-color','#009688');
        downButton.setAttribute('src','https://cdn.theexpanse.app/images/icons/down_arrow.png');
        downButton.addEventListener('click',()=>{
            this.data.value-=this.data.increment;
            numberText.setAttribute('text',"value:"+(this.data.value).toFixed(3)+";color:#212121;wrapCount:12;align:center");
            this.component.el.emit('change',this.data.value);
        });
        numberText.appendChild(upButton);
        numberText.appendChild(downButton);
        this.component.el.appendChild(numberText);
    }

}