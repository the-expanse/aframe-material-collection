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
        curveSegments:{type: 'int', default: 1},
        borderWidth:{type: 'int', default: 3},
        color:{default:'#aaa'}
    },
    init() {
        let mesh = this.el.getObject3D('mesh');
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
        } )( roundedRectShape, -mesh.geometry.metadata.parameters.width/2, -mesh.geometry.metadata.parameters.height/2, mesh.geometry.metadata.parameters.width, mesh.geometry.metadata.parameters.height, this.data.borderRadius );

        roundedRectShape.autoClose = true;
        // Update the geometry.


        //new Line(new BufferGeometry().setFromPoints( roundedRectShape.getPoints() )
        // mesh.geometry = ;
        // mesh.material = ;
        //new BufferGeometry().setFromPoints( roundedRectShape.getPoints() )
        this.el.setObject3D('mesh',new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(roundedRectShape.getPoints()),
                new THREE.LineBasicMaterial( { color: this.data.color, linewidth: 10 } )
            )
        );

    }
});