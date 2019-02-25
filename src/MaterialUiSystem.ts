import {Scene, System} from "aframe";
import {AbstractSystemController} from "aframe-typescript-boilerplate/built/system/AbstractSystemController";
import {registerComponentController, SystemControllerDefinition} from "aframe-typescript-boilerplate/built";

import './primitives/button';
import './primitives/fab_button';
import './primitives/switch';
import './primitives/slider';
import './primitives/number';
import './primitives/toast';
import './primitives/checkbox';
import './primitives/radio';
import './primitives/input-text';
import './primitives/text-input';
import './primitives/number-input';
import './primitives/int-input';
import './primitives/password-input';
import './primitives/scroll-pane';
import './primitives/renderer';

export class MaterialUiSystem extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "material-ui",
        {},
        (system: System, scene: Scene, data: any) =>
            new MaterialUiSystem(system, scene, data)
    );

    constructor(system: System, scene: Scene, data: any) {
        super(system, scene, data);
    }

    init(): void {
        console.log("material ui system init.")
    }

    pause(): void {
    }

    play(): void {
    }

    tick(time: number, timeDelta: number): void {
    }



    changesDetected: any = {};
    is_changeing: boolean = false;
    scene: Scene = undefined as any as Scene;


    isFirstOrLastChange(){
        let empty = true;

        for(let key in this.changesDetected) {
            empty = false;
            break;
        }

        if(!this.is_changeing&&!empty){
            this.scene!!.emit('ui-changing');
            this.is_changeing = true;
        }else if(this.is_changeing&&empty){
            if(this.is_changeing){
                this.scene!!.emit('ui-changing-stopped');
                this.is_changeing = false;
            }
        }
    }

    preventDefault(e: any){
        if(e.detail && e.detail.preventDefault && typeof e.detail.preventDefault === "function"){
            e.detail.preventDefault();
        }
    }

    shorten(string: string, length: number){
        return string.length>length?string.substr(0,length)+"...":string;
    }

    isChanging(scene: Scene | undefined, ref: string){
        let index = this.changesDetected[ref];
        if(!index){
            this.scene = this.scene||scene;
            let now = new Date().getTime();
            this.changesDetected[ref] = {t:now,e:new Error().stack};
            this.isFirstOrLastChange();
        }else{
            this.changesDetected[ref].t = new Date().getTime();
        }
    }

    stoppedChanging(ref: string){
        delete this.changesDetected[ref];
        this.isFirstOrLastChange();
    }

    clearObject(object: any){
        object.traverse((child: any) =>{
            if(child.material) {
                if(child.material.length){
                    for(let i =0; i < child.material.length; i++){
                        if(child.material[i].map){
                            child.material[i].map.dispose();
                        }
                        child.material[i].dispose();
                    }
                }else{
                    if(child.material.map){
                        child.material.map.dispose();
                    }
                    child.material.dispose();
                }
            }
            if(child.geometry){
                child.geometry.dispose();
            }
        });
    }

}