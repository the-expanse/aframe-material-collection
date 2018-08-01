export class Utils{
    constructor(){
        this.changesDetected = {};
        this.is_changeing = false;
        AFRAME.registerComponent('ui-is-changing', {
            init() {
                this.el.sceneEl.addEventListener('ui-changing',()=>{
                    //console.log('ui-changing');
                });
                this.el.sceneEl.addEventListener('ui-changing-stopped',()=>{
                    //console.log('ui-changing-stopped');
                });
            }
        });
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
                this.scene.emit('ui-changing-stopped');
            }
            this.is_changeing = false;
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