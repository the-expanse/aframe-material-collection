/* global AFRAME,TWEEN,THREE */
/**
 * Switch Component for aframe-material-collection. Includes a disabled state.
 * @namespace aframe-material-collection
 * @component ui-switch
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-switch', {
    schema: {
        value: {type:'boolean',default: false},
        disabled:{type:'boolean',default: false},
        progressColor:{default:'#4db6ac'},
        handleColor:{default:'#009688'},
        handleDisabledColor:{default:'#afafaf'},
        railColor:{default:'#fff'},
        switchDuration:{type:'int',default: 350},
        handleZIndex:{type:'number',default:0.01},
        intersectableClass: {default: 'intersectable'},
        width:{type:'number',default: 0.3},
        height:{type:'number',default: 0.1},
    },
    updateSchema(){
        if(this.data){
            if(this.data.disabled){
                if(this.data.value){
                    this.data.value=false;
                    this.click();
                }
            }else{
                this.click();
            }
            this.setDisabled();
        }
    },
    init() {
        this.width = 0.3;
        this.height = 0.1;
        // Setup handle circle entity.
        let handle = `
            <a-circle radius="0.055" shader="flat" color="`+this.data.handleColor+`" 
            ui-ripple="size:0.1 0.1;color:#999;fadeDelay:300;duration:500" class="`+this.data.intersectableClass+` no-yoga-layout"
            position="-0.05 0 `+this.data.handleZIndex+`" segments="6"></a-circle>`;
        this.el.insertAdjacentHTML('beforeend',handle);
        this.handleEl = this.el.lastChild;

        // Setup rail entity.
        let rail = `<a-plane width="0.15" shader="flat" height="0.05" 
            ui-rounded="borderRadius:0.025" class="`+this.data.intersectableClass+` no-yoga-layout"
            color="`+this.data.railColor+`" segments="6"></a-plane>`;
        this.el.insertAdjacentHTML('beforeend',rail);
        this.railEl = this.el.lastChild;
        // Wait for the rounded edge on the rail to load to clone the geometry for the
        // selected progress bar part of the rail
        this.railEl.addEventListener('rounded-loaded',()=>{
            this.getRailObject(this.railEl.object3D);
            this.setDisabled();
            this.click();
        });
        this.el.getValue = this.getValue.bind(this);
        this.clickHandler = e=>{
            this.data.value = !this.data.value;
            this.click();
            // Prevent default behaviour of event
            if(e.detail.preventDefault){
                e.detail.preventDefault();
            }
        };
    },
    getValue(){
        return this.data.value;
    },
    setDisabled(){
        // Add / Remove click handlers based on disabled state.
        if(this.data.disabled){
            this.handleEl.removeEventListener('mousedown',this.clickHandler);
            this.handleEl.setAttribute('color',this.data.handleDisabledColor);
        }else{
            this.handleEl.addEventListener('mousedown',this.clickHandler);
            this.handleEl.setAttribute('color',this.data.handleColor);
        }
    },
    click(){
        // Emit the current selected value
        this.el.emit('ui-switch-changed',this.data.value);
        // Animate the switch handle and the progress bar.
        this.tweenHandle();
        this.tweenProgress();
    },
    getRailObject(object){
        // Get the rounded shape geomtery.
        object.traverse(child=>{
            if(child.geometry&&child.geometry.type==="ShapeBufferGeometry"){
                this.progress = new THREE.Mesh(child.geometry.clone(),new THREE.MeshBasicMaterial({color:this.data.progressColor}));
                this.progress.position.set(-0.075,0,0.001);
                this.progress.scale.set(0.00001,1,1);
                this.el.object3D.add(this.progress);
            }
        });
    },
    tweenProgress(){
        if(this.progress){
            new TWEEN.Tween(this.progress.position)
                .to(new THREE.Vector3(this.data.value?0:-0.075,0,0.001), this.data.switchDuration)
                .easing(TWEEN.Easing.Exponential.Out).start();
            new TWEEN.Tween(this.progress.scale)
                .to(new THREE.Vector3(this.data.value?1:0.00001,1,1), this.data.switchDuration)
                .easing(TWEEN.Easing.Exponential.Out).start();
        }
    },
    tweenHandle(){
        if(this.handleEl){
            // Start changes
            UI.utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
            new TWEEN.Tween(this.handleEl.object3D.position)
                .to(new THREE.Vector3(this.data.value?0.05:-0.05,0,this.data.handleZIndex), this.data.switchDuration)
                .onComplete(()=>{
                    // Stop changes
                    UI.utils.stoppedChanging(this.el.object3D.uuid);
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        }
    }
});