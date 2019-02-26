import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Mesh, Shape, ShapeBufferGeometry} from "three";
import {UiElement} from "./UiElement";

export class Rounded extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-rounded",
        /* Schema */ {
            borderRadius: {type: 'number', default: 0.01},
            curveSegments:{type: 'int', default: 1},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Rounded(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        let mesh = this.component.el.getObject3D('mesh') as Mesh;
        let roundedRectShape = new Shape();
        // Draw the Rounded rectangle shape centered in the object - from three.js shapes example.
        ( function roundedRect( ctx, x, y, width, height, radius ) {
            ctx.moveTo( x, y + radius );
            ctx.lineTo( x, y + height - radius );
            ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
            ctx.lineTo( x + width - radius, y + height );
            ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
            ctx.lineTo( x + width, y + radius );
            ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
            ctx.lineTo( x + radius, y );
            ctx.quadraticCurveTo( x, y, x, y + radius );
        } )( roundedRectShape, -(mesh.geometry as any).metadata.parameters.width/2, -(mesh.geometry as any).metadata.parameters.height/2, (mesh.geometry as any).metadata.parameters.width, (mesh.geometry as any).metadata.parameters.height, this.data.borderRadius );
        // Update the geometry.
        mesh.geometry = new ShapeBufferGeometry(roundedRectShape,this.data.curveSegments);
        // Emit rounded-loaded event once the geometry has been updated.
        this.component.el.emit('rounded-loaded', null, false);
    }

}