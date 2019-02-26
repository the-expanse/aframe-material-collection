import {Entity, registerComponent} from "aframe";

/**
 * A component to load an icon and set some defaults for positioning and transparency.
 * @namespace aframe-material-collection
 * @component ui-icon
 * @author Shane Harris
 */
export = registerComponent('ui-icon', {
    icon: undefined as any as Entity,
    schema: {
        src: {default: 'icons/send_white_64dp.png'},
        spriteCoords:{type:'vec4'},
        size:{type:'vec2',default:{x:0.1,y:0.1}},
        zIndex:{type:'number',default:0.003},
        color:{default:'#fff'}
    },
    init() {
        this.icon = document.createElement('a-entity');
        this.icon.className = 'no-yoga-layout';
        this.icon.setAttribute('geometry','primitive:plane; width: '+this.data.size.x+'; height: '+this.data.size.y+';skipCache: true;');
        this.icon.setAttribute('material','shader: flat; color:'+this.data.color+';alpha-test:0.4; transparent:true;src:'+this.data.src);
        if(this.data.spriteCoords){
            this.icon.setAttribute('sprite-sheet','coords:'+this.data.spriteCoords.x+' '+this.data.spriteCoords.y+' '+this.data.spriteCoords.z+' '+this.data.spriteCoords.w+';shape:square');
        }
        this.icon.setAttribute('position',"0 0 "+this.data.zIndex);
        this.el.appendChild(this.icon);
    }
});