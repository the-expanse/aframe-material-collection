/* global AFRAME,TWEEN,THREE */
/**
 * Ripple Component for aframe-material-collection. Add a ripple to an entity with options for controlling
 * clamping the animation and offsetting the ripple z position to place on top or bottom
 * @namespace aframe-material-collection
 * @component ui-ripple
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-ripple',{
    schema:{
        color: {default: '#fff'},
        duration:{type:'int',default:1000},
        fadeDuration:{type:'int',default:750},
        fadeDelay:{type:'int',default:250},
        clampToSquare:{type:'boolean',default:false},
        size:{type:'vec2',default:{x:1,y:1}},
        zIndex:{type:'number',default:-0.001},
        segments:{type:'number',default:6}
    },
    init(){
        // Setup circle geometry for ripple effect
        this.rippleGeometry = new THREE.CircleGeometry(0.001,this.data.segments);
        this.ripple = new THREE.Mesh(this.rippleGeometry.clone(),new THREE.MeshBasicMaterial({color:this.data.color,transparent:true, opacity:0.4}));
        this.el.object3D.add(this.ripple);
        this.el.addEventListener('click',this.click.bind(this));
        this.ripple.position.set(0,0,this.data.zIndex);
    },
    click(e){
        if(this.isRippling){
            // Throttle clicks.
            return e.preventDefault();
        }
        this.isRippling = true;
        // Animate the size of the circle ripple from the center of the entity.
        this.tweenSize(this.ripple.geometry);
        // Fade the circle out as it ripples.
        this.tweenOpacity(this.ripple.material);
    },
    tweenSize(geometry){
        let _this = this;
        new TWEEN.Tween({x:0})
            .to({ x: Math.max(this.data.size.x,this.data.size.y)}, this.data.duration)
            .onUpdate(function(){
                // Update the vertices and clamp if need be to lock to a rectangle shape.
                for ( let i = 0, l = geometry.vertices.length; i < l; i ++ ) {
                    let vertex = geometry.vertices[ i ];
                    vertex.normalize().multiplyScalar( this.x );
                    if(_this.data.clampToSquare){
                        if(vertex.x>_this.data.size.x/2){
                            vertex.x = _this.data.size.x/2;
                        }
                        if(vertex.x<-_this.data.size.x/2){
                            vertex.x = -_this.data.size.x/2;
                        }
                        if(vertex.y>_this.data.size.y/2){
                            vertex.y = _this.data.size.y/2;
                        }
                        if(vertex.y<-_this.data.size.y/2){
                            vertex.y = -_this.data.size.y/2;
                        }
                    }
                }
                geometry.verticesNeedUpdate = true;
            })
            .onComplete(()=>{
                // Reset geometry after ripple
                this.el.object3D.remove(this.ripple);
                this.ripple.geometry = this.rippleGeometry.clone();
                this.el.object3D.add(this.ripple);
                // Reset throttle flag.
                console.log('rippling done');
                this.isRippling = false;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    },
    tweenOpacity(material){
        new TWEEN.Tween({x:0.4})
            .to({ x: 0}, this.data.fadeDuration)
            .delay(this.data.fadeDelay)
            .onUpdate(function(){
                material.opacity = this.x;
            })
            .onComplete(()=>{
                material.opacity = 0.4;
                console.log('fading done');
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
});