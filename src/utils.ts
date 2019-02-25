import {Scene} from "aframe";

export class Utils{
    static changesDetected: any = {};
    static is_changeing: boolean = false;
    static scene: Scene | undefined;


    constructor(){
    }

    static isFirstOrLastChange(){
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

    static preventDefault(e: any){
        if(e.detail && e.detail.preventDefault && typeof e.detail.preventDefault === "function"){
            e.detail.preventDefault();
        }
    }

    static shorten(string: string, length: number){
        return string.length>length?string.substr(0,length)+"...":string;
    }

    static isChanging(scene: Scene | undefined, ref: string){
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

    static stoppedChanging(ref: string){
        delete this.changesDetected[ref];
        this.isFirstOrLastChange();
    }

    static clearObject(object: any){
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