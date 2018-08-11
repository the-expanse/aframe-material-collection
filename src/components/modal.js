/* global AFRAME,THREE */
/**
 * Modal Component for aframe-material-collection.
 * @namespace aframe-material-collection
 * @component ui-modal
 * @author Shane Harris
 */
module.exports = AFRAME.registerComponent('ui-modal', {
    schema: {
        modal:{type:'selector'},
        main:{type:'selector'}
    },
    init(){
        if(this.el.components['ui-modal'].isInit)return;
        if(this.data.modal&&this.data.main){
            // Get the modal panel to be able to animate its scale on open/close.
            this.modalPanel = document.querySelector(this.data.modal.getAttribute('ui-panel'));

            let mainComponents = this.data.main.components;
            let modalComponents = this.data.modal.components;
            // Pause rendering of modal until opened.
            if(modalComponents&&modalComponents['ui-renderer']){
                modalComponents['ui-renderer'].pause();
            }
            // Setup close listeners for anything with the class close-modal.
            let close_buttons = this.data.modal.querySelectorAll('.close-modal');
            for(let i = 0; i < close_buttons.length; i++ ){
                let close_button = close_buttons[i];
                close_button.addEventListener('mousedown',()=>{
                    // Pause the modal rendering and play the main rendering again.
                    modalComponents['ui-renderer'].pause();
                    mainComponents['ui-renderer'].playRender();
                    this.tweenModalScale(1,0.0000001);
                });
            }
            // Add click handler for opening the modal, pause the main render screen and play the modal renderer
            this.el.addEventListener('mousedown',()=>{
                if(mainComponents&&mainComponents['ui-renderer']){
                    mainComponents['ui-renderer'].pauseRender();
                    this.tweenModalScale(0.0000001,1);
                    modalComponents['ui-renderer'].play();
                }
            });
        }
        this.isInit = true;
    },
    tweenModalScale(from,to){
        return new Promise(r=>{
            let _this = this;
            new TWEEN.Tween({x:from})
                .to({x:to}, 250)
                .onUpdate(function(){
                    if(_this.modalPanel)
                        _this.modalPanel.setAttribute('scale',this.x+' '+this.x+' '+this.x);
                })
                .onComplete(r)
                .easing(TWEEN.Easing.Exponential.Out).start();
        });
    }
});