/* global AFRAME,TWEEN */
/**
 * Button base Component for aframe-material-collection. This is used as the base component for all the button primitives.
 * @namespace aframe-material-collection
 * @component ui-btn
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-btn', {
    schema:{
        duration:{type:'int',default:250},
        hoverHeight:{type:'number',default:0.01},
        activeHeight:{type:'number',default:-0.001},
        disabled:{type:'boolean',default:false}
    },
    updateSchema(){
      // TODO: handle updates to the button state, disabled flag here.
    },
    init() {
        // Store the current button z value for animating mouse events
        this.defaultZ = this.el.object3D.position.z;
        // register input events for interaction
        if(!this.data.disabled){
            this.el.addEventListener('mouseenter', e=>this.mouseEnter(e));
            this.el.addEventListener('mousedown', e=>this.mouseDown(e));
            this.el.addEventListener('mouseup', e=>this.mouseUp(e));
            this.el.addEventListener('mouseleave', e=>this.mouseLeave(e));
        }
    },
    mouseEnter(e){
        const _this = this;
        // Lift the button up for hover animation
        this.tween(this.defaultZ,this.defaultZ+this.data.hoverHeight,function(){
            _this.el.object3D.position.z = this.x;
        },function(){
            _this.el.object3D.position.z = _this.defaultZ+_this.data.hoverHeight;
        });
        //UI.utils.preventDefault(e)
    },
    mouseLeave(e){
        // Ignore mouse leave event if the button was clicked - mouse up already resets to default state.
        if(this.is_clicked){
            return this.is_clicked = false;
        }
        // Reset button state from hover
        this.resetAnimation(this.defaultZ+this.data.hoverHeight);
        //UI.utils.preventDefault(e)
    },
    mouseUp(e){
        this.is_clicked = true;
        // Reset button state from pressed
        this.resetAnimation(this.defaultZ+this.data.activeHeight);
        UI.utils.preventDefault(e)
    },
    mouseDown(e){
        const _this = this;
        // Press state animation from hovered
        this.tween(this.defaultZ+this.data.hoverHeight,this.defaultZ+this.data.activeHeight,function(){
            _this.el.object3D.position.z = this.x;
        },function(){
            _this.el.object3D.position.z = _this.defaultZ+_this.data.activeHeight;
        });
        UI.utils.preventDefault(e)
    },
    resetAnimation(start_z){
        let _this = this;
        this.tween(start_z,this.defaultZ,function(){
            _this.el.object3D.position.z = this.x;
        },function(){
            _this.el.object3D.position.z = _this.defaultZ;
        })
    },
    tween(from,to,callback,complete){
        let _this = this;
        // Start changes
        UI.utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
        return new TWEEN.Tween({x:from})
            .to({ x: to}, this.data.duration)
            .onUpdate(callback)
            .onComplete(function(){
                // Stop changes
                UI.utils.stoppedChanging(_this.el.object3D.uuid)
                return complete.call(this);
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    }
});