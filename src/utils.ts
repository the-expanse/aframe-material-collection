import {Scene} from "aframe";
import {Mesh, Object3D} from "three";

export class Utils{
    changesDetected: any = {};
    is_changeing: boolean = false;
    scene: Scene | undefined;


    constructor(){
        // setInterval(()=>{
        //     let now = new Date().getTime();
        //     for(let key in this.changesDetected){
        //         let change = this.changesDetected[key];
        //         if(change.t&&now-change.t>2000){
        //             this.stoppedChanging(key);
        //         }
        //     }
        // },2000);
    }
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
    /*getPointInBetweenByPerc(pointA, pointB, percentage) {

        var dir = pointB.clone().sub(pointA);
        var len = dir.length();
        dir = dir.normalize().multiplyScalar(len*percentage);
        return pointA.clone().add(dir);

    }*/
    preventDefault(e: any){
        if(e.detail && e.detail.preventDefault && typeof e.detail.preventDefault === "function"){
            e.detail.preventDefault();
        }
    }
    shorten(string: string, length: number){
        return string.length>length?string.substr(0,length)+"...":string;
    }
    /*uniqueNumberedName(newName: string,names: Array<string>, key: string){
        let currentNumber = 0;
        let nameLessNumber = newName;
        for(let i = 0; i < names.length; i++){
            let name;
            if(key){
                name = names[i][key].split('~#');
            }else{
                name = names[i].split('~#');
            }
            let existingNumber = name.length>1?Number(name.pop()):0;
            existingNumber = existingNumber || 0;
            nameLessNumber = name.join('');
            if(newName===nameLessNumber&&existingNumber>currentNumber){
                currentNumber = existingNumber;
            }
        }
        if(currentNumber>0){
            newName+="~# "+(currentNumber+1)
        }
        return newName;
    }*/
    /*ucFirst(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    zeroPad(number,length){
        return ("0000000"+number).slice(-length);
    }*/
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
    /*copyToClipboard(text: string){
        navigator.clipboard.writeText(text).then(()=>{
        },(err: Error)=> {
            console.error('copy to clipboard failed:', err);
        });
    }*/
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