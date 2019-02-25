import {Component, Entity} from "aframe";
import {ComponentControllerDefinition} from "aframe-typescript-boilerplate/built";
import {Mesh, MeshLambertMaterial, Plane, Vector3} from "three";
import {UiElement} from "./UiElement";

export class InputText extends UiElement {

    public static DEFINITION = new ComponentControllerDefinition(
        /* Name */ "ui-input-text",
        /* Schema */ {
            value: {default: ''},
            disabled: {type: 'boolean', default: false},
            type: {default: 'text'},
            cameraEl:{type:'selector'},
            rigEl:{type:'selector'},
            tabNext:{type:'selector'},
            width:{type:'number',default:1},
            height:{type:'number',default:0.2},
            backgroundColor:{default:'white'},
            lookControlsComponent:{default:'look-controls'},
            wasdControlsComponent:{default:'wasd-controls'},
            placeHolder:{default:'Text...'}
        },
        /* Multiple */ false,
        /* Receive ticks */ false,
        /* Factory function */ (component: Component, entity: Entity, data: any) =>
            new InputText(component, entity, data));

    container = undefined as any as Entity;
    backing = undefined as any as Entity;
    underline = undefined as any as Entity;
    selectionHighlight = undefined as any as Entity;
    carret = undefined as any as Entity;
    text = {} as any;
    alphabet = {};
    startSelection = 0;
    scrollOffset = 0;
    scrollIndex = 0;
    carretInterval = undefined as any;
    shiftStartPos = undefined as number | undefined;
    chars = new Array<any>();
    charsAllowed = new Array<string>();
    blurHandler = ()=>{};
    isMoving = false;
    isFocused = false;
    mousemove = (e: any) => {};
    keydown = (e: any) => {};
    keySelectAll = () => {};
    keyCut = () => {};
    keyCopy = () => {};
    keyPaste = () => {};
    positions = new Array<number>();
    depends = ['text'];
    content_clips = [
        new Plane( new Vector3( -1, 0, 0 ), 0 ),
        new Plane( new Vector3( 1, 0, 0 ), 0 )];
    
    constructor(component: Component, entity: Entity, data: any) {
        super(component, entity, data);
    }

    init(): void {
        this.setupElements();
        this.setupScrollClips();
        this.text.addEventListener('textfontset',()=>{
            this.text.selectionStart = 0;
            this.text.selectionLength = 0;
            this.startSelection = 0;
            this.scrollOffset = 0;
            this.alphabet = {};
            this.scrollIndex = 0;
            let chars = this.data.value.split('');
            this.chars = [];
            this.charsAllowed = ['-','_','+','=','{','}','[',']',':',';','\'','@','~','#','<','>',',','.','?','/','|','\\','`','¬'];
            for(let i = 0; i < chars.length; i++){
                this.chars.push({char:chars[i]});
            }
            this.blurHandler = ()=>{
                if(!(this.component.el.sceneEl as any).defaultKeypressPrevented){
                    this.blur();
                }else{
                    (this.component.el.sceneEl as any).defaultKeypressPrevented = false;
                }
            };
            this.isMoving = false;
            this.mousemove = this.onMousemove.bind(this);

            this.keydown = (e: KeyboardEvent)=>this.handleKeyboardEvent(e);
            this.keySelectAll = ()=>this.selectAll();
            this.keyCut = ()=>this.cutText();
            this.keyCopy = ()=>this.copyText();
            this.keyPaste = ()=>this.pasteText();
            this.backing.addEventListener('mousedown',()=>{
                this.focus();
            });
            this.component.el.sceneEl!!.addEventListener('mouseup',()=>{
                this.backing.removeEventListener('ui-mousemove',this.mousemove);
                this.isMoving = false;
                this.setSelection(this.text.selectionStart,this.text.selectionLength)
            });
            this.component.el.setAttribute('visible',false);
            this.setValue();
            // this.ui.isChanging(this.component.el.sceneEl,this.text.object3D.uuid);

            //TODO For some reason initial value is not shown if delay is not there.
            setTimeout(()=> {
                this.setScrollClips();
                this.component.el.setAttribute('visible',true);
                //this.ui.stoppedChanging(this.text.object3D.uuid);
            },500);
        });
        (this.component.el as any).getValue = this.getValue.bind(this);
        (this.component.el as any).value = this.value.bind(this);
        this.component.el.focus = this.focus.bind(this);
    }

    setupScrollClips(){
        this.content_clips = [
            new Plane( new Vector3( -1, 0, 0 ), 0 ),
            new Plane( new Vector3( 1, 0, 0 ), 0 )
        ];
        //this.setScrollClips();
    }
    selectAll(){
        this.text.selectionStart = 0;
        this.text.selectionLength = this.chars.length;
        this.setValue();
    }
    increaseWrap(){
        let child = this.text.object3D.children[this.text.object3D.children.length-1];
        if(!child)return;
        if(child.geometry.layout&&child.geometry.layout._linesTotal>1){
            this.text.setAttribute('visible',false);
            this.text.setAttribute('width',this.text.getAttribute('width')*1.2);
            this.text.setAttribute('wrap-pixels',this.text.getAttribute('width')*500);
            this.text.setAttribute('x-offset',((this.text.getAttribute('width')-this.data.width)/2));
            setTimeout(()=>this.increaseWrap());
        }else{
            this.text.setAttribute('visible',true);
        }
    }
    setScrollClips(){
        //this.text.object3D.updateMatrixWorld();
        //this.backing.object3D.parent.updateMatrixWorld();
        this.content_clips[0].set(new Vector3( -1, 0, 0 ), (this.data.width/2)+0.005);
        this.content_clips[1].set(new Vector3( 1, 0, 0 ), (this.data.width/2)+0.005);
        this.content_clips[0].applyMatrix4(this.backing.object3D.matrixWorld);
        this.content_clips[1].applyMatrix4(this.backing.object3D.matrixWorld);
        setTimeout(()=>{
            let child = this.text.object3D.children[this.text.object3D.children.length-1];
            if(child)child.material.clippingPlanes = this.text._content_clips?this.text._content_clips.concat(this.content_clips):this.content_clips;
        },0);
        let selectionHeight = this.selectionHighlight.getObject3D('mesh') as Mesh;
        if(selectionHeight){
            (selectionHeight.material as any).clippingPlanes = this.text._content_clips?this.text._content_clips.concat(this.content_clips):this.content_clips;
        }
        let carret = this.carret.getObject3D('mesh') as Mesh;
        if(carret){
            (carret.material as any).clipShadows = true;
            (carret.material as any).needsUpdate = true;
            (carret.material as any).clippingPlanes = this.text._content_clips?this.text._content_clips.concat(this.content_clips):this.content_clips;
        }
    }
    numberOnly(e: KeyboardEvent, is_float: boolean){
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
            return true;
        }
        // Regex to allow float/int input - float inpit allows "0." for as you type numbers - need to remove on blur.
        // TODO: Need to remove trailing dot on blur to make a valid number.
        let output = this.getValue();
        if(e){
            return ((is_float?/^\d*((\.)|(\.\d+))?$/g:/^\d*?$/g).test(output+e.key));
        }

    }
    floatOnly(e: KeyboardEvent){
        return this.numberOnly(e,true);
    }
    focus(){
        if(this.isFocused)return;
        this.isFocused = true;
        this.setupCarret();
        this.setScrollClips();
        setTimeout(()=>{
            this.setValue();
            this.component.el.sceneEl!!.addEventListener('mousedown',this.blurHandler);
            this.playPauseCamera('pause');
        });
        this.backing.addEventListener('ui-mousemove',this.mousemove);
        window.addEventListener('keydown', this.keydown);
        this.component.el.sceneEl!!.addEventListener('key-select',this.keySelectAll);
        this.component.el.sceneEl!!.addEventListener('key-cut',this.keyCut);
        this.component.el.sceneEl!!.addEventListener('key-copy',this.keyCopy);
        this.component.el.sceneEl!!.addEventListener('key-paste',this.keyPaste);
        this.underline.setAttribute('height',0.008);
        this.underline.setAttribute('color','#009688');
    }
    blur(){
        if(this.chars.length&&this.chars[this.chars.length-1].char==='.'&&this.data.type==="number"){
            this.chars.pop();
            this.setValue();
        }
        this.setSelection(0,0);
        setTimeout(()=>{
            clearInterval(this.carretInterval);
            ((this.carret.getObject3D('mesh')as Mesh).material as MeshLambertMaterial).opacity = 0;
            this.isFocused = false;
        });
        this.component.el.sceneEl!!.removeEventListener('mousedown',this.blurHandler);
        this.playPauseCamera('play');
        window.removeEventListener('keydown', this.keydown);
        this.component.el.sceneEl!!.removeEventListener('key-select',this.keySelectAll);
        this.component.el.sceneEl!!.removeEventListener('key-cut',this.keyCut);
        this.component.el.sceneEl!!.removeEventListener('key-copy',this.keyCopy);
        this.component.el.sceneEl!!.removeEventListener('key-paste',this.keyPaste);
        this.ui.stoppedChanging(this.text.object3D.uuid);
        this.underline.setAttribute('height',0.005);
        this.underline.setAttribute('color','#bfbfbf');
    }
    pasteText(){
        (navigator as any).clipboard.readText()
            .then((text: string) => {
                let chars = [this.text.selectionStart, this.text.selectionLength].concat(text.split('').map(char=>({char:char})));
                Array.prototype.splice.apply(this.chars, chars as any);
                this.text.selectionStart = this.text.selectionStart+chars.length-2;
                this.text.selectionLength = 0;
                this.setValue();
            });
    }
    cutText(){
        this.copyText();
        this.chars.splice(this.text.selectionStart,this.text.selectionLength);
        this.setValue();
    }
    copyText(){
        let value = this.chars.slice(this.text.selectionStart,this.text.selectionStart+this.text.selectionLength).map((c: any)=>c.char).join("");
        (navigator as any).clipboard.writeText(value);
    }
    handleKeyboardEvent(e: KeyboardEvent){
        if(e.keyCode===13){
            this.component.el.emit('submit');
        }else if(e.keyCode===9){
            if(this.data.tabNext){
                ((this.carret.getObject3D('mesh') as Mesh).material as MeshLambertMaterial).opacity = 1;
                this.blur();
                setTimeout(()=>this.data.tabNext.focus());
            }
        }else if(e.keyCode===88&&e.ctrlKey) { //CTRL + X
            this.cutText();
        }else if(e.keyCode===67&&e.ctrlKey) { //CTRL + C
            this.copyText();
        }else if(e.keyCode===86&&e.ctrlKey) { //CTRL + V
            this.pasteText();
        }else if(e.keyCode===65&&e.ctrlKey) { //CTRL + A
            this.text.selectionStart = 0;
            this.text.selectionLength = this.chars.length;
            e.preventDefault();
            e.stopPropagation();
        }else if(e.code.indexOf('Key')>-1||e.code.indexOf('Digit')>-1||this.charsAllowed.indexOf(e.key)>-1){
            let check: boolean | undefined = true;
            switch(this.data.type){
                case "number":
                    check = this.floatOnly(e);
                    break;
                case "int":
                    console.log(this.numberOnly(e, false));
                    check = this.numberOnly(e, false);
                    break;
            }
            if(check){
                this.chars.splice(this.text.selectionStart,this.text.selectionLength,{char:e.key});
                this.text.selectionStart++;
                this.text.selectionLength = 0;
            }
            e.preventDefault();
            e.stopPropagation();
        }else if(e.keyCode===46){// Delete
            this.chars.splice(this.text.selectionStart,this.text.selectionLength||1);
            this.text.selectionStart = this.text.selectionStart>this.chars.length?this.chars.length:this.text.selectionStart;
            this.text.selectionLength = 0;
            e.preventDefault();
            e.stopPropagation();
        }else if(e.keyCode===39){
            if(!e.shiftKey){
                if(this.text.selectionLength){
                    this.text.selectionStart+=this.text.selectionLength;
                }else{
                    this.text.selectionStart++;
                }
                this.text.selectionLength = 0;
                if(this.text.selectionStart>this.chars.length)this.text.selectionStart = this.chars.length;
                delete this.shiftStartPos
            }else{
                if(!this.shiftStartPos){
                    this.shiftStartPos = this.text.selectionStart;
                }
                if(this.text.selectionStart<this.shiftStartPos!!){
                    this.text.selectionStart++;
                    this.text.selectionLength=Math.abs(this.shiftStartPos!!-this.text.selectionStart);
                }else{
                    this.text.selectionLength++;
                }

            }
            e.preventDefault();
            e.stopPropagation();
        }else if(e.keyCode===37){
            if(!e.shiftKey) {
                if (!this.text.selectionLength) {
                    this.text.selectionStart--;
                }
                this.text.selectionLength = 0;
                if (this.text.selectionStart < 0) this.text.selectionStart = 0;
                delete this.shiftStartPos
            }else{
                if(!this.shiftStartPos){
                    this.shiftStartPos = this.text.selectionStart;
                }
                if(this.text.selectionStart+this.text.selectionLength>this.shiftStartPos!!){
                    this.text.selectionLength--;
                }else{
                    this.text.selectionStart--;
                    this.text.selectionLength=Math.abs(this.shiftStartPos!!-this.text.selectionStart);
                }
            }
            e.preventDefault();
            e.stopPropagation();
        }else{
            if(this.text.selectionLength) {
                if(e.keyCode===8) {// Backspace
                    this.chars.splice(this.text.selectionStart, this.text.selectionLength  );
                    this.text.selectionLength = 0;
                }
            }else{
                if(e.keyCode===8){// Backspace
                    if(this.text.selectionStart){
                        this.chars.splice(this.text.selectionStart-1,this.text.selectionLength||1 );
                        this.text.selectionStart = this.text.selectionStart-1;
                    }
                }else if(e.keyCode===32){ // Space
                    this.chars.splice(this.text.selectionStart,0,{char:' '});
                    this.text.selectionStart++;
                }
            }

            e.preventDefault();
            e.stopPropagation();
        }

        this.component.el.emit('ui-keypress',e);
        this.setValue();
        ((this.carret.getObject3D('mesh')as Mesh).material as MeshLambertMaterial).opacity = 1;
    }
    setValue(){
        this.setScrolledValue();
        setTimeout(()=>{
            this.setCharacters();
            this.setSelection(this.text.selectionStart,this.text.selectionLength);
            this.increaseWrap();
        })
    }
    setScrolledValue(){
        let output = this.getValue();
        this.text.setAttribute('value',output);
        if(!this.chars.length){
            this.text.setAttribute('color','#bfbfbf');
            this.text.setAttribute('value',this.data.placeHolder);
        }else{
            this.text.setAttribute('value',output);
            this.text.setAttribute('color','#2f2f2f');
        }
    }
    onMousemove(e: MouseEvent){
        let currentSelection = this.getSelectionPosition(e);
        if(!this.isMoving){
            this.isMoving = true;
            this.startSelection = currentSelection;
        }
        let selection = this.getNearestGlyph(this.startSelection,currentSelection);
        this.selectionHighlight.setAttribute('scale',(selection.end-selection.start)+' 1 1');
        this.selectionHighlight.setAttribute('position',(selection.start+((selection.end-selection.start)/2))+' 0 0.0005');
        this.carret.setAttribute('position',selection.end+' 0 0.001');

    }
    setupElements(){


        this.container = document.createElement('a-entity');
        this.container.setAttribute('position',(this.data.width/2)+' 0 0');

        this.text = document.createElement('a-text');
        this.text.setAttribute('color','#2f2f2f');
        this.text.setAttribute('anchor','center');
        this.text.setAttribute('align','left');
        this.text.setAttribute('position','0 0 0.003');
        this.text.setAttribute('width',this.data.width);
        this.text.setAttribute('wrap-pixels',this.data.width*500);
        this.text.className = 'no-yoga-layout';
        this.text.setAttribute('height',this.data.height);
        this.text.setAttribute('value',this.data.value);
        this.container.appendChild(this.text);

        this.selectionHighlight = document.createElement('a-box');
        this.selectionHighlight.setAttribute('width',1);
        this.selectionHighlight.setAttribute('scale','0 1 1');
        this.selectionHighlight.setAttribute('height',0.16);
        this.selectionHighlight.setAttribute('depth',0.00001);
        this.selectionHighlight.setAttribute('transparent',true);
        this.selectionHighlight.className = 'no-yoga-layout';
        this.selectionHighlight.setAttribute('color','#009688');
        this.selectionHighlight.setAttribute('shader','flat');
        this.selectionHighlight.setAttribute('opacity',0.3);
        this.selectionHighlight.setAttribute('position','0 0 0.0005');
        this.text.appendChild(this.selectionHighlight);

        this.carret = document.createElement('a-box');
        this.carret.setAttribute('width',0.01);
        this.carret.setAttribute('height',0.12);
        this.carret.setAttribute('depth',0.00001);
        this.carret.setAttribute('transparent',true);
        this.carret.setAttribute('opacity',0);
        this.carret.setAttribute('shader','flat');
        this.carret.className = 'no-yoga-layout';
        this.carret.setAttribute('color','#009688');
        this.carret.setAttribute('position',-(this.data.width/2)+' 0 0.001');
        this.text.appendChild(this.carret);


        this.backing = document.createElement('a-box');
        this.backing.className = 'intersectable no-yoga-layout text-backing';
        this.backing.setAttribute('width',this.data.width+0.1);
        this.backing.setAttribute('height',this.data.height);
        this.backing.setAttribute('depth',0.00001);
        this.backing.setAttribute('color',this.data.backgroundColor);
        this.backing.setAttribute('shader','flat');
        this.container.appendChild(this.backing);



        this.underline = document.createElement('a-box');
        this.underline.setAttribute('width',this.data.width);
        this.underline.setAttribute('height',0.005);
        this.underline.setAttribute('depth',0.00001);
        this.underline.className = 'no-yoga-layout';
        this.underline.setAttribute('shader','flat');
        this.underline.setAttribute('color','#bfbfbf');
        this.underline.setAttribute('position','0 -0.072 0.001');
        this.container.appendChild(this.underline);

        this.component.el.appendChild(this.container);


    }
    setupCarret(){
        let material = ((this.carret.getObject3D('mesh') as Mesh).material as MeshLambertMaterial);
        this.carretInterval = setInterval(()=>{
            material.opacity = material.opacity?0:1;
            this.ui.isChanging(this.component.el.sceneEl,this.text.object3D.uuid);
        },350);
    }
    value(text: string){
        if(text||text===""){
            this.chars = text.split('').map(char=>({char:char}));
            this.text.selectionStart = this.chars.length;
            this.setValue();
            // set value
        }else{
            return this.chars.map((c: any)=>c.char).join('');
        }
    }
    getValue(){
        let output = '';
        for(let i = 0; i < this.chars.length; i++){
            output+=this.data.type==="password"?'*':this.chars[i].char;
        }
        return output;
    }
    getSelectionPosition(e: MouseEvent){
        this.component.el.object3D.updateMatrixWorld(false);
        return this.text.object3D.worldToLocal((e.detail as any).intersection.point.clone()).x
    }
    playPauseCamera(method: string){
        let el = this.data.cameraEl;
        if (el&&el.components[this.data.lookControlsComponent]) {
            el.components[this.data.lookControlsComponent][method]();
        }

        if(this.data.rigEl){
            el = this.data.rigEl
        }

        if(el&&el.components[this.data.wasdControlsComponent]) {
            el.components[this.data.wasdControlsComponent][method]();
        }
    }
    setCharacters(){
        this.positions = new Array<number>();
        let child = this.text.object3D.children[this.text.object3D.children.length-1];
        if(!this.chars.length||!child)return;
        let glyphs = child.geometry.layout.glyphs;
        let scale = child.scale.x;
        let lastPosition = 0;
        for(let i = 0; i < glyphs.length; i++){
            let glyph = glyphs[i];
            if(!this.chars[i]){
                console.log(glyphs.length,this.chars.length);
            }
            let currentWidth = (this.chars[i].char===' '?20:glyph.data.width);
            let current = (((glyph.position[0]+currentWidth+glyph.position[1])*scale)+0.08);
            if(i===0){
                lastPosition = (((glyph.position[0]+glyph.position[1])*scale)+0.08)
            }
            if(!this.chars[i].id){
                this.chars[i].id=glyph.data.id;
                this.chars[i].width = current-lastPosition;
            }
            this.chars[i].left = lastPosition;
            lastPosition = current;
        }
    }
    getNearestGlyph(startPosition: number,endPosition: number){
        let width = Number(this.text.getAttribute('width'));
        let parentWidth = this.data.width;
        if(endPosition<startPosition){
            let tempPosition = endPosition;
            endPosition = startPosition;
            startPosition = tempPosition;
        }
        if(startPosition<-parentWidth/2){
            startPosition = -parentWidth/2;
        }
        if(endPosition>width-parentWidth/2){
            endPosition = width-parentWidth/2;
        }
        let startDiff = Number.POSITIVE_INFINITY;
        let endDiff = Number.POSITIVE_INFINITY;
        let output = {start:0,end:0};
        if(this.chars.length){
            for(let i = 0; i <= this.chars.length; i++){
                let position = this.chars[i===this.chars.length?i-1:i];
                let currentPosition = (i===this.chars.length?position.left+position.width:position.left)-(parentWidth)/2;
                if(Math.abs(startPosition-currentPosition)<startDiff){
                    startDiff = Math.abs(startPosition-currentPosition);
                    output.start = currentPosition;
                    this.text.selectionStart = i;
                }
                if(Math.abs(endPosition-currentPosition)<endDiff){
                    endDiff = Math.abs(endPosition-currentPosition);
                    output.end = currentPosition;
                    this.text.selectionLength = i-this.text.selectionStart;
                }
            }
        }
        return output;
    }
    setSelection(start: number,length: number){
        this.text.selectionStart = start;
        this.text.selectionLength = length;
        let right = 0,left = 0;
        for(let i = 0; i < this.chars.length; i++){
            let position = this.chars[i];
            if(i>=start&&i<start+length+1){
                let current = position.left;
                if(i===start){
                    left = current
                }
                right = current;
            }
        }
        let end = this.chars.length?this.chars[this.chars.length-1].left+this.chars[this.chars.length-1].width:0;
        if(start+length===this.chars.length){
            right = end
        }
        if(start===this.chars.length){
            left = right = end
        }
        let parentWidth = this.data.width;
        this.selectionHighlight.setAttribute('scale',(right-left)+' 1 1');
        this.selectionHighlight.setAttribute('position',(left+((right-left)/2)-((parentWidth)/2))+' 0 0.0005');
        let carretPosition = (right-((parentWidth)/2));
        this.carret.setAttribute('position',carretPosition+' 0 0.001');

        if(carretPosition>(parentWidth/2)-this.scrollOffset){
            this.scrollOffset = -(carretPosition-(parentWidth/2));
            this.text.setAttribute('position',this.scrollOffset+' 0 0.003');
        }

        if((carretPosition+parentWidth/2)<-this.scrollOffset){
            this.scrollOffset+=(-this.scrollOffset-(carretPosition+parentWidth/2));
            if(this.scrollOffset>0)this.scrollOffset=0;
            this.text.setAttribute('position',this.scrollOffset+' 0 0.003');
        }
    }
}