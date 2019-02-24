import {Scene, System} from "aframe";
import {AbstractSystemController} from "aframe-typescript-boilerplate/built/system/AbstractSystemController";
import {SystemControllerDefinition} from "aframe-typescript-boilerplate/built";


export class MaterialUiSystem extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "material-ui",
        {},
        (system: System, scene: Scene, data: any) =>
            new MaterialUiSystem(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
        console.log("material ui system init.")
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }

}