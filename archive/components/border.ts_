/**
 * Rounded borders Component for aframe-material-collection. Expects an a-plane entity.
 * @namespace aframe-material-collection
 * @component ui-border
 * @author Shane Harris
 */
import {Mesh, MeshBasicMaterial, Path, Shape, ShapeGeometry} from "three";
import {registerComponent} from "aframe";

export = registerComponent('ui-border', {
    schema: {
        borderRadius: {type: 'number', default: 0.01},
        curveSegments:{type: 'int', default: 5},
        borderWidth:{type: 'number', default: 0.008},
        color:{default:"#5f5f5f"},
        numberOfPoints:{type:'int',default:180}
    },
    init() {
        let mesh = this.el.getObject3D('mesh') as Mesh;
        let metadata = (mesh.geometry as any).metadata;
        let roundedRectShape = new Shape();
        this.roundedRect(roundedRectShape,
            metadata.parameters.width,
            metadata.parameters.height,
            this.data.borderRadius, false);
        this.roundedRect(roundedRectShape,
            metadata.parameters.width-this.data.borderWidth*2,
            metadata.parameters.height-this.data.borderWidth*2,
            this.data.borderRadius,true);

        this.el.setObject3D('mesh',new Mesh( new ShapeGeometry(roundedRectShape,this.data.curveSegments), new MeshBasicMaterial( { color: this.data.color } ) ));
    
    },
    roundedRect( ctx: Path, width: number, height: number, radius: number, isHole: boolean) {
        let x = -width/2, y = -height/2;
        // Draw the Rounded rectangle shape centered in the object - from js shapes example.
        let shapeCtx: Shape;
        if(isHole){
            shapeCtx = ctx as Shape;
            ctx = new Path()
        }
        ctx.moveTo( x, y + radius );
        ctx.lineTo( x, y + height - radius );
        ctx.quadraticCurveTo( x, y + height, x + radius, y + height );
        ctx.lineTo( x + width - radius, y + height );
        ctx.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
        ctx.lineTo( x + width, y + radius );
        ctx.quadraticCurveTo( x + width, y, x + width - radius, y );
        ctx.lineTo( x + radius, y );
        ctx.quadraticCurveTo( x, y, x, y + radius );
        if(isHole){
            shapeCtx!!.holes.push(ctx);
        }
    }
});