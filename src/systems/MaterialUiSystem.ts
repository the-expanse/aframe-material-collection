import {Scene, System} from "aframe";
import {AbstractSystemController} from "aframe-typescript-boilerplate/built/system/AbstractSystemController";
import {registerComponentController, SystemControllerDefinition} from "aframe-typescript-boilerplate/built";

export class MaterialUiSystem extends AbstractSystemController {

    public static DEFINITION = new SystemControllerDefinition(
        "material-ui",
        {},
        (system: System, scene: Scene, data: any) =>
            new MaterialUiSystem(system, scene, data)
    );

    changes: any = {};
    changing: boolean = false;

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

    isFirstOrLastChange(){
        let empty = true;

        for(let key in this.changes) {
            empty = false;
            break;
        }

        if(!this.changing&&!empty){
            this.scene!!.emit('ui-changing');
            this.changing = true;
        }else if(this.changing&&empty){
            if(this.changing){
                this.scene!!.emit('ui-changing-stopped');
                this.changing = false;
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
        let index = this.changes[ref];
        if(!index){
            let now = new Date().getTime();
            this.changes[ref] = {t:now,e:new Error().stack};
            this.isFirstOrLastChange();
        }else{
            this.changes[ref].t = new Date().getTime();
        }
    }

    stoppedChanging(ref: string){
        delete this.changes[ref];
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