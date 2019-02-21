/* global AFRAME,TWEEN */
/**
 * Radio Component for aframe-material-collection. Resets other radio buttons siblings and includes a disabled state.
 * @namespace aframe-material-collection
 * @component ui-radio
 * @author Shane Harris
 */
import AFRAME from "aframe";
import THREE from "three";
import UI from '../ui';

export = AFRAME.registerComponent('ui-radio', {
    width: 0,
    height: 0,
    filled_circle: undefined as any as AFRAME.Entity | null,
    isRippling: false,
    isSelecting: false,
    schema: {
        value: {default: ''},
        selected:{type: 'boolean', default: false},
        selectedColor: {default: '#009688'},
        selectedRadius: {type:'number',default: 0.045},
        unselectedColor: {default: '#5f5f5f'},
        disabledColor: {default: '#afafaf'},
        disabled: {type: 'boolean', default: false},
        intersectableClass: {default: 'intersectable'},
        width:{type:'number',default: 0.15},
        height:{type:'number',default: 0.15},
    },
    init() {
        this.width = 0.15;
        this.height = 0.15;
        // Create center circle for checked state.
        this.el.addEventListener('loaded',()=>{

            let handle = `
            <a-circle radius="`+this.data.selectedRadius+`" color="`+(this.data.disabled?this.data.disabledColor:this.data.selectedColor)+`" 
            position="0 0 0" scale="0 0 0" shader="flat" class="no-yoga-layout" segments="6"></a-circle>`;
            this.el.insertAdjacentHTML('beforeend',handle);
            this.filled_circle = this.el.lastChild as AFRAME.Entity | null;
            (this.el.components.material as any).material.color = new THREE.Color(this.data.disabled?this.data.disabledColor:this.data.unselectedColor);

            // Create backing for getting click events.
            let backing = `
            <a-circle radius="`+this.data.selectedRadius+`" position="0 0 -0.002" opacity="0.0001" transparent="true" 
            shader="flat" class="`+this.data.intersectableClass+` no-yoga-layout" segments="6"></a-circle>`;
            this.el.insertAdjacentHTML('beforeend',backing);
            // Set this if it is checked.
            if(this.data.selected){
                this.filled_circle!!.addEventListener('loaded',()=>{
                    this.click();
                });
            }
            // TODO: need to add play/pause methods for registering/unregistering events.
            if(!this.data.disabled){
                this.el.addEventListener('mousedown',e => (this.click as any)(e));
            }
        });
    },
    deselect(){
        // Deselect this radio with a scale animation on the circle.
        this.el.setAttribute('selected',false);
        let _this = this;
        // Start changes
        UI.utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
        new TWEEN.Tween({x:1})
            .to({ x: 0.000001}, 200)
            .onUpdate(function(){
                _this.filled_circle!!.object3D.scale.set(this.x,this.x,this.x);
            })
            .onComplete(()=>{
                // Stop changes
                UI.utils.stoppedChanging(_this.el.object3D.uuid);
                this.isRippling = false;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    },
    click(){
        // Get all other radio siblings and reset their state if they are selected.
        [].slice.call(this.el.parentNode!!.querySelectorAll('a-ring,a-ui-radio')).filter(el=>el!==this.el).forEach((ring: AFRAME.Entity)=>{
            if(ring.components['ui-radio']&&ring.getAttribute('selected')==="true"){
                (ring.components['ui-radio'] as any).deselect();
            }
        });
        // Emit the current selected value
        this.el.emit('ui-radio-changed',this.data.value);
        // Set this radio's selected state.
        this.el.setAttribute('selected',true);
        // Throttle animations.
        if(this.isSelecting)return;
        this.isSelecting = true;
        let _this = this;
        // Start changes
        UI.utils.isChanging(this.el.sceneEl,this.filled_circle!!.object3D.uuid);
        new TWEEN.Tween({x:0.000001})
            .to({ x: 1}, 250)
            .onUpdate(function(){
                _this.filled_circle!!.object3D.scale.set(this.x,this.x,this.x);
            })
            .onComplete(()=>{
                // Stop changes
                UI.utils.stoppedChanging(this.filled_circle!!.object3D.uuid);
                this.isSelecting = false;
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
});