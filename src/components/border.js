/* global AFRAME,THREE */
/**
 * Rounded borders Component for aframe-material-collection. Expects an a-plane entity.
 * @namespace aframe-material-collection
 * @component ui-border
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-border', {
    schema: {
        borderRadius: {type: 'number', default: 0.01},
        curveSegments:{type: 'int', default: 5},
        borderWidth:{type: 'number', default: 0.008},
        color:{default:"#5f5f5f"},
        numberOfPoints:{type:'int',default:180}
    },
    init() {
        let mesh = this.el.getObject3D('mesh');
        let roundedRectShape = new THREE.Shape();
        this.roundedRect(roundedRectShape,
            mesh.geometry.metadata.parameters.width,
            mesh.geometry.metadata.parameters.height,
            this.data.borderRadius);
        this.roundedRect(roundedRectShape,
            mesh.geometry.metadata.parameters.width-this.data.borderWidth*2,
            mesh.geometry.metadata.parameters.height-this.data.borderWidth*2,
            this.data.borderRadius,true);

        this.el.setObject3D('mesh',new THREE.Mesh( new THREE.ShapeGeometry(roundedRectShape,this.data.curveSegments), new THREE.PointsMaterial( { color: this.data.color, size: this.data.borderWidth } ) ));
    /*
    let roundedRectShape = new THREE.Shape();
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
				} )( roundedRectShape, -1/2, -1/2, 1, 1, 0.1 );

				( function roundedRect( ctx, x, y, width, height, radius ) {


					var hole = new THREE.Path()

					hole.moveTo( x, y + radius );
					hole.lineTo( x, y + height - radius );
					hole.quadraticCurveTo( x, y + height, x + radius, y + height );
					hole.lineTo( x + width - radius, y + height );
					hole.quadraticCurveTo( x + width, y + height, x + width, y + height - radius );
					hole.lineTo( x + width, y + radius );
					hole.quadraticCurveTo( x + width, y, x + width - radius, y );
					hole.lineTo( x + radius, y );
					hole.quadraticCurveTo( x, y, x, y + radius );
					ctx.holes.push(hole);
				} )( roundedRectShape, -0.9/2, -0.9/2, 0.9, 0.9, 0.09 );
				// Update the geometry.
				geometry = new THREE.ShapeGeometry(roundedRectShape,3);
     */


    },
    roundedRect( ctx, width, height, radius, isHole) {
        let x = -width/2, y = -height/2;
        // Draw the Rounded rectangle shape centered in the object - from three.js shapes example.
        let shapeCtx;
        if(isHole){
            shapeCtx = ctx;
            ctx = new THREE.Path()
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
            shapeCtx.holes.push(ctx);
        }
    }
});