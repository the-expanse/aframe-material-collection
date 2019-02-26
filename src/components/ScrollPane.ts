import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Math, Mesh, Object3D, Plane, Shader, Vector3} from "three";
import {ALIGN_AUTO, FLEX_DIRECTION_ROW, JUSTIFY_FLEX_START, WRAP_WRAP} from "typeflex";
import YogaWorker from 'worker-loader!../workers/yoga-worker.ts';
import {UiElement} from "./UiElement";

let workerResolves = {} as any;
let yogaWorker = new YogaWorker();
yogaWorker.onmessage = event=>{
    if(workerResolves.hasOwnProperty(event.data.uuid)){
        workerResolves[event.data.uuid](event.data);
    }
};
let sendMessage = (type: string,properties: any, parentUuid: string | null, width?:number)=>{
    return new Promise(resolve=>{
        let uuid = Math.generateUUID();
        workerResolves[uuid] = resolve;
        yogaWorker.postMessage({ type, properties, uuid, parentUuid, width});
    });
};

export class ScrollPane extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-scroll-pane",
        /* Schema */ {
            height:{type:'number',default:1.2},
            width:{type:'number',default:2.9},
            scrollPadding:{type:'number',default:0.05},
            scrollZOffset:{type:'number',default:0},
            scrollHandleColor:{default:'#009688'},
            intersectableClass:{default:'intersectable'},
            cameraEl:{type:'selector'},
            lookControlsComponent:{default:'look-controls'},
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new ScrollPane(component, entity, data));

    container: Entity = undefined as any as Entity;
    rail: Entity = undefined as any as Entity;
    handle: Entity = undefined as any as Entity;
    backgroundPanel: Entity = undefined as any as Entity;

    content_clips: Array<Plane> = undefined as any as Array<Plane>;
    scrollBarWidth = 0;
    isDragging = false;
    handlePos = 0;
    currentUuid: string = '';
    content_height = 0;
    handleSize = 0;
    fontRenderTimeout: any;


    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        // Setup scroll bar and panel backing.
        this.setupElements();
        // Grab content container.
        this.container = this.component.el.querySelector('.container') as Entity;
        if(typeof this.container === 'undefined'){
            throw 'ui-scroll-pane needs an entity inside it with the class "container" - <a-entity class="container"></a-entity>';
        }
        // Setup scroll bar.
        this.scrollBarWidth = this.rail.getAttribute('width');
        this.container.setAttribute('position',(-this.data.width/2)+' '+((this.data.height/2))+' 0');
        this.rail.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' 0 '+(this.data.scrollZOffset+0.0002));
        this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' 0 '+(this.data.scrollZOffset+0.0005));
        this.component.el.sceneEl!!.renderer.localClippingEnabled = true;
        // Setup content clips.
        this.content_clips = [
            new Plane( new Vector3( 0, 1, 0 ), (this.data.height/2) ),
            new Plane( new Vector3( 0, -1, 0 ), (this.data.height/2) ),
            new Plane( new Vector3( -1, 0, 0 ), (this.data.width/2) ),
            new Plane( new Vector3( 1, 0, 0 ), (this.data.width/2) )
        ];
        // Pause/play camera look controls
        const playPauseCamera = (method: string)=>{
            if(this.data.cameraEl) {
                let lookControls = this.data.cameraEl.components[this.data.lookControlsComponent];
                if(lookControls){
                    lookControls[method]();
                }
            }
        };
        // Setup mouse move handler for scrolling and updating scroll handle.
        const mousemove = (e)=>this.mouseMove(e);
        // Start scroll
        this.handle.addEventListener('mousedown',(e)=>{
            // Pause look controls to allow scrolling
            playPauseCamera('pause');
            this.isDragging = true;
            // Store the start point offset
            this.handlePos = this.handle.object3D.worldToLocal(((e as MouseEvent).detail as any).intersection.point).y;
            this.backgroundPanel.addEventListener('ui-mousemove',mousemove);
            // Start changes
            this.ui.isChanging(this.component.el.sceneEl,this.handle.object3D.uuid);
            // Prevent default behaviour of event
            this.ui.preventDefault(e);
        });
        // End scroll
        const endScroll = (e)=>{
            if(this.isDragging){
                this.backgroundPanel.removeEventListener('ui-mousemove',mousemove);
                // Play look controls once scrolling is finished
                playPauseCamera('play');
                this.isDragging = false;
                // Stop changes
                this.ui.stoppedChanging(this.handle.object3D.uuid);
                // Prevent default behaviour of event
                this.ui.preventDefault(e);
            }
        };
        this.backgroundPanel.addEventListener('mouseup',endScroll);
        this.backgroundPanel.addEventListener('mouseleave',endScroll);
        // // Handle clicks on rail to scroll
        this.rail.addEventListener('mousedown',(e)=>{

            this.ui.isChanging(this.component.el.sceneEl,this.handle.object3D.uuid);
            // Pause look controls
            this.isDragging = true;
            // Reset handle pos to center of handle
            this.handlePos = 0;
            // Scroll immediately and register mouse move events.
            this.scroll(this.rail.object3D.worldToLocal(((e as MouseEvent).detail as any).intersection.point).y);
            this.backgroundPanel.addEventListener('ui-mousemove',mousemove);
            // Prevent default behaviour of event
            this.ui.preventDefault(e);
        });

        // Setup content clips after the scene is loaded to be able to access all entity materials

        // update content clips world positions from this current element.

        this.updateContent();
        this.component.el.emit('scroll-pane-loaded');
        this.setupMouseWheelScroll();

        // Expose methods to the element to update/set the content of the scroll pane.
        (this.component.el as any).setContent = this.setContent.bind(this);
        (this.component.el as any).updateContent = this.updateContent.bind(this);
        (this.component.el as any).scroll = this.scroll.bind(this);
    }

    updateContentClips(){
        this.component.el.sceneEl!!.object3D.updateMatrixWorld(false);
        // update content clips world positions from this current element.
        this.content_clips[0].set(new Vector3( 0, 1, 0 ), (this.data.height/2));
        this.content_clips[1].set(new Vector3( 0, -1, 0 ), (this.data.height/2));
        this.content_clips[2].set(new Vector3( -1, 0, 0 ), (this.data.width/2));
        this.content_clips[3].set(new Vector3( 1, 0, 0 ), (this.data.width/2));
        //this.component.el.sceneEl.object3D.updateMatrixWorld();
        this.content_clips[0].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[1].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[2].applyMatrix4(this.component.el.object3D.matrixWorld);
        this.content_clips[3].applyMatrix4(this.component.el.object3D.matrixWorld);

    }
    async setContent(body: string,noAutoReload: boolean){
        if(this.container) {
            // Remove all children in the container and all yoga nodes
            while (this.container.firstChild) {
                let child = this.container.firstChild as Entity;
                if(child.object3D){
                    this.ui.clearObject(child.object3D);
                }
                this.container.removeChild(child);
                (this.container as any).firstChild = null;
            }
            // Set the content in the scroll pane.
            return new Promise(resolve=>{
                let loadedWrapper = document.createElement('a-entity');
                loadedWrapper.setAttribute('visible',false);
                loadedWrapper.insertAdjacentHTML('afterbegin',body);
                loadedWrapper.addEventListener('loaded',e=>{
                    // Trigger an update to redraw scrollbars and fire change events.
                    sendMessage('reset-layout',null,(this.container as any).yoga_uuid, undefined)
                        .then(async ()=>{
                            loadedWrapper.setAttribute('visible',true);
                            if(!noAutoReload){
                                return this.updateContent();
                            }
                        })
                        .then(()=>resolve(loadedWrapper));
                });
                this.container.appendChild(loadedWrapper);
            })
        }
    }
    async updateContent(should_not_scroll?: boolean){
        this.updateContentClips();
        this.currentUuid = Math.generateUUID();
        this.ui.isChanging(this.component.el.sceneEl,this.currentUuid);
        this.setChildClips();
        await this.initialiseYoga(this.container);
        await sendMessage('get-layout',null,(this.container as any).yoga_uuid, undefined)
            .then(layout=>{
                this.content_height = (layout as any).data.content_height/100;
                //console.log(layout.data.content_height/100);
                this.updateYoga(this.container,(layout as any).data);

                this.handleSize = Math.clamp((this.data.height/this.content_height),0.1,1);

                this.handle.setAttribute('visible',this.handleSize!==1);
                this.rail.setAttribute('visible',this.handleSize!==1);
                this.rail.setAttribute('color',this.handleSize===1?'#efefef':'#fff');
                this.handle.setAttribute('height',this.data.height*this.handleSize);
                if(!should_not_scroll){
                    this.container.object3D.position.y = this.data.height/2;
                    this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' '+(this.data.height-(this.data.height*this.handleSize))/2+' '+(this.data.scrollZOffset+0.0005));
                }
                setTimeout(()=>this.ui.stoppedChanging(this.currentUuid),3000);
            });
    }
    mouseMove(e: MouseEvent){
        if(this.isDragging){
            let pos = this.rail.object3D.worldToLocal((e.detail as any).intersection.point);
            this.scroll(pos.y-this.handlePos);
        }
    }
    scroll(positionY: number){
        let min = (-this.data.height/2)+(this.data.height*this.handleSize)/2;
        let max = (this.data.height/2)-(this.data.height*this.handleSize)/2;
        // Set scroll position with start point offset.
        let scroll_pos = Math.clamp(positionY,min,max);
        let scroll_perc = this.handleSize===1?0:1-((scroll_pos-min)/(max-min));
        this.container.object3D.position.y = ((this.content_height-this.data.height)*scroll_perc)+(this.data.height/2);
        this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' '+scroll_pos+' '+(this.data.scrollZOffset+0.0005));
    }
    setupMouseWheelScroll(){
        this.backgroundPanel.addEventListener('ui-mousewheel',(e)=>{
            if(this.handleSize!==1){
                // Start changes
                this.ui.isChanging(this.component.el.sceneEl,this.component.el.object3D.uuid);
                this.scroll(this.handle.getAttribute('position').y+(((e as MouseEvent).detail as any).evt.deltaY<0?0.1:-0.1));
                // Stop changes
                this.ui.stoppedChanging(this.component.el.object3D.uuid);
                this.ui.preventDefault(e);
            }
        });
    }
    setupElements(){
        // Setup background with mouse input to catch mouse move events when not exactly over the scroll bar.
        this.backgroundPanel = document.createElement('a-plane');
        this.backgroundPanel.setAttribute('class','background '+this.data.intersectableClass);
        this.backgroundPanel.setAttribute('width',this.data.width+1);
        this.backgroundPanel.setAttribute('height',this.data.height+1);
        this.backgroundPanel.setAttribute('position','0 0 -0.013');
        this.backgroundPanel.setAttribute('opacity',0.0001);
        this.backgroundPanel.setAttribute('transparent',true);

        this.component.el.appendChild(this.backgroundPanel);

        // Add scroll bar rail.
        this.rail = document.createElement('a-plane');
        this.rail.setAttribute('class','rail '+this.data.intersectableClass);
        this.rail.setAttribute('width',0.1);
        this.rail.setAttribute('height',this.data.height);
        this.rail.setAttribute('shader','flat');
        this.component.el.appendChild(this.rail);

        // Add scroll bar handle.
        this.handle = document.createElement('a-plane');
        this.handle.setAttribute('class','handle '+this.data.intersectableClass);
        this.handle.setAttribute('width',0.1);
        this.handle.setAttribute('height',this.data.height);
        this.handle.setAttribute('color',this.data.scrollHandleColor);
        this.handle.setAttribute('shader','flat');
        this.component.el.appendChild(this.handle);
    }

    async initialiseYoga(parent: Entity){
        // Traverse the tree and setup Yoga layout nodes with default settings
        // or settings specified in the elements yoga properties component.
        parent = parent||this.container;
        // Automatically detect the entity width / height by the element tagname.
        let width = 0,height = 0;
        let geo = parent.getAttribute('geometry');
        switch(parent.tagName){
            case "A-TEXT":
            case "A-TRIANGLE":
            case "A-UI-TEXT-INPUT":
            case "A-UI-NUMBER-INPUT":
            case "A-UI-INT-INPUT":
            case "A-UI-INPUT-TEXT":
            case "A-UI-PASSWORD-INPUT":
                width = parent.getAttribute('width');
                height = parent.getAttribute('height');
                break;
            case "A-UI-BUTTON":
            case "A-PLANE":
            case "A-ENTITY":
                width = Number(geo?geo.width:parent.getAttribute('width'));
                height = Number(geo?geo.height:parent.getAttribute('height'));
                break;
            case "A-UI-FAB-BUTTON":
            case "A-UI-FAB-BUTTON-SMALL":
            case "A-CIRCLE":
                width = Number(geo?geo.radius*2:(parent.getAttribute('radius')||0)*2);
                height = width;
                break;
            case "A-RING":
                width = Number(geo?geo["radius-outer"]*2:(parent.getAttribute('radius-outer')||0)*2);
                height = width;
                break;
            case "A-UI-SLIDER":
            case "A-UI-NUMBER":
            case "A-UI-SWITCH":
            case "A-UI-CHECKBOX":
            case "A-UI-RADIO":
                let componentName = parent.tagName.substr(2).toLowerCase();
                width = parent.getAttribute(componentName).width;
                height = parent.getAttribute(componentName).height;
                break;
        }
        // width = Math.round(width);
        // height = Math.round(height);
        //parent.yoga_node = Node.create();
        let ui_yoga = parent.getAttribute("ui-yoga");
        let properties = {} as any;
        if(ui_yoga&&(parent as any).getYogaProperties){
            properties = (parent as any).getYogaProperties();
        }else{
            properties.setJustifyContent = JUSTIFY_FLEX_START;
            properties.setFlexDirection = FLEX_DIRECTION_ROW;
            properties.setAlignContent = ALIGN_AUTO;
            properties.setFlexWrap = WRAP_WRAP;
            if(parent.parentElement&&(parent.parentElement as any).yoga_uuid){
                // Default margin if none set;
                properties.setMarginRight = 5;
                properties.setMarginBottom = 5;
            }else{
                // Default root padding if none set;
                properties.setPadding = 2;
            }
        }
        if(!properties.hasOwnProperty('setWidth')){
            properties.setWidth = width ? width * 100 : 'auto';
        }
        if(!properties.hasOwnProperty('setHeight')){
            properties.setHeight = height ? height * 100 : 'auto';
        }
        //this.setupYogaNode(parent.yoga_node,width ? width * 100 : 'auto',height ? height * 100 : 'auto',properties);
        // if(parent.parentElement&&parent.parentElement.yoga_node){
        //     parent.parentElement.yoga_node.insertChild(parent.yoga_node,parent.parentElement.yoga_node.getChildCount());
        // }
        let promise;
        if(parent.parentElement&&(parent.parentElement as any).yoga_uuid){
            promise = sendMessage('add-node',properties,(parent.parentElement as any).yoga_uuid, undefined);
        }else{
            promise = sendMessage('add-node',properties,null,this.data.width*100);
        }
        await promise.then(resp=>{
            (parent as any).yoga_uuid = (resp as any).uuid;
            let promises = new Array<any>();
            for(let i = 0; i < parent.childNodes.length; i++) {
                let child = parent.childNodes[i];
                if (child.nodeType === 1) {
                    if(!(child as any).classList.contains('no-yoga-layout')){
                        promises.push(this.initialiseYoga(child as Entity));
                    }
                }
            }
            return Promise.all(promises);
        });
    }

    updateYoga(parent: Entity,layout: any){
        // Update the entity positions from the Yoga layout.
        for(let i = 0; i < parent.childNodes.length; i++){
            let child = parent.childNodes[i] as Entity;
            if(child.nodeType === 1){
                if(child.classList.contains('no-yoga-layout')){
                    return;
                }
                let position;

                if(!layout[(child as any).yoga_uuid]){
                    console.log(child,layout);
                }
                if(child.tagName==="A-ENTITY"){
                    position = {
                        x:(layout[(child as any).yoga_uuid].left/100),
                        y:(layout[(child as any).yoga_uuid].top/100),
                    };
                }else{
                    position = {
                        x:(layout[(child as any).yoga_uuid].left/100)+(layout[(child as any).yoga_uuid].width/200),
                        y:(layout[(child as any).yoga_uuid].top/100)+(layout[(child as any).yoga_uuid].height/200),
                    };
                }
                child.setAttribute('position',position.x+' '+(-position.y)+' 0.0001');
            }
            this.updateYoga(child,layout);
        }
    }

    setChildClips(parent?: Entity){
        // Traverse the entity tree inside the content container and add content clips to each material found.
        parent = parent||this.container;
        for(let i = 0; i < parent.childNodes.length; i++) {
            let child = parent.childNodes[i] as Entity;
            //if (child.nodeType === 1) {
            (child as any)._content_clips = this.content_clips;
            let traverse = ()=>{
                if(child.object3D){
                    child.object3D.traverse((object: Object3D) =>{
                        if((object as Mesh).material){
                            // Add shader chunks to be able to clip shader materials - needed for <a-text> entities.
                            if(((object as Mesh).material as any).isRawShaderMaterial){
                                ((object as Mesh).material as any).onBeforeCompile = function ( shader: Shader ) {
                                    let vertexParts = shader.vertexShader.split('\n');
                                    let vertexMainIndex = vertexParts.indexOf('void main(void) {');
                                    vertexParts.splice(vertexMainIndex,0,'#include <clipping_planes_pars_vertex>');
                                    vertexParts.splice(vertexMainIndex+2,0,'#include <begin_vertex>');
                                    vertexParts.splice(vertexParts.length-2,0,'#include <project_vertex>');
                                    vertexParts.splice(vertexParts.length-2,0,'#include <clipping_planes_vertex>');
                                    shader.vertexShader = vertexParts.join('\n');
                                    let fragmentParts = shader.fragmentShader.split('\n');
                                    let fragmentMainIndex = fragmentParts.indexOf('void main() {');
                                    fragmentParts.splice(fragmentMainIndex,0,'#include <clipping_planes_pars_fragment>');
                                    fragmentParts.splice(fragmentMainIndex+2,0,'#include <clipping_planes_fragment>');
                                    shader.fragmentShader = fragmentParts.join('\n');
                                };
                                ((object as Mesh).material as any).clipping = true;
                            }
                            // Set the content clipping planes.
                            ((object as Mesh).material as any).clippingPlanes = this.content_clips;
                            ((object as Mesh).material as any).clipShadows = true;
                            ((object as Mesh).material as any).needsUpdate = true;
                        }
                    });
                }
            };
            // Wait for next tick - exokit required this.
            setTimeout(()=>{
                if(child.getAttribute){
                    let text = child.getAttribute('text');

                    if(text){
                        // Wait for the font to load first.
                        child.addEventListener('textfontset',()=>{
                            clearTimeout(this.fontRenderTimeout);
                            this.fontRenderTimeout = setTimeout(()=>this.ui.stoppedChanging(this.currentUuid),500);
                            traverse();
                        })
                    }else{
                        traverse();
                    }
                }
            },0);
            // }
            // Recurse
            this.setChildClips(child);
        }
    }
    
}