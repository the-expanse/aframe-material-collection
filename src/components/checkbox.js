/* global AFRAME,TWEEN */
/**
 * Checkbox Component for aframe-material-collection. Includes animation and disabled state.
 * @namespace aframe-material-collection
 * @component ui-checkbox
 * @author Shane Harris
 */

module.exports = AFRAME.registerComponent('ui-checkbox', {
    schema: {
        value: {type:'boolean',default: false},
        selectedColor: {default: '#009688'},
        unselectedColor: {default: '#7f7f7f'},
        disabledColor: {default: '#afafaf'},
        indeterminate: {type:'boolean',default: false},
        disabled:{type:'boolean',default: false}
    },
    init() {
        this.width = 0.3;
        this.height = 0.3;
        this.container = document.createElement('a-entity');
        this.container.setAttribute('class','no-yoga-layout');
        this.el.appendChild(this.container);
        this.setupLines();
        // Add backing element to make the whole object clickable.
        let backing = document.createElement('a-plane');
        backing.setAttribute('width',0.21);
        backing.setAttribute('height',0.21);
        backing.setAttribute('position','0 0 -0.002');
        backing.setAttribute('shader','flat');
        backing.setAttribute('class','intersectable no-yoga-layout');
        backing.setAttribute('transparent',true);
        // Zero opacity seems to disable click event.
        backing.setAttribute('opacity',0.00000001);
        this.el.appendChild(backing);
        //
        this.clickHandler = ()=>{
            this.data.value = !this.data.value;
            this.click();
        };
        // Setup initial state
        this.setSelected();
        this.setDisabled();
        this.setTransform(1);
    },
    updateSchema(){
        if(this.data){
            this.setDisabled();
            if(this.data.disabled){
                if(this.data.value){
                    this.data.value=false;
                    this.data.indeterminate=false;
                    this.click();
                }
            }else{
                this.click();
            }
        }
    },
    setTransform(x){
        // Adjust position and rotation based on the interpolated value x between 0 and 1.
        // Used to offset the checkbox when in a checked state
        if(this.data.value){
            this.container.object3D.rotation.set(0,0,(-Math.PI/4)*x);
            this.container.object3D.position.set(-0.05*x,0.1*x,0);
        }else{
            this.container.object3D.rotation.set(0,0,-Math.PI/4+((Math.PI/4)*x));
            this.container.object3D.position.set(0.05-(0.05*x),0.1-(0.1*x),0);
        }
    },
    click(){
        // Reset indeterminate state on click
        this.data.indeterminate = false;
        // Hide / Show left and top lines for checked state, or right line aswell for intermediate state.
        this.setSelected();
        // run animation
        this.animateSelected()
    },
    animateSelected(){
        let _this = this;
        new TWEEN.Tween({x:0})
            .to({ x: 1}, 200)
            .onUpdate(function(){
                _this.setTransform(this.x);
            })
            .easing(TWEEN.Easing.Exponential.Out).start();
    },
    setSelected(){
        // Hide / Show lines that make up checkbox based on the current state.
        if(this.data.value){
            this.topLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.leftLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('position','0.05 -0.1 0');
            this.rightLine.setAttribute('position','0.1 0 0');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('height',0.1);
            this.bottomLine.setAttribute('color',this.data.selectedColor);
            this.rightLine.setAttribute('color',this.data.selectedColor);
        }else if(this.data.indeterminate){
            this.topLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.leftLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','0.000001 0.000001 0.000001');
            this.bottomLine.setAttribute('position','0 0 0');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('height',0.2);
            this.bottomLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.unselectedColor);
        }else{
            this.topLine.setAttribute('scale','1 1 1');
            this.leftLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('scale','1 1 1');
            this.rightLine.setAttribute('scale','1 1 1');
            this.bottomLine.setAttribute('height',0.2);
            this.leftLine.setAttribute('position','-0.1 0 0');
            this.rightLine.setAttribute('position','0.1 0 0');
            this.topLine.setAttribute('position','0 0.1 0');
            this.bottomLine.setAttribute('position','0 -0.1 0');
            this.topLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('rotation','0 0 90');
            this.bottomLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.unselectedColor);
        }
    },
    setupLines(){
        // Add four lines to make a square wireframe
        this.leftLine = this.line(true);
        this.rightLine = this.line(true);
        this.topLine = this.line(true);
        this.bottomLine = this.line(true);
        this.container.appendChild(this.topLine);
        this.container.appendChild(this.leftLine);
        this.container.appendChild(this.bottomLine);
        this.container.appendChild(this.rightLine);
    },
    setDisabled(){
        // Check and set the disabled state of the checkbox - add / remove click handler.
        if(this.data.disabled){
            this.el.removeEventListener('click',this.clickHandler);
            this.topLine.setAttribute('color',this.data.disabledColor);
            this.leftLine.setAttribute('color',this.data.disabledColor);
            this.rightLine.setAttribute('color',this.data.disabledColor);
            this.bottomLine.setAttribute('color',this.data.disabledColor);
        }else{
            this.el.addEventListener('click',this.clickHandler);
            this.topLine.setAttribute('color',this.data.unselectedColor);
            this.leftLine.setAttribute('color',this.data.unselectedColor);
            this.rightLine.setAttribute('color',this.data.value?this.data.selectedColor:this.data.unselectedColor);
            this.bottomLine.setAttribute('color',this.data.value?this.data.selectedColor:this.data.unselectedColor);
        }
    },
    line(is_vertical){
        // Create horizontal/vertical line.
        let line = document.createElement('a-plane');
        line.setAttribute('width',is_vertical?0.02:0.21);
        line.setAttribute('height',is_vertical?0.21:0.02);
        line.setAttribute('class','no-yoga-layout');
        line.setAttribute('shader','flat');
        return line;
    }
});