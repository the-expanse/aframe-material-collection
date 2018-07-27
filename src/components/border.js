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
        borderWidth:{type: 'int', default: 0.01},
    },
    init() {
        this.el.addEventListener('loaded',()=>{
            // Traverse the THREE object to get the plane geometry.
            this.el.object3D.traverse(child=>{
                if(child.geometry&&child.geometry.metadata&&child.geometry.metadata.type==="PlaneGeometry"){
                    let roundedRectShape = new THREE.Shape();
                    let _this = this;
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

                        let hole = new THREE.Path();

                        // hole.moveTo( x-_this.data.borderWidth, y + radius - _this.data.borderWidth );
                        // hole.lineTo( x-_this.data.borderWidth, y + height - radius - _this.data.borderWidth );
                        // hole.quadraticCurveTo( x-_this.data.borderWidth, y + height-_this.data.borderWidth, x + radius-_this.data.borderWidth, y + height-_this.data.borderWidth );
                        // hole.lineTo( x + width - radius-_this.data.borderWidth, y + height-_this.data.borderWidth );
                        // hole.quadraticCurveTo( x + width-_this.data.borderWidth, y + height-_this.data.borderWidth, x + width-_this.data.borderWidth, y + height - radius-_this.data.borderWidth );
                        // hole.lineTo( x + width-_this.data.borderWidth, y + radius-_this.data.borderWidth );
                        // hole.quadraticCurveTo( x + width-_this.data.borderWidth, y-_this.data.borderWidth, x + width - radius-_this.data.borderWidth, y-_this.data.borderWidth );
                        // hole.lineTo( x + radius-_this.data.borderWidth, y-_this.data.borderWidth );
                        // hole.quadraticCurveTo( x-_this.data.borderWidth, y-_this.data.borderWidth, x-_this.data.borderWidth, y + radius-_this.data.borderWidth );
                        // hole.moveTo(x-width*0.4, y+height*0.4);
                        // hole.lineTo(x-width*0.4, y-height*0.4);
                        // hole.lineTo(x+width*0.4, y+height*0.4);
                        // hole.lineTo(x+width*0.4, y-height*0.4);
                        // ctx.holes.push(hole);

                    } )( roundedRectShape, -child.geometry.metadata.parameters.width/2, -child.geometry.metadata.parameters.height/2, child.geometry.metadata.parameters.width, child.geometry.metadata.parameters.height, this.data.borderRadius );
                    // Update the geometry.
                    child.geometry = new THREE.ShapeGeometry(roundedRectShape,this.data.curveSegments);
                    // Emit rounded-loaded event once the geometry has been updated.
                    this.el.emit('rounded-loaded', null, false);
                }
            });
        });
    }
});