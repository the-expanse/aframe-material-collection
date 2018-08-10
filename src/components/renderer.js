/* global AFRAME */
/**
 * A component to render the UI to a flat plane, removing the objects from the scene and rendering them separately to a
 * render target.
 * @namespace aframe-material-collection
 * @component ui-renderer
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-renderer', {
    schema: {
        uiPanel: {type: 'selector'},
        lookControlsEl: {type: 'selector'},
        lookControlsComponent:{default:'look-controls'},
        panelPosition:{type:'vec3',default:{x:0,y:1.6,z:-1}},
        panelSize:{type:'vec2',default:{x:6,y:3}},
        renderResolution:{type:'vec2',default:{x:2048,y:1024}},
        debugRaycaster:{type:'boolean',default: false},
        fps:{type:'number',default:45},
        intersectableClass:{default:'intersectable'}
    },
    init() {
        if(!this.data.uiPanel){
            this.meshEl = this.setupUIPanel();
        }else{
            this.meshEl = this.data.uiPanel;
        }
        // Remove this object from the scene to be rendered separately.
        this.el.object3D.parent.remove(this.el.object3D);
        // Setup fixed camera nd render target.
        this.camera = new THREE.PerspectiveCamera( 100, 2, 0.1, 1000 );
        // Setup render target
        this.renderTarget = new THREE.WebGLRenderTarget(this.data.renderResolution.x,this.data.renderResolution.y, { antialias: true } );
        // Set the texture to the ui panel mesh.
        this.meshEl.getObject3D('mesh').material.map = this.renderTarget.texture;
        // Listen for change events to enable rendering.
        this.isRendering = true;
        this.stoppedRendering = false;
        // Listen for change events to enable/disable rendering
        this.el.sceneEl.addEventListener('ui-changing',()=>{
            this.stoppedRendering = false;
            this.isRendering = true;
        });
        this.el.sceneEl.addEventListener('ui-changing-stopped',()=>{
            this.isRendering = false;
        });
        // Setup raycaster for relaying mouse/keyboard events
        this.raycaster = new THREE.Raycaster();
        this.helper = new THREE.Mesh(new THREE.SphereGeometry(0.01),new THREE.MeshBasicMaterial({color:'#ff0000'}));
        // Add cursor helper to object
        if(this.data.debugRaycaster)this.el.object3D.add(this.helper);
        // Set last render time
        this.lastRenderTime = 0;
    },
    play(){
        this.lastMouseMoveTime = 0;
        // Register event listeners
        // Mousedown and mouseup do not have the correct intersection point. Use last mouse move event if available instead.
        // TODO: raise issue with aframe / submit PR;
        this.click = e=>this.mouseEvent('click',this.lastMoveEvent||e);
        this.mousedown = e=>this.mouseEvent('mousedown',this.lastMoveEvent||e);
        this.mouseup = e=>this.mouseEvent('mouseup',this.lastMoveEvent||e);
        this.mousewheel = e=>this.mouseEvent('ui-mousewheel',e.detail.evt);
        this.mousemove = e=>{
            // Save mousemove event for mousedown/mouseup events.
            this.lastMoveEvent = e;
            this.mouseEvent('ui-mousemove',e);
        };
        this.meshEl.addEventListener('mousedown',this.mousedown);
        this.meshEl.addEventListener('mouseup',this.mouseup);
        this.meshEl.addEventListener('click',this.click);
        this.meshEl.addEventListener('ui-mousemove',this.mousemove);
        this.meshEl.addEventListener('ui-mousewheel',this.mousewheel);
    },
    pause(){
        this.meshEl.removeEventListener('mousedown',this.mousedown);
        this.meshEl.removeEventListener('mouseup',this.mouseup);
        this.meshEl.removeEventListener('click',this.click);
        this.meshEl.removeEventListener('ui-mousemove',this.mousemove);
        this.meshEl.removeEventListener('ui-mousewheel',this.mousewheel);
    },
    setupUIPanel(){
        let uiPanel = document.createElement('a-plane');
        uiPanel.setAttribute('position',this.data.panelPosition);
        uiPanel.setAttribute('width',this.data.panelSize.x);
        uiPanel.setAttribute('height',this.data.panelSize.y);
        this.el.sceneEl.appendChild(uiPanel);
        return uiPanel;
    },
    mouseEvent(type,e){
        let mouse = {x:0,y:0};
        if(e.detail.intersection){
            let localPoint = this.el.object3D.worldToLocal(e.detail.intersection.point);
            mouse = {
                x:localPoint.x/this.meshEl.getAttribute('width')*2,
                y:localPoint.y/this.meshEl.getAttribute('height')*2
            };
        }
        if(type==='ui-mousewheel'&&e.detail.evt){
            mouse.deltaY = e.detail.deltaY;
            mouse.deltaX = e.detail.deltaX;
        }
        if(type==='mousedown'&&this.lookControlsEl&&this.lookControlsEl.components['look-controls']){
            this.lookControlsEl.components[this.data.lookControlsComponent].pause()
        }
        if(type==='mouseup'&&this.lookControlsEl&&this.lookControlsEl.components['look-controls']){
            this.lookControlsEl.components[this.data.lookControlsComponent].play()
        }
        this.raycastIntersections(e,mouse,type);
    },
    raycastIntersections(e,mouse,type){
        if(!this.camera)return;
        this.raycaster.setFromCamera( mouse, this.camera );
        // this.helper.setDirection(this.raycaster.ray.direction);
        let intersections = this.raycaster.intersectObjects( this.el.object3D.children, true );
        this.prevIntersectionEls = this.prevIntersectionEls||[];
        let intersectionEls = [];
        if(intersections.length&&this.data.debugRaycaster){
            let intersectionPoint = intersections[0].point;
            if(intersections[0].object===this.helper&&intersections.length>1){
                intersectionPoint = intersections[1].point;
            }
            this.helper.position.copy(intersectionPoint);
            this.helper.position.x-=0.03;
        }
        let defaultPrevented = false;
        if(intersections.length&&type==="mousewheel"){
            return this.el.sceneEl.renderer.domElement.emit('ui-mousewheel',{evt:e})
        }
        for(let i = 0;i < intersections.length; i++){
            let intersection = intersections[i];
            // Only emit events on objecst with an element attached
            if(intersection.object.el&&intersection.object.el.classList.contains(this.data.intersectableClass)){
                let currentEvent = {intersection:intersection,evt:e,preventDefault:()=>{defaultPrevented=true}};
                // If this is the first time weve seen this element then emit the mouseenter event.
                if(this.prevIntersectionEls.indexOf(intersection.object.el)===-1&&!defaultPrevented){
                    intersection.object.el.emit('mouseenter',currentEvent);
                }
                // Emit the mouse event received
                if(!defaultPrevented){
                    intersection.object.el.emit(type,currentEvent);
                }
                // Store the intersection on the element.
                intersection.object.el.intersection = intersection;
                // Add the current el to the list to check against previous intersection els.
                intersectionEls.push(intersection.object.el);
            }
        }
        // Find any intersections that have disappeared to emit the mouse leave event.
        for(let i = 0;i < this.prevIntersectionEls.length; i++){
            let intersectionEl = this.prevIntersectionEls[i];
            if(intersectionEls.indexOf(intersectionEl)===-1){
                intersectionEl.emit('mouseleave',{intersection:intersectionEl.intersection});
            }
        }
        // Store the current intersected elements for the next iteration.
        this.prevIntersectionEls = intersectionEls;
    },
    tick(){
        if(new Date().getTime()-this.lastRenderTime<(1000/this.data.fps)&&this.isRendering)return;
        if(this.stoppedRendering)return;
        this.el.object3D.traverse(child=>{
            child.updateMatrixWorld();
        });
        this.el.sceneEl.renderer.render(this.el.object3D,this.camera,this.renderTarget);
        this.lastRenderTime = new Date().getTime();
        if(!this.isRendering){
            this.stoppedRendering = true;
        }
    }
});