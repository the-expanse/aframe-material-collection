import UI from '../ui';
import {registerComponent} from "aframe";
import {Math as ThreeMath, Color, ShaderMaterial} from "three";
import {Utils} from "../utils";

/**
 * A component to pick a color - based on https://github.com/mokargas/aframe-colorwheel-component
 * @namespace aframe-material-collection
 * @component ui-renderer
 * @author Shane Harris
 */

export = registerComponent('ui-color-picker', {
    schema: {
        backingColor:{default:"#dfdfdf"},
        backingColorBottom:{default:"#4db6ac"},
        targetEl:{type:'selector'}
    },
    init() {
        this.setupColorWheel();
        this.setupBrightnessSlider();
        this.setupColorPreview();
        this.setupBacking();
        this.setupEvents();
        this.el.setAttribute('visible',false);
        this.el.setAttribute('scale','0.00001 0.00001 0.00001');
        // Expose methods to open/close the color picker.
        (this.el as any).open = this.open.bind(this);
        (this.el as any).close = this.close.bind(this);
    },
    open(){
        return new Promise(resolve=>{
            this.selectCallback = resolve;
            this.el.setAttribute('visible',true);
            this.tweenPickerScale(0.00001,0.5);
        });
    },
    close(){
        this.tweenPickerScale(0.5,0.00001)
            .then(()=>this.el.setAttribute('visible',false));
    },
    tweenPickerScale(from: number, to: number){
        Utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
        return new Promise(r=>{
            let _this = this;
            new TWEEN.Tween({x:from})
                .to({x:to}, 250)
                .onUpdate(function(){
                    _this.el.setAttribute('scale',this.x+' '+this.x+' '+this.x);
                })
                .onComplete(()=>{
                    Utils.stoppedChanging(this.el.object3D.uuid);
                    r();
                })
                .easing(TWEEN.Easing.Exponential.Out).start();
        });
    },
    setupBacking(){
        let circleBacking = document.createElement('a-circle');
        circleBacking.className = 'no-yoga-layout';
        circleBacking.setAttribute('position','0 0 -0.001');
        circleBacking.setAttribute('material',{
            color: this.data.backingColor,
            flatShading: true,
            shader: 'flat',
            fog: false,
            side: 'double'
        });
        circleBacking.setAttribute('radius',0.65);
        circleBacking.setAttribute('theta-length',180);

        this.el.appendChild(circleBacking);

        let planeBacking = document.createElement('a-plane');
        planeBacking.setAttribute('position','0 -0.375 -0.001');
        planeBacking.className = 'no-yoga-layout';
        planeBacking.setAttribute('material',{
            color: this.data.backingColor,
            flatShading: true,
            shader: 'flat',
            fog: false,
            side: 'double'
        });
        planeBacking.setAttribute('width',1.3);
        planeBacking.setAttribute('height',0.75);

        this.el.appendChild(planeBacking);


        let planeBackingBottom = document.createElement('a-plane');
        planeBackingBottom.setAttribute('position','0 -1.05 -0.001');
        planeBackingBottom.className = 'no-yoga-layout';
        planeBackingBottom.setAttribute('material',{
            color: this.data.backingColorBottom,
            flatShading: true,
            shader: 'flat',
            fog: false,
            side: 'double'
        });
        planeBackingBottom.setAttribute('width',1.3);
        planeBackingBottom.setAttribute('height',0.6);
        this.el.appendChild(planeBackingBottom);

        let buttonConfirm = document.createElement('a-ui-button');
        buttonConfirm.setAttribute('position','0.315 -1.17 0.001');
        buttonConfirm.className = 'intersectable no-yoga-layout';
        buttonConfirm.setAttribute('text-value','SAVE');
        buttonConfirm.setAttribute('color','#ffffff');
        buttonConfirm.setAttribute('wrap-count','9');
        buttonConfirm.setAttribute('ripple-color','#009688');
        buttonConfirm.setAttribute('font-color','#009688');
        buttonConfirm.setAttribute('ripple-size','0.5 0.18');
        buttonConfirm.setAttribute('width',0.5);
        buttonConfirm.setAttribute('height',0.18);
        if(this.data.targetEl)
            this.data.targetEl.addEventListener('mousedown',()=> {
                this.el.open();
            });
        this.el.appendChild(buttonConfirm);
        buttonConfirm.addEventListener('mousedown',e=> {
            let hex = this.getHex();
            this.el.emit('color-selected',hex);
            this.el.close();
            Utils.preventDefault(e);
            if(this.data.targetEl){
                this.data.targetEl.setAttribute('color',hex);
            }
            if(this.selectCallback&& typeof this.selectCallback === "function"){
                this.selectCallback(hex);
            }
        });

        let buttonCancel = document.createElement('a-ui-button');
        buttonCancel.setAttribute('position','-0.315 -1.17 0.001');
        buttonCancel.className = 'intersectable no-yoga-layout';
        buttonCancel.setAttribute('text-value','CANCEL');
        buttonCancel.setAttribute('color','#ffffff');
        buttonCancel.setAttribute('wrap-count','9');
        buttonCancel.setAttribute('ripple-color','#ff9800');
        buttonCancel.setAttribute('font-color','#ff9800');
        buttonCancel.setAttribute('ripple-size','0.5 0.18');
        buttonCancel.setAttribute('width',0.5);
        buttonCancel.setAttribute('height',0.18);

        this.el.appendChild(buttonCancel);
        buttonCancel.addEventListener('mousedown',e=> {
            this.el.emit('color-cancelled');
            this.el.close();
            Utils.preventDefault(e);
        });
        this.hexValue = document.createElement('a-text');
        this.hexValue.setAttribute('value','#ffffff');
        this.hexValue.setAttribute('align','center');
        this.hexValue.setAttribute('position','0 -0.9 0.001');
        this.hexValue.setAttribute('wrap-count',15);
        this.hexValue.setAttribute('width',1.3);

        this.el.appendChild(this.hexValue);
    },
    setupColorPreview(){
        this.colorPreview = document.createElement('a-circle');
        this.colorPreview.setAttribute('position','-0.45 -0.9 0');
        this.colorPreview.setAttribute('material',{
            color: '#ffffff',
            flatShading: true,
            transparent: true,
            shader: 'flat',
            fog: false,
            side: 'double'
        });
        this.colorPreview.setAttribute('radius',0.05);
        this.el.appendChild(this.colorPreview);
    },
    setupColorWheel(){
        this.hsv = {
            h: 0.0,
            s: 0.0,
            v: 1.0
        };
        this.colorWheel = document.createElement('a-circle');
        this.colorWheel.setAttribute('material',{
            color: '#ffffff',
            flatShading: true,
            transparent: true,
            shader: 'flat',
            fog: false,
            side: 'double'
        });
        this.colorWheel.setAttribute('radius',0.5);
        this.el.appendChild(this.colorWheel);
        this.colorWheel.className = 'intersectable no-yoga-layout';
        this.colorWheel.addEventListener('loaded',()=>{
            let colorWheel = this.colorWheel.getObject3D('mesh');
            let vertexShader = '\n\n      varying vec2 vUv;\n      void main() {\n        vUv = uv;\n        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n        gl_Position = projectionMatrix * mvPosition;\n      }\n    ';

            let fragmentShader = '\n      #define M_PI2 6.28318530718\n      uniform float brightness;\n      varying vec2 vUv;\n      vec3 hsb2rgb(in vec3 c){\n          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0 );\n          rgb = rgb * rgb * (3.0 - 2.0 * rgb);\n          return c.z * mix( vec3(1.0), rgb, c.y);\n      }\n\n      void main() {\n        vec2 toCenter = vec2(0.5) - vUv;\n        float angle = atan(toCenter.y, toCenter.x);\n        float radius = length(toCenter) * 2.0;\n        vec3 color = hsb2rgb(vec3((angle / M_PI2) + 0.5, radius, brightness));\n        gl_FragColor = vec4(color, 1.0);\n      }\n      ';

            colorWheel.material = new ShaderMaterial({
                uniforms: {
                    brightness: {
                        type: 'f',
                        value: this.hsv.v
                    }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            });
            colorWheel.material.needsUpdate = true;
        })
    },
    setupBrightnessSlider(){
        this.brightnessSlider = document.createElement('a-plane');
        this.brightnessSlider.setAttribute('height',0.1);
        this.brightnessSlider.setAttribute('width',0.8);
        this.brightnessSlider.setAttribute('position','0 -0.6 0');
        this.brightnessSlider.className = 'intersectable no-yoga-layout';
        this.el.appendChild(this.brightnessSlider);
        this.brightnessSlider.addEventListener('loaded',()=>{

            let vertexShader = '\n      varying vec2 vUv;\n      void main(){\n        vUv = uv;\n        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);\n      }\n    ';

            let fragmentShader = '\n      uniform vec3 color1;\n      uniform vec3 color2;\n      varying vec2 vUv;\n\n      void main(){\n        vec4 c1 = vec4(color1, 1.0);\n  \t    vec4 c2 = vec4(color2, 1.0);\n\n        vec4 color = mix(c2, c1, smoothstep(0.0, 1.0, vUv.x));\n        gl_FragColor = color;\n      }\n    ';


            this.brightnessSlider.getObject3D('mesh').material = new ShaderMaterial({
                uniforms: {
                    color1: {
                        type: 'c',
                        value: new Color(0xFFFFFF)
                    },
                    color2: {
                        type: 'c',
                        value: new Color(0x000000)
                    }
                },
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            });
            this.brightnessSlider.getObject3D('mesh').material.needsUpdate = true;
        });
        let brightnessResetLeft = document.createElement('a-triangle');
        brightnessResetLeft.setAttribute('vertex-a','0 0.05 0');
        brightnessResetLeft.setAttribute('vertex-b','-0.05 -0.05 0');
        brightnessResetLeft.setAttribute('vertex-c','0.05 -0.05 0');
        brightnessResetLeft.setAttribute('position','-0.475 -0.6 0');
        brightnessResetLeft.setAttribute('rotation','0 0 90');
        brightnessResetLeft.setAttribute('shader','flat');
        brightnessResetLeft.setAttribute('color','#009688');
        brightnessResetLeft.setAttribute('ui-btn','');
        brightnessResetLeft.className = 'intersectable';
        this.el.appendChild(brightnessResetLeft);


        let brightnessResetRight = document.createElement('a-triangle');
        brightnessResetRight.setAttribute('vertex-a','0 0.05 0');
        brightnessResetRight.setAttribute('vertex-b','-0.05 -0.05 0');
        brightnessResetRight.setAttribute('vertex-c','0.05 -0.05 0');
        brightnessResetRight.setAttribute('position','0.475 -0.6 0');
        brightnessResetRight.setAttribute('rotation','0 0 -90');
        brightnessResetRight.setAttribute('color','#009688');
        brightnessResetRight.setAttribute('shader','flat');
        brightnessResetRight.setAttribute('ui-btn','');
        brightnessResetRight.className = 'intersectable';
        this.el.appendChild(brightnessResetRight);

        brightnessResetLeft.addEventListener('mousedown',()=>{

            Utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
            this.colorWheel.getObject3D('mesh').material.uniforms['brightness'].value = 0;
            this.hsv.v = 0;
            this.hsv.h = 0;
            this.hsv.s = 0;
            this.updateColor();
            Utils.stoppedChanging(this.el.object3D.uuid);
        });
        brightnessResetRight.addEventListener('mousedown',()=>{

            Utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
            this.colorWheel.getObject3D('mesh').material.uniforms['brightness'].value = 1;
            this.hsv.v = 1;
            this.hsv.h = 0;
            this.hsv.s = 0;
            this.updateColor();
            Utils.stoppedChanging(this.el.object3D.uuid);
        });
    },
    getHex(){
        let rgb = this.hsvToRgb(this.hsv),
            color = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
        return '#' + new Color(color).getHexString()
    },
    updateColor(){
        let hex = this.getHex();
        this.colorPreview.setAttribute('color',hex);
        this.hexValue.setAttribute('value',hex);
    },
    setupEvents(){
        this.colorWheel.addEventListener('mousedown', (e: MouseEvent)=>{
            this.isMouseDown = true;
            Utils.preventDefault(e);
        });
        this.colorWheel.addEventListener('mouseup',(e: MouseEvent)=>{
            console.log('mouseup on color picker');
            this.isMouseDown = false;
            Utils.preventDefault(e);
        });
        this.colorWheel.addEventListener('ui-mousemove',(e: MouseEvent)=>{
            if(!this.isMouseDown)return;
            Utils.preventDefault(e);

            Utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
            let colorWheel = this.colorWheel.getObject3D('mesh'),
                radius = 0.5,
                position = (e.detail as any).intersection.point;

            colorWheel.updateMatrixWorld();
            colorWheel.worldToLocal(position);

            //Determine Hue and Saturation value from polar co-ordinates
            let polarPosition = {
                r: Math.sqrt(position.x * position.x + position.y * position.y),
                theta: Math.PI + Math.atan2(position.y, position.x)
            };

            let angle = (polarPosition.theta * (180 / Math.PI) + 180) % 360;
            this.hsv.h = angle / 360;
            this.hsv.s = polarPosition.r / radius;
            this.updateColor();
            Utils.stoppedChanging(this.el.object3D.uuid);
        });
        this.brightnessSlider.addEventListener('mousedown',(e: MouseEvent)=>{
            this.isMouseDown = true;
            Utils.preventDefault(e);
        });
        this.brightnessSlider.addEventListener('mouseup',(e: MouseEvent)=>{
            this.isMouseDown = false;
            Utils.preventDefault(e);
        });
        this.brightnessSlider.addEventListener('ui-mousemove',(e: MouseEvent)=>{

            Utils.preventDefault(e);
            Utils.isChanging(this.el.sceneEl,this.el.object3D.uuid);
            if(!this.isMouseDown)return;
            let brightnessSlider = this.brightnessSlider.getObject3D('mesh'),
                colorWheel = this.colorWheel.getObject3D('mesh'),
                position = (e.detail as any).intersection.point;

            brightnessSlider.updateMatrixWorld();
            brightnessSlider.worldToLocal(position);

            //Brightness is a value between 0 and 1. The parent plane is centre registered, hence offset
            let cursorOffset = position.x + 0.4;//this.brightnessSliderHeight / 2;
            let brightness = cursorOffset / 0.8;//this.brightnessSliderHeight;

            //Update material brightness
            colorWheel.material.uniforms['brightness'].value = brightness;
            this.hsv.v = brightness;
            this.updateColor();
            Utils.stoppedChanging(this.el.object3D.uuid);
        });
    },
    hsvToRgb(hsv: any) {
        let r, g, b, i, f, p, q, t;
        let h = ThreeMath.clamp(hsv.h, 0, 1);
        let s = ThreeMath.clamp(hsv.s, 0, 1);
        let v = hsv.v;

        i = Math.floor(h * 6);
        f = h * 6 - i;
        p = v * (1 - s);
        q = v * (1 - f * s);
        t = v * (1 - (1 - f) * s);
        switch (i % 6) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
});

