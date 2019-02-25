import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {
    Camera,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PerspectiveCamera,
    Raycaster,
    SphereGeometry,
    WebGLRenderTarget
} from "three";
import {UiElement} from "./UiElement";

export class UI extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui",
        /* Schema */ {
            uiPanel: {type: 'selector'},
            lookControlsEl: {type: 'selector'},
            lookControlsComponent:{default:'look-controls'},
            panelPosition:{type:'vec3',default:{x:0,y:1.6,z:-1}},
            panelSize:{type:'vec2',default:{x:6,y:3}},
            panelDepth:{type:'number',default:0.03},
            panelColor:{default:'#ffffff'},
            panelAlpha:{type:'number',default:1},
            renderResolution:{type:'vec2',default:{x:2048,y:1024}},
            debugRaycaster:{type:'boolean',default: false},
            fps:{type:'number',default:45},
            intersectableClass:{default:'intersectable'},
            debug:{type:'boolean',default:false},
            initDelay:{type:'int',default:500},
        },
        /* Multiple */ false,
        /* Receive ticks */ true,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new UI(component, entity, data));

    meshEl: Entity = undefined as any as Entity;
    backdrop: Entity = undefined as any as Entity;
    lookControlsEl: Entity = undefined as any as Entity;
    camera: Camera = undefined as any as Camera;
    renderTarget: WebGLRenderTarget = undefined as any as WebGLRenderTarget;
    stoppedRendering = false;
    isRendering = false;
    raycaster: Raycaster = undefined as any as Raycaster;
    helper: Mesh = undefined as any as Mesh;
    lastRenderTime = 0;
    isFrozen = false;
    isReady = false;
    lastMouseMoveTime = 0;

    isAnimatingBackground = false;
    click = e => {}
    mousedown = e => {}
    mouseup = e => {}
    mousewheel = e => {}
    mousemove = e => {}
    lastMoveEvent: Event = undefined as any as Event;
    prevIntersectionEls: Array<Entity> = undefined as any as Array<Entity>;

    renderTween: TWEEN.Tween = undefined as any as TWEEN.Tween;

    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.setupBackDrop();
        if(!this.data.uiPanel){
            this.meshEl = this.setupUIPanel();
        }else{
            this.meshEl = this.data.uiPanel;
        }
        // Remove this object from the scene to be rendered separately.
        this.component.el.object3D.parent!!.remove(this.component.el.object3D);
        // Setup fixed camera nd render target.
        this.camera = new OrthographicCamera( -1.5, 1.5, 0.75, -0.75, -2, 2);
        // Setup render target
        this.renderTarget = new WebGLRenderTarget(this.data.renderResolution.x,this.data.renderResolution.y);

        // Listen for change events to enable rendering.
        this.stoppedRendering = false;
        this.isRendering = true;
        // Listen for change events to enable/disable rendering
        this.component.el.sceneEl!!.addEventListener('ui-changing',()=>{
            //console.log(JSON.stringify(new Date()),'ui-changing');
            this.stoppedRendering = false;
            this.isRendering = true;
        });
        this.component.el.sceneEl!!.addEventListener('ui-changing-stopped',()=>{
            //console.log(JSON.stringify(new Date()),'ui-changing-stopped');
            this.isRendering = false;
        });
        // Setup raycaster for relaying mouse/keyboard events
        this.raycaster = new Raycaster();
        this.helper = new Mesh(new SphereGeometry(0.01),new MeshBasicMaterial({color:'#ff0000'}));
        // Add cursor helper to object
        if(this.data.debugRaycaster)this.component.el.object3D.add(this.helper);
        // Set last render time
        this.lastRenderTime = 0;
        this.isFrozen = false;

        // Expose methods to the element to pause/play the renderer.
        (this.component.el as any).pauseRender = this.pauseRender.bind(this);
        (this.component.el as any).playRender = this.playRender.bind(this);
        this.isReady = false;
        setTimeout(()=>{
            this.isReady = true;
            this.ui.isChanging(this.component.el.sceneEl,this.component.el.object3D.uuid);
            setTimeout(()=>{
                this.ui.stoppedChanging(this.component.el.object3D.uuid);
            },250);
        },this.data.initDelay);
    }

    meshTextureSet = false;
    
    tick(time: number, timeDelta: number): void {
        if (!this.meshTextureSet) {
            // Set the texture to the ui panel mesh.
            ((this.meshEl.getObject3D('mesh') as Mesh).material as any).map = this.renderTarget.texture;
            ((this.meshEl.getObject3D('mesh') as Mesh).material as any).transparent = true;
            // emit ready event for anythng wanting to use this texture.
            this.meshEl.emit('texture-ready',this.renderTarget.texture);
            this.meshTextureSet = true;
        }
        if(this.isFrozen||this.stoppedRendering||!this.isReady)return;
        if(time-this.lastRenderTime<(1000/this.data.fps)&&this.isRendering)return;
        this.component.el.object3D.traverse((child: any)=>{
            child.updateMatrixWorld();
        });
        let renderer = this.component.el.sceneEl!!.renderer;
        let vrModeEnabled = renderer.vr.enabled;
        renderer.vr.enabled = false;
        let clearAlpha = renderer.getClearAlpha();
        let clearColor = renderer.getClearColor();

        renderer.setClearColor( this.data.panelColor, this.data.panelAlpha);
        (renderer as any).render(this.component.el.object3D,this.camera,this.renderTarget);

        renderer.setClearColor(clearColor);
        renderer.setClearAlpha(clearAlpha);
        renderer.vr.enabled = vrModeEnabled;
        this.lastRenderTime = time;
        if(!this.isRendering){
            this.stoppedRendering = true;
        }
    }

    pause(): void {
        this.meshEl.removeEventListener('mousedown',this.mousedown);
        this.meshEl.removeEventListener('mouseup',this.mouseup);
        this.meshEl.removeEventListener('click',this.click);
        this.meshEl.removeEventListener('ui-mousemove',this.mousemove);
        this.meshEl.removeEventListener('ui-mousewheel',this.mousewheel);
    }

    play(): void {
        this.lastMouseMoveTime = 0;
        // Register event listeners
        // Mousedown and mouseup do not have the correct intersection point. Use last mouse move event if available instead.
        // TODO: raise issue with aframe / submit PR;
        this.click = (e: MouseEvent)=>this.mouseEvent('click',this.lastMoveEvent||e);
        this.mousedown = (e: MouseEvent)=>this.mouseEvent('mousedown',this.lastMoveEvent||e);
        this.mouseup = (e: MouseEvent)=>this.mouseEvent('mouseup',this.lastMoveEvent||e);
        this.mousewheel = (e: MouseEvent)=>this.mouseEvent('ui-mousewheel',(e.detail as any).evt);
        this.mousemove = (e: MouseEvent)=>{
            // Save mousemove event for mousedown/mouseup events.
            this.lastMoveEvent = e;
            this.mouseEvent('ui-mousemove',e);
        };
        this.meshEl.addEventListener('mousedown',this.mousedown);
        this.meshEl.addEventListener('mouseup',this.mouseup);
        this.meshEl.addEventListener('click',this.click);
        this.meshEl.addEventListener('ui-mousemove',this.mousemove);
        this.meshEl.addEventListener('ui-mousewheel',this.mousewheel);
    }

    pauseRender(time: number){
        return this.playRender(time,true)
    }
    playRender(time: number,isPaused: boolean){
        let _this = this;
        return new Promise(resolve=>{
            if(_this.isFrozen===isPaused||_this.isAnimatingBackground)return resolve();
            _this.isAnimatingBackground = true;
            if(!_this.isFrozen)this.backdrop.setAttribute('scale','1 1 1');
            let fromScale = _this.isFrozen?0.9:0.000001;
            let toScale = _this.isFrozen?0.000001:0.9;
            let duration = _this.isFrozen?time||350:time||500;
            if(_this.isFrozen){
                _this.isFrozen = isPaused;
                _this.play();
            }
            this.ui.isChanging(_this.component.el.sceneEl,(_this.backdrop as any).uuid);
            if(_this.renderTween)_this.renderTween.stop();
            _this.renderTween = new TWEEN.Tween({x:fromScale})
                .to({x:toScale}, duration)
                .onUpdate(function(){
                    _this.backdrop.setAttribute('opacity',this.x);
                })
                .onComplete(()=>{
                    _this.isFrozen = isPaused;
                    _this.isAnimatingBackground = false;
                    if(_this.isFrozen){
                        _this.pause();
                    }else{
                        this.backdrop.setAttribute('scale','0.000001 0.000001 0.000001');
                    }
                    // Stop changes
                    this.ui.stoppedChanging((this.backdrop as any).uuid);
                    resolve();
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        });
    }
    setupBackDrop(){
        this.backdrop = document.createElement('a-plane');
        this.backdrop.setAttribute('transparent',true);
        this.backdrop.setAttribute('opacity',0.000001);
        this.backdrop.setAttribute('color','#000');
        this.backdrop.setAttribute('shader','flat');
        this.backdrop.setAttribute('position',{x:0,y:0,z:-0.2});
        this.backdrop.setAttribute('width',1);
        this.backdrop.setAttribute('height',1);
        this.backdrop.setAttribute('scale','0.000001 0.000001 0.000001');
        this.component.el.appendChild(this.backdrop);
    }
    


    setupUIPanel(){
        let uiPanel = document.createElement('a-plane');
        uiPanel.setAttribute('side', 'double');
        //uiPanel.setAttribute('color', '#2a2a2e');
        uiPanel.setAttribute('color', this.data.panelColor);
        uiPanel.setAttribute('shader', 'flat');
        uiPanel.setAttribute('class', 'intersect');
        uiPanel.setAttribute('position',this.data.panelPosition);
        uiPanel.setAttribute('width',this.data.panelSize.x);
        uiPanel.setAttribute('height',this.data.panelSize.y);
        if (this.data.panelDepth) {
            uiPanel.setAttribute('ui-curved-plane','depth: ' + this.data.panelDepth + ';');
        }
        this.component.el.parentElement!!.appendChild(uiPanel);
        return uiPanel;
    }

    mouseEvent(type: string, e: any){
        let mouse = {x:0,y:0};
        if(e.detail&&e.detail.intersection){
            let localPoint = this.meshEl.object3D.worldToLocal(e.detail.intersection.point.clone());

            mouse = {
                x:localPoint.x/this.meshEl.getAttribute('width')*2,
                y:localPoint.y/this.meshEl.getAttribute('height')*2
            };
        }
        if(type==='ui-mousewheel'&&(e.detail||(e.deltaX||e.deltaY))){
            (mouse as any).deltaX = e.detail?e.detail.deltaX:e.deltaX;
            (mouse as any).deltaY = e.detail?e.detail.deltaY:e.deltaY;
        }
        if(type==='mousedown'&&this.lookControlsEl&&this.lookControlsEl.components['look-controls']){
            this.lookControlsEl.components[this.data.lookControlsComponent].pause();
        }
        if(type==='mouseup'&&this.lookControlsEl&&this.lookControlsEl.components['look-controls']){
            this.lookControlsEl.components[this.data.lookControlsComponent].play();
        }
        // if(type==="mousedown"){
        //     console.log("mousedown on menu/editor",mouse);
        // }
        this.raycastIntersections(e,mouse,type);
    }

    raycastIntersections(e: MouseEvent,mouse: any,type: string) {
        if(!this.camera||this.isFrozen||this.isAnimatingBackground)return;
        //console.log(mouse);
        this.raycaster.setFromCamera( mouse, this.camera );
        // this.helper.setDirection(this.raycaster.ray.direction);
        let intersections = this.raycaster.intersectObjects( this.component.el.object3D.children, true );
        this.prevIntersectionEls = this.prevIntersectionEls||[];
        let intersectionEls = new Array<Entity>();
        if(intersections.length&&this.data.debugRaycaster){
            let intersectionPoint = intersections[0].point;
            if(intersections[0].object===this.helper&&intersections.length>1){
                intersectionPoint = intersections[1].point;
            }
            this.helper.position.copy(intersectionPoint);
            this.helper.position.x-=0.03;
        }
        let defaultPrevented = false;
        for(let i = 0;i < intersections.length; i++){
            let intersection = intersections[i];
            // Only emit events on objecst with an element attached
            if((intersection.object as any).el &&(intersection.object as any).el.classList.contains(this.data.intersectableClass)) {
                let currentEvent = {intersection:intersection,evt:e,preventDefault:()=>{defaultPrevented=true}};
                // If this is the first time weve seen this element then emit the mouseenter event.
                if(this.prevIntersectionEls.indexOf((intersection.object as any).el)===-1&&!defaultPrevented) {
                    (intersection.object as any).el.emit('mouseenter',currentEvent);
                }
                // Emit the mouse event received
                if(!defaultPrevented||type==='ui-mousewheel'){
                    (intersection.object as any).el.emit(type,currentEvent);
                }
                // Store the intersection on the element.
                (intersection.object as any).el.intersection = intersection;
                // Add the current el to the list to check against previous intersection els.
                intersectionEls.push((intersection.object as any).el);
            }
        }
        // Find any intersections that have disappeared to emit the mouse leave event.
        for(let i = 0;i < this.prevIntersectionEls.length; i++) {
            let intersectionEl = this.prevIntersectionEls[i];
            if(intersectionEls.indexOf(intersectionEl)===-1) {
                intersectionEl.emit('mouseleave',{intersection: (intersectionEl as any).intersection});
            }
        }
        // Store the current intersected elements for the next iteration.
        this.prevIntersectionEls = intersectionEls;
    }


}