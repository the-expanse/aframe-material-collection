import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {BufferGeometry, CircleGeometry, Geometry, Material, Mesh, MeshBasicMaterial, Plane, Vector3} from "three";
import {UiElement} from "./UiElement";

export class Ripple extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-ripple",
        /* Schema */ {
            color: {default: '#fff'},
            duration:{type:'int',default:1000},
            fadeDuration:{type:'int',default:750},
            fadeDelay:{type:'int',default:250},
            clampToSquare:{type:'boolean',default:false},
            size:{type:'vec2',default:{x:1,y:1}},
            zIndex:{type:'number',default:-0.001},
            segments:{type:'int',default:6}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new Ripple(component, entity, data));

    rippleGeometry = undefined as any as CircleGeometry;
    ripple = undefined as any as Mesh;
    content_clips = new Array<Plane>();
    isRippling = false;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        // Setup circle geometry for ripple effect
        this.rippleGeometry = new CircleGeometry(Math.max(this.data.size.x,this.data.size.y),this.data.segments);
        this.ripple = new Mesh(this.rippleGeometry.clone(),new MeshBasicMaterial({color:this.data.color,transparent:true, opacity:0.4,alphaTest:0.1}));
        this.ripple.scale.set(0.00001,0.00001,0.00001);
        this.component.el.object3D.add(this.ripple);
        this.component.el.addEventListener('mousedown',this.click.bind(this));
        this.ripple.position.set(0,0,this.data.zIndex);
        // Set clipping planes if clamping to square
        if(this.data.clampToSquare){

            this.content_clips = [
                new Plane( new Vector3( 0, 1, 0 ), (this.data.size.y/2) ),
                new Plane( new Vector3( 0, -1, 0 ), (this.data.size.y/2) ),
                new Plane( new Vector3( -1, 0, 0 ), (this.data.size.x/2) ),
                new Plane( new Vector3( 1, 0, 0 ), (this.data.size.x/2) )
            ];
        }
    }
    
    click(e: Event){
        if(this.isRippling){
            // Throttle clicks.
            return e.preventDefault();
        }
        this.isRippling = true;
        // Set clipping planes if clamping to square
        if(this.data.clampToSquare){
            this.setRippleClips();
        }
        // Animate the size of the circle ripple from the center of the entity.
        this.tweenSize(this.ripple.geometry);
        // Fade the circle out as it ripples.
        this.tweenOpacity(this.ripple.material as Material);
    }
    
    setRippleClips(){
        // update content clips world positions from this current element.
        this.content_clips[0].set(new Vector3( 0, 1, 0 ), (this.data.size.y/2));
        this.content_clips[1].set(new Vector3( 0, -1, 0 ), (this.data.size.y/2));
        this.content_clips[2].set(new Vector3( -1, 0, 0 ), (this.data.size.x/2));
        this.content_clips[3].set(new Vector3( 1, 0, 0 ), (this.data.size.x/2));
        //this.component.el.sceneEl.object3D.updateMatrixWorld();
        this.content_clips[0].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[1].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[2].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[3].applyMatrix4(this.component.el.object3D.matrixWorld);
        (this.ripple.material as any).clippingPlanes = (this.component.el as any)._content_clips?(this.component.el as any)._content_clips.concat(this.content_clips):this.content_clips;
        (this.ripple.material as any).clipShadows = true;
        (this.ripple.material as any).needsUpdate = true;
    }
    
    tweenSize(geometry: Geometry | BufferGeometry){
        let _this = this;
        // Start changes
        this.ui.isChanging(this.component.el.sceneEl,_this.ripple.uuid);
        new TWEEN.Tween({x:0.00001})
            .to({ x: 1}, this.data.duration)
            .onUpdate(function(){
                _this.ripple.scale.set(this.x,this.x,this.x);
            })
            .onComplete(()=>{
                _this.ripple.scale.set(0.00001,0.00001,0.00001);
                // Reset throttle flag.
                this.isRippling = false;
                // Stop changes
                this.ui.stoppedChanging(_this.ripple.uuid);
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
    
    tweenOpacity(material: Material){
        new TWEEN.Tween({x:0.4})
            .to({ x: 0}, this.data.fadeDuration)
            .delay(this.data.fadeDelay)
            .onUpdate(function(){
                material.opacity = this.x;
            })
            .onComplete(()=>{
                material.opacity = 0.4;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
}