import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";

export class UiComponent extends AbstractComponentController {

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {}

    update(data: any, oldData: any): void {}

    remove(): void {}

    pause(): void {}

    play(): void {}

    tick(time: number, timeDelta: number): void {}

}