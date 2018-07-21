/* global AFRAME,THREE */
/**
 * Scroll Pane for aframe-material-collection. Expects
 * @namespace aframe-material-collection
 * @component ui-scroll-pane
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-scroll-pane', {
    schema: {
        height:{type:'number',default:2.4},
        width:{type:'number',default:5},
        scrollPadding:{type:'number',default:0.1}
    },
    init() {
        // Setup scroll bar and panel backing.
        this.setupElements();
        // Grab content container.
        this.container = this.el.querySelector('.container');
        if(typeof this.container === 'undefined'){
            throw 'ui-scroll-pane needs an entity inside it with the class "container" - <a-entity class="container"></a-entity>';
        }
        // Setup scroll bar.
        this.scrollBarWidth = this.rail.getAttribute('width');
        this.container.setAttribute('position',(-this.data.width/2)+' '+((this.data.height/2))+' 0');
        this.rail.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' 0 0.0002');
        this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' 0 0.0005');
        this.el.sceneEl.renderer.localClippingEnabled = true;
        // Setup content clips.
        this.content_clips = [
            new THREE.Plane( new THREE.Vector3( 0, 1, 0 ), (this.data.height/2) ),
            new THREE.Plane( new THREE.Vector3( 0, -1, 0 ), (this.data.height/2) ),
            new THREE.Plane( new THREE.Vector3( -1, 0, 0 ), (this.data.width/2) ),
            new THREE.Plane( new THREE.Vector3( 1, 0, 0 ), (this.data.width/2) )
        ];
        // Get camera element for pause/play for scroll bar dragging.
        let camera = document.getElementById('camera');
        // Setup mouse move handler for scrolling and updating scroll handle.
        let mousemove = e=>{
            if(this.isDragging){
                let pos = this.backgroundPanel.object3D.worldToLocal(e.detail.intersection.point);
                let min = (-this.data.height/2)+(this.data.height*this.handleSize)/2;
                let max = (this.data.height/2)-(this.data.height*this.handleSize)/2;
                // Set scroll position with start point offset.
                let scroll_pos = THREE.Math.clamp(pos.y-this.handlePos,min,max);
                let scroll_perc = 1-((scroll_pos-min)/(max-min));
                this.container.object3D.position.y = ((this.content_height-this.data.height)*scroll_perc)+(this.data.height/2);
                this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' '+scroll_pos+' 0.0005');
            }
        };
        // Start scroll
        this.handle.addEventListener('mousedown',e=>{
            camera.components["look-controls"].pause();
            this.isDragging = true;
            // Store the start point offset
            this.handlePos = this.handle.object3D.worldToLocal(e.detail.intersection.point).y;
            this.backgroundPanel.addEventListener('ui-mousemove',mousemove);
        });
        // End scroll
        this.el.sceneEl.addEventListener('mouseup',e=>{
            if(this.isDragging){
                this.backgroundPanel.removeEventListener('ui-mousemove',mousemove);
                camera.components["look-controls"].play();
                this.isDragging = false;
            }
        });
        // Setup content clips after the scene is loaded to be able to access all entity materials
        this.el.sceneEl.addEventListener('loaded',()=>{
            // update content clips world positions from this current element.
            this.el.sceneEl.object3D.updateMatrixWorld();
            this.content_clips[0].applyMatrix4(this.el.object3D.matrixWorld);
            this.content_clips[1].applyMatrix4(this.el.object3D.matrixWorld);
            this.content_clips[2].applyMatrix4(this.el.object3D.matrixWorld);
            this.content_clips[3].applyMatrix4(this.el.object3D.matrixWorld);
            this.setChildClips();
            this.initialiseYoga(this.container,this.data.width*100);
            this.container.yoga_node.calculateLayout(this.data.width*100, 'auto', Yoga.DIRECTION_LTR);
            this.content_height = Number.NEGATIVE_INFINITY;
            this.updateYoga(this.container);
            this.handleSize = THREE.Math.clamp((this.data.height/this.content_height),0.1,1);
            this.handle.setAttribute('height',this.data.height*this.handleSize);
            this.handle.setAttribute('width',this.handleSize===1?0.00000001:0.1);
            this.rail.setAttribute('color',this.handleSize===1?'#efefef':'#fff');
            this.handle.setAttribute('position',((this.data.width/2)+this.data.scrollPadding)+' '+(this.data.height-(this.data.height*this.handleSize))/2+' 0.0005');
        });

    },
    setupElements(){

        // Setup background with mouse input to catch mouse move events when not exactly over the scroll bar.
        this.backgroundPanel = document.createElement('a-plane');
        this.backgroundPanel.setAttribute('class','background intersectable');
        this.backgroundPanel.setAttribute('width',this.data.width+1);
        this.backgroundPanel.setAttribute('height',this.data.height+1);
        this.backgroundPanel.setAttribute('position','0 0 -0.013');
        this.backgroundPanel.setAttribute('visible',false);
        this.el.appendChild(this.backgroundPanel);

        // Add scroll bar rail.
        this.rail = document.createElement('a-plane');
        this.rail.setAttribute('class','rail');
        this.rail.setAttribute('width',0.1);
        this.rail.setAttribute('height',this.data.height);
        this.rail.setAttribute('shader','flat');
        this.el.appendChild(this.rail);

        // Add scroll bar handle.
        this.handle = document.createElement('a-plane');
        this.handle.setAttribute('class','handle intersectable');
        this.handle.setAttribute('width',0.1);
        this.handle.setAttribute('height',this.data.height);
        this.handle.setAttribute('color','#009688');
        this.handle.setAttribute('shader','flat');
        this.el.appendChild(this.handle);
    },
    setupYogaNode(node,width,height,properties){
        // Parse yoga properties and call the yoga methods to setup this layout node.
        if(!properties.hasOwnProperty('setWidth'))node.setWidth(width);
        if(!properties.hasOwnProperty('setHeight'))node.setHeight(height);
        Object.keys(properties).filter(method=>method.indexOf('Edge')===-1).forEach(function(method){
            switch(method){
                case "setMargin":
                case "setMarginPercent":
                case "setPadding":
                case "setBorder":
                case "setPosition":
                case "setPositionPercent":
                    node[method](properties[method+"Edge"]||Yoga.EDGE_ALL,properties[method]);
                    break;
                case "setMarginAuto":
                    node[method](properties[method+"Edge"]||Yoga.EDGE_ALL);
                    break;
                case "setWidthAuto":
                case "setHeightAuto":
                    node[method]();
                    break;
                default:
                    node[method](properties[method]);
            }
        });
    },
    initialiseYoga(parent,width){
        // Traverse the tree and setup Yoga layout nodes with default settings
        // or settings specified in the elements yoga properties component.
        parent = parent||this.container;
        let height = 0;
        if(!parent.yoga_node){
            parent.yoga_node = Yoga.Node.create();
            if(parent.components["ui-yoga"]){
                this.setupYogaNode(parent.yoga_node,width,'auto',
                    parent.components["ui-yoga"].getProperties());
            }else{
                parent.yoga_node.setWidth(width);
                parent.yoga_node.setHeight('auto');
                parent.yoga_node.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
                parent.yoga_node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
                parent.yoga_node.setAlignContent(Yoga.ALIGN_AUTO);
                parent.yoga_node.setFlexWrap(Yoga.WRAP_WRAP);
                parent.yoga_node.setPadding(Yoga.EDGE_ALL,16);
            }
        }
        // Automatically detect the entity width / height by the element tagname.
        [].slice.call(parent.children).forEach(child=>{
            let width = 0,height = 0;
            if(child.classList.contains('no-yoga-layout')){
                return;
            }
            switch(child.tagName){
                case "A-TEXT":
                case "A-TRIANGLE":
                case "A-UI-TEXT-INPUT":
                case "A-UI-NUMBER-INPUT":
                case "A-UI-INT-INPUT":
                case "A-UI-PASSWORD-INPUT":
                    width = child.getAttribute('width');
                    height = child.getAttribute('height');
                    break;
                case "A-UI-BUTTON":
                case "A-PLANE":
                case "A-ENTITY":
                    width = Number(child.components.geometry?child.components.geometry.data.width:child.getAttribute('width'));
                    height = Number(child.components.geometry?child.components.geometry.data.height:child.getAttribute('height'));
                    break;
                case "A-UI-FAB-BUTTON":
                case "A-UI-FAB-BUTTON-SMALL":
                case "A-CIRCLE":
                    width = Number(child.components.geometry?child.components.geometry.data.radius*2:(child.getAttribute('radius')||0)*2);
                    height = width;
                    break;
                case "A-RING":
                    width = Number(child.components.geometry?child.components.geometry.data["radius-outer"]*2:(child.getAttribute('radius-outer')||0)*2);
                    height = width;
                    break;
                case "A-UI-SWITCH":
                case "A-UI-CHECKBOX":
                case "A-UI-RADIO":
                    let componentName = child.tagName.substr(2).toLowerCase();
                    width = child.components[componentName].width;
                    height = child.components[componentName].height;
                    break;
            }
            // Create the yoga node if it doesnt exist.
            if(!child.yoga_node){
                child.yoga_node = Yoga.Node.create();
                // If node properties then setup those properties.
                if(child.components["ui-yoga"]){
                    this.setupYogaNode(child.yoga_node,width ? width * 100 : 'auto',height ? height * 100 : 'auto',
                        child.components["ui-yoga"].getProperties());
                }else {
                    // Set default properties.
                    child.yoga_node.setWidth(width ? width * 100 : 'auto');
                    child.yoga_node.setHeight(height ? height * 100 : 'auto');
                    child.yoga_node.setMargin(Yoga.EDGE_RIGHT, 10);
                    child.yoga_node.setMargin(Yoga.EDGE_BOTTOM, 10);
                    if (child.tagName === "A-ENTITY") {
                        child.yoga_node.setFlexDirection(Yoga.FLEX_DIRECTION_ROW);
                        child.yoga_node.setJustifyContent(Yoga.JUSTIFY_FLEX_START);
                        child.yoga_node.setAlignItems(Yoga.ALIGN_FLEX_START);
                        child.yoga_node.setAlignSelf(Yoga.ALIGN_AUTO);
                        child.yoga_node.setAlignContent(Yoga.ALIGN_AUTO);
                        child.yoga_node.setFlexWrap(Yoga.WRAP_WRAP);
                    }
                }
                // Add the yoga node to the Yoga tree.
                parent.yoga_node.insertChild(child.yoga_node,parent.yoga_node.getChildCount());
            }
            this.initialiseYoga(child);
        });
    },
    updateYoga(parent){
        // Update the entity positions from the Yoga layout.
        [].slice.call(parent.children).forEach(child=>{
            if(child.classList.contains('no-yoga-layout')){
                return;
            }
            let position;
            if(child.tagName==="A-ENTITY"){
                position = {
                    x:(child.yoga_node.getComputedLeft()/100),
                    y:(child.yoga_node.getComputedTop()/100),
                };
            }else{
                position = {
                    x:(child.yoga_node.getComputedLeft()/100)+(child.yoga_node.getComputedWidth()/200),
                    y:(child.yoga_node.getComputedTop()/100)+(child.yoga_node.getComputedHeight()/200),
                };
            }
            let highest = (child.yoga_node.getComputedTop()/100)+(child.yoga_node.getComputedHeight()/100);
            if(highest>this.content_height){
                this.content_height = highest;
            }
            child.setAttribute('position',position.x+' '+(-position.y)+' '+child.getAttribute('position').z);
            this.updateYoga(child);
        });
    },
    setChildClips(parent){
        // Traverse the entity tree inside the content container and add content clips to each material found.
        parent = parent||this.container;
        let height = 0;
        [].slice.call(parent.children).forEach(child=>{
            child._content_clips = this.content_clips;
            let traverse = ()=>{
                child.object3D.traverse(object=>{
                    if(object.material){
                        // Add shader chunks to be able to clip shader materials - needed for <a-text> entities.
                        if(object.material.isRawShaderMaterial){
                            object.material.onBeforeCompile = function ( shader ) {
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
                            object.material.clipping = true;
                        }
                        // Set the content clipping planes.
                        object.material.clippingPlanes = this.content_clips;
                        object.material.clipShadows = true;
                        object.material.needsUpdate = true;
                    }
                });
            };
            if(child.components.text){
                // Wait for the font to load first.
                child.addEventListener('textfontset',()=>{
                    traverse();
                })
            }else{
                traverse();
            }
            // Recurse.
            this.setChildClips(child);
        })
    }
});