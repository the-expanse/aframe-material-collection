import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {MaterialUiSystem} from "../systems/MaterialUiSystem";

export class UiElement extends AbstractComponentController {

    ui: MaterialUiSystem = undefined as any as MaterialUiSystem;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);

        this.ui = this.getSystemController("material-ui")
        if (!this.ui) {
            throw new Error("Material UI system not registered.");
        }

    }

    init(): void {
    }

    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {}

}