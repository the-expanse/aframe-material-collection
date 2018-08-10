export class Utils{
    constructor(){
        this.changesDetected = {};
        this.is_changeing = false;
    }
    isFirstOrLastChange(){
        let has_none = true;
        for (let o in this.changesDetected) {
            if(!this.is_changeing){
                this.scene.emit('ui-changing');
            }
            has_none = false;
            this.is_changeing = true;
            break;
        }
        if(has_none){
            if(this.is_changeing){
                let oldAfterRender = this.scene.object3D.onAfterRender;
                this.scene.object3D.onAfterRender = ()=>{
                    this.scene.emit('ui-changing-stopped');
                    this.scene.object3D.onAfterRender = oldAfterRender;
                }
            }
            this.is_changeing = false;
        }
    }
    preventDefault(e){
        if(e.detail.preventDefault && typeof e.detail.preventDefault === "function"){
            e.detail.preventDefault();
        }
    }
    isChanging(scene,ref){
        this.scene = this.scene||scene;
        this.changesDetected[ref] = 0;
        this.isFirstOrLastChange();
    }
    stoppedChanging(ref){
        if(ref in this.changesDetected){
            delete this.changesDetected[ref];
        }
        this.isFirstOrLastChange();
    }
}