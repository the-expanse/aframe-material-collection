import {Node, EDGE_BOTTOM, EDGE_LEFT, EDGE_RIGHT, EDGE_TOP, EDGE_ALL, DIRECTION_LTR} from "typeflex";

let nodes = {} as any;

const ctx: Worker = self as any;

ctx.addEventListener('message', event => {
    switch(event.data.type){

        case "add-node":
            let properties = event.data.properties;
            let node = Node.create() as any;
            nodes[event.data.uuid] = {
                uuid:event.data.uuid,
                node:node,
                parent:null,
                children:[],
                width:event.data.width
            };

            for(let method in properties){
                if(properties.hasOwnProperty(method)&&method.indexOf('Edge')===-1){
                    if(["setMarginLeft","setMarginPercentLeft","setPaddingLeft","setBorderLeft","setPositionLeft","setPositionPercentLeft"]
                        .indexOf(method)>-1){
                        node[method.replace('Left','')](EDGE_LEFT,properties[method]);
                    }else if(["setMarginRight","setMarginPercentRight","setPaddingRight","setBorderRight","setPositionRight","setPositionPercentRight"]
                        .indexOf(method)>-1){
                        node[method.replace('Right','')](EDGE_RIGHT,properties[method]);
                    }else if(["setMarginTop","setMarginPercentTop","setPaddingTop","setBorderTop","setPositionTop","setPositionPercentTop"]
                        .indexOf(method)>-1){
                        node[method.replace('Top','')](EDGE_TOP,properties[method]);
                    }else if(["setMarginBottom","setMarginPercentBottom","setPaddingBottom","setBorderBottom","setPositionBottom","setPositionPercentBottom"]
                        .indexOf(method)>-1){
                        node[method.replace('Bottom','')](EDGE_BOTTOM,properties[method]);
                    }else if(["setMargin","setMarginPercent","setPadding","setBorder","setPosition","setPositionPercent"]
                        .indexOf(method)>-1){
                        node[method](EDGE_ALL,properties[method]);
                    }else if(method.indexOf('setMarginAuto')>-1){
                        let side = method.replace('setMarginAuto','');
                        let _method = method.replace(side,'');
                        switch(side){
                            case "":
                                node[_method](EDGE_ALL);
                                break;
                            case "Left":
                                node[_method](EDGE_LEFT);
                                break;
                            case "Right":
                                node[_method](EDGE_RIGHT);
                                break;
                            case "Top":
                                node[_method](EDGE_TOP);
                                break;
                            case "Bottom":
                                node[_method](EDGE_BOTTOM);
                                break;
                        }
                    }else if(["setWidthAuto","setHeightAuto"]
                        .indexOf(method)>-1) {
                        node[method]();
                    }else{
                        node[method](properties[method]);
                    }
                }
            }
            if(event.data.parentUuid&&nodes.hasOwnProperty(event.data.parentUuid)){
                nodes[event.data.uuid].parent = nodes[event.data.parentUuid];
                nodes[event.data.parentUuid].children.push(nodes[event.data.uuid]);
                nodes[event.data.parentUuid].node.insertChild(node,nodes[event.data.parentUuid].node.getChildCount());
            }
            ctx.postMessage({uuid:event.data.uuid});
            break;
        case "get-layout":
            let results = {content_height:0} as any;
            let traverse = (node: any)=>{
                results[node.uuid] = {
                    left:nodes[node.uuid].node.getComputedLeft(),
                    top:nodes[node.uuid].node.getComputedTop(),
                    width:nodes[node.uuid].node.getComputedWidth(),
                    height:nodes[node.uuid].node.getComputedHeight(),
                };
                let height = results[node.uuid].top+results[node.uuid].height;
                if(height>results.content_height){
                    results.content_height = height;
                }
                for(let i = 0; i < nodes[node.uuid].children.length; i++){
                    traverse(nodes[node.uuid].children[i]);
                }
            };
            if(event.data.parentUuid&&nodes.hasOwnProperty(event.data.parentUuid)){
                nodes[event.data.parentUuid].node.calculateLayout(nodes[event.data.parentUuid].width, 'auto', DIRECTION_LTR);
                traverse(nodes[event.data.parentUuid]);
            }
            ctx.postMessage({uuid:event.data.uuid,data:results});
            break;
        case "reset-layout":
            if(event.data.parentUuid&&nodes.hasOwnProperty(event.data.parentUuid)){
                let traverse = (node: any)=>{
                    node.children.forEach((_node : any)=>{
                        if(nodes.hasOwnProperty(_node.uuid)){
                            delete nodes[_node.uuid];
                        }
                        traverse(_node);
                    });
                };
                nodes[event.data.parentUuid].children.forEach((node: any)=>{
                    nodes[event.data.parentUuid].node.removeChild(node.node);
                    node.node.freeRecursive();
                });
                traverse(nodes[event.data.parentUuid]);
                nodes[event.data.parentUuid].children.length = 0;
            }
            ctx.postMessage({uuid:event.data.uuid});
            break;
    }
});