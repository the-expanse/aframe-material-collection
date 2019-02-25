import {Component, Entity} from "aframe";
import {AbstractComponentController} from "aframe-typescript-boilerplate/built/component/AbstractComponentController";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {CubicBezierCurve3, Mesh, PlaneGeometry, Vector3} from "three";
import {UiElement} from "./UiElement";

export class CurvedPlane extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-curved-plane",
        /* Schema */ {
            depth:{type:'number',default:0.03}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new CurvedPlane(component, entity, data));

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        let mesh = this.component.el.getObject3D('mesh') as Mesh;
        let width = this.component.el.getAttribute('width');
        let height = this.component.el.getAttribute('height');
        let browser_pane = new PlaneGeometry(width, height, 5, 1);
        let curve = new CubicBezierCurve3(
            browser_pane.vertices[0],
            new Vector3(0.375*width, 0, -this.data.depth*width ),
            new Vector3(0.625*width, 0, -this.data.depth*width ),
            browser_pane.vertices[(browser_pane.vertices.length/2) - 1]
        );
        let planePoints = curve.getPoints(Math.abs(browser_pane.vertices.length/2)-1);
        for (let edgeI = 1; edgeI < 3; edgeI++) {
            for (let pointI = 0; pointI < planePoints.length; pointI++) {
                browser_pane.vertices[(edgeI === 2 ? planePoints.length + pointI : pointI)].z = planePoints[pointI].z;
            }
        }
        mesh.geometry = browser_pane;
    }

}