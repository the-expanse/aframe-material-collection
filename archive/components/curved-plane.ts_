import {registerComponent} from "aframe";
import {CubicBezierCurve3, Mesh, PlaneGeometry, Vector3} from "three";

/**
 * A curved-plane component to curve a plane primitive.
 * @namespace aframe-material-collection
 * @component ui-curved-plane
 * @author Shane Harris
 */

export = registerComponent('ui-curved-plane', {
    schema: {
        depth:{type:'number',default:0.03}
    },
    init(){
        let mesh = this.el.getObject3D('mesh') as Mesh;
        let width = this.el.getAttribute('width');
        let height = this.el.getAttribute('height');
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
});