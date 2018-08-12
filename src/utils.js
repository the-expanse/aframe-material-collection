export class Utils{
    constructor(){
        this.changesDetected = [];
        this.is_changeing = false;
    }
    isFirstOrLastChange(){
        if(!this.is_changeing&&this.changesDetected.length){
            this.scene.emit('ui-changing');
            this.is_changeing = true;
        }else if(this.is_changeing&&!this.changesDetected.length){
            if(this.is_changeing){
                this.scene.emit('ui-changing-stopped');
                this.is_changeing = false;
            }
        }
    }
    preventDefault(e){
        if(e.detail.preventDefault && typeof e.detail.preventDefault === "function"){
            e.detail.preventDefault();
        }
    }
    isChanging(scene,ref){
        console.warn(ref);
        let index = this.changesDetected.indexOf(ref);
        if(index===-1){
            this.scene = this.scene||scene;
            this.changesDetected.push(ref);
            this.isFirstOrLastChange();
        }
    }
    stoppedChanging(ref){
        let index = this.changesDetected.indexOf(ref);
        if(index>-1){
            this.changesDetected.splice(index, 1)
        }
        console.log(this.changesDetected,ref);
        this.isFirstOrLastChange();
    }
}