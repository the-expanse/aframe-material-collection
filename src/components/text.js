/* global AFRAME,THREE */
/**
 * Text input component Component for aframe-material-collection. Includes support for number/int only input.
 * @namespace aframe-material-collection
 * @component ui-text
 * @author Shane Harris
 */

if (typeof CanvasInput === 'undefined') {
    throw 'aframe-material-collection requires CanvasInput to be loaded first - <script src="https://cdn.rawgit.com/shaneharris/CanvasInput/master/CanvasInput.js"></script>';
}
module.exports = AFRAME.registerComponent('ui-text', {
    schema: {
        width:{type:'number',default:0.5},
        height:{type:'number',default:0.1},
        value: {default: ''},
        type: {default: 'text'},
        lineFocusColor: {default: '#009688'},
        lineBlurColor: {default: '#cfcfcf'},
        disabledColor: {default: '#afafaf'},
        disabled: {type: 'boolean', default: false},
        fontFamily: {default: 'Roboto'},
        fontColor: {default: '#4f4f4f'},
        placeHolder: {default: 'Text...'},
        intersectableClass: {default: 'intersectable'},
    },
    init(){

        if(this.el.components['ui-text'].isInit)return;
        // Setup text input box.
        this.backing = document.createElement('a-plane');
        this.backing.setAttribute('width',this.data.width);
        this.backing.setAttribute('height',this.data.height);
        this.backing.setAttribute('class',this.data.intersectableClass+' no-yoga-layout');
        this.backing.setAttribute('opacity',0);
        this.backing.setAttribute('scale','1 1 0');
        this.el.appendChild(this.backing);
        this.textMaterial = new THREE.MeshBasicMaterial();
        this.textPlane = new THREE.Mesh(new THREE.PlaneGeometry(this.data.width,this.data.height),this.textMaterial);
        this.el.object3D.add(this.textPlane);
        this.textPlane.position.set(0,0,0.0001);

        // Add under line for showing focus state.
        this.underLine = document.createElement('a-plane');
        this.underLine.setAttribute('width',this.data.width-0.05);
        this.underLine.setAttribute('height',0.005);
        this.underLine.setAttribute('position','0 -0.05 0.001');
        this.underLine.setAttribute('class','no-yoga-layout');
        this.underLine.setAttribute('shader','flat');
        this.underLine.setAttribute('color',this.data.disabled?this.data.disabledColor:this.data.lineBlurColor);
        this.el.appendChild(this.underLine);
        // Handle click to focus the input text.
        this.el.addEventListener('click',e=>this.focus());
        // Double click to select all text.
        this.el.addEventListener('dblclick',e=>this.select());
        // Handle the blur event for setting the input value.
        this.blurHandler = ()=>this.blur();
        this.setValue();
        this.isInit = true;
    },
    tick(){
        // If this element is focused then render the canvas input.
        if(!this.is_focussed)return;
        this.el.sceneEl.canvas_input.render();
        this.textMaterial.map.needsUpdate = true;
    },
    numberOnly(e,is_float){
        // Stolen from stack overflow.
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // Allow: Ctrl/cmd+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+C
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: Ctrl/cmd+X
            (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        // Regex to allow float/int input - float inpit allows "0." for as you type numbers - need to remove on blur.
        // TODO: Need to remove trailing dot on blur to make a valid number.
        if(!((is_float?/^\d*((\.)|(\.\d+))?$/g:/^\d*?$/g).test(this.el.sceneEl.canvas_input.value()+e.key))){
            e.preventDefault();
        }
    },
    floatOnly(e){
        return this.numberOnly(e,true);
    },
    setValue(){
        this.setupCanvasInput();
        this.el.sceneEl.canvas_input.render();
        // Grap a frame from the canvas input wiith the current input value for displaying when not in focus.
        let image = new Image();
        image.src = this.el.sceneEl.canvas_input.renderCanvas().toDataURL("image/png");
        let texture = new THREE.Texture(image);
        texture.needsUpdate = true;
        texture.minFilter = THREE.LinearFilter;
        this.textMaterial = new THREE.MeshBasicMaterial({map:texture});
        this.textPlane.material = this.textMaterial;
        // Update clipping planes for the new material.
        this.setClippingPlanes();

    },
    select(){
        // Select the text on double click.
        this.el.sceneEl.canvas_input.selectText();
    },
    focus(){
        // Start Changes
        UI.utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
        // Reset the global canvas input to this current inputs settings.
        this.resetCanvasInput();
        //this.el.focus();
        this.el.sceneEl.canvas_input.focus();
        this.el.sceneEl.canvas_input.onkeydown(e=>{
            // Prevent input for integer and float only.
            if(this.data.type==="number"){
                this.floatOnly(e);
            }else if(this.data.type==="int"){
                this.numberOnly(e);
            }
        });
        if(this.data.value === this.data.placeHolder){
            // reset value if the same as placeholder.
            this.el.sceneEl.canvas_input.value('');
        }
        // Set the current input to the input canvas texture.
        this.textMaterial = new THREE.MeshBasicMaterial({map:new THREE.Texture(this.el.sceneEl.canvas_input.renderCanvas())});
        this.textPlane.material = this.textMaterial;
        // Update clipping planes for new material.
        this.setClippingPlanes();
        // Set the underline to the focussed state.
        this.underLine.setAttribute('color',this.data.lineFocusColor);
        this.textMaterial.map.minFilter = THREE.LinearFilter;
        // Set focused flag
        this.is_focussed = true;
        // Add mouse down event handler for blur event to the render dom element.
        this.el.sceneEl.renderer.domElement.addEventListener('mousedown',this.blurHandler);
    },
    setClippingPlanes(){
        // If content clips are set for the scroll plane, then set them to the current material and set clipping enabled.
        if(this.el._content_clips){
            this.textMaterial.clippingPlanes = this.el._content_clips;
            this.textMaterial.clipShadows = true;
        }
    },
    blur(){
        // Clicked off the input text field.
        this.is_focussed = false;
        this.el.sceneEl.renderer.domElement.removeEventListener('mousedown',this.blurHandler);
        let new_value = this.el.sceneEl.canvas_input.value();
        // Update the current valuue.
        this.data.value = new_value;
        // Reset the under line color to blur state.
        this.underLine.setAttribute('color',this.data.lineBlurColor);
        // Blur the canvas element to grab a frame without the carret.
        this.el.sceneEl.canvas_input.blur();
        // Set the input current value image.
        this.setValue();
        // Stop Changes
        UI.utils.stoppedChanging(this.el.object3D.uuid);
    },
    resetCanvasInput(){
        // Set the canvas input to this current inputs settings.
        if(this.el.sceneEl.canvas_input) {
            this.el.sceneEl.canvas_input.width((this.data.width - 0.1) * 300);
            this.el.sceneEl.canvas_input.fontFamily(this.data.fontFamily);
            this.el.sceneEl.canvas_input.fontColor(this.data.fontColor);
            this.el.sceneEl.canvas_input.placeHolder(this.data.placeHolder);
            this.el.sceneEl.canvas_input.value(this.data.value);
            this.el.sceneEl.canvas_input.borderWidth(0);
        }
    },
    updateSchema(){
        if(this.data){
            // Reset the current settings if changed programatically.
            this.resetCanvasInput();
        }
    },
    setupCanvasInput(){
        // Setup the input canvas if not already setup
        let canvas = document.getElementById('textCanvas');
        canvas.width = (this.data.width)*300;
        this.resetCanvasInput();
        if(this.el.sceneEl.canvas_input){
            return;
        }
        canvas.height = 45;
        let input_settings = {
            canvas:canvas,
            fontSize:18,
            fontFamily: this.data.fontFamily,
            fontColor: this.data.fontColor,
            width:(this.data.width-0.1)*300,
            padding: 12,
            borderWidth: 0,
            borderRadius:0,
            backgroundColor: '#fff',
            placeHolder:this.data.placeHolder,
            placeHolderColor:'#cfcfcf',
            boxShadow: '0px 0px 0px #fff',
            innerShadow:'0px 0px 0px rgba(255,255,255, 1)',
            value:this.data.value
        };
        this.el.sceneEl.canvas_input = new CanvasInput(input_settings);
    }
});