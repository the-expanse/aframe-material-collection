/* global Yoga */

/**
 * Yogo Layout Engine mapped to a Component for aframe-material-collection - https://yogalayout.com
 * @namespace aframe-material-collection
 * @component ui-yoga
 * @author Shane Harris
 */

// if (typeof Yoga === 'undefined') {
//     throw 'ui-yoga component requires the Yoga Layout Engine to be loaded - https://yogalayout.com';
// }
// Map yoga enums to frendly names.
// TODO: Need to expose the padding/border/margin side as seperate options to allow for combinations.
import {
    ALIGN_AUTO, ALIGN_BASELINE,
    ALIGN_CENTER,
    ALIGN_FLEX_END,
    ALIGN_FLEX_START,
    ALIGN_SPACE_AROUND, ALIGN_SPACE_BETWEEN,
    ALIGN_STRETCH,
    DIMENSION_HEIGHT,
    DIMENSION_WIDTH,
    DIRECTION_INHERIT,
    DIRECTION_LTR,
    DIRECTION_RTL,
    DISPLAY_FLEX,
    DISPLAY_NONE,
    EDGE_ALL,
    EDGE_BOTTOM,
    EDGE_END,
    EDGE_HORIZONTAL, EDGE_LEFT,
    EDGE_RIGHT,
    EDGE_START,
    EDGE_TOP,
    EDGE_VERTICAL,
    FLEX_DIRECTION_COLUMN,
    FLEX_DIRECTION_COLUMN_REVERSE,
    FLEX_DIRECTION_ROW,
    FLEX_DIRECTION_ROW_REVERSE,
    JUSTIFY_CENTER,
    JUSTIFY_FLEX_END,
    JUSTIFY_FLEX_START,
    JUSTIFY_SPACE_AROUND,
    JUSTIFY_SPACE_BETWEEN,
    JUSTIFY_SPACE_EVENLY,
    MEASURE_MODE_AT_MOST,
    MEASURE_MODE_EXACTLY, MEASURE_MODE_UNDEFINED,
    NODE_TYPE_DEFAULT, NODE_TYPE_TEXT,
    OVERFLOW_HIDDEN, OVERFLOW_SCROLL,
    OVERFLOW_VISIBLE,
    POSITION_TYPE_ABSOLUTE,
    POSITION_TYPE_RELATIVE,
    UNIT_AUTO,
    UNIT_PERCENT,
    UNIT_POINT,
    UNIT_UNDEFINED,
    WRAP_NO_WRAP,
    WRAP_WRAP,
    WRAP_WRAP_REVERSE
} from "typeflex";

export = AFRAME.registerComponent('ui-yoga', {
    schema: {
        alignContent: {default: 'flex-start'},
        alignItems: {default: 'auto'},
        alignSelf: {default: 'auto'},
        display: {default: 'default'},
        flex: {type:'number',default: 1},
        flexDirection: {default: 'row'},
        flexWrap:{default: 'default'},
        aspectRatio: {default: 'default'},
        overflow:{default:'default'},
        justifyContent:{default:'start'},
        border: {type:'int',default: 0},
        borderLeft: {type:'int',default: 0},
        borderRight: {type:'int',default: 0},
        borderTop: {type:'int',default: 0},
        borderBottom: {type:'int',default: 0},
        padding: {type:'int',default: 0},
        paddingLeft: {type:'int',default: 0},
        paddingRight: {type:'int',default: 0},
        paddingTop: {type:'int',default: 0},
        paddingBottom: {type:'int',default: 0},
        margin: {type:'int',default: 0},
        marginLeft: {type:'int',default: 0},
        marginRight: {type:'int',default: 0},
        marginTop: {type:'int',default: 0},
        marginBottom: {type:'int',default: 0},
        marginAuto: {type:'boolean',default: false},
        marginAutoLeft: {type:'boolean',default: false},
        marginAutoRight: {type:'boolean',default: false},
        marginAutoTop: {type:'boolean',default: false},
        marginAutoBottom: {type:'boolean',default: false},
        marginPercent:{type:'number',default: 0},
        marginPercentLeft: {type:'int',default: 0},
        marginPercentRight: {type:'int',default: 0},
        marginPercentTop: {type:'int',default: 0},
        marginPercentBottom: {type:'int',default: 0},
        flexBasis: {default: 'default'},
        flexBasisPercent: {type:'number',default: 0},
        flexGrow:{type:'number',default: 0},
        flexShrink:{type:'number',default: 1},
        maxHeight:{default: 'default'},
        minHeight:{default: 'default'},
        maxWidth:{default: 'default'},
        minWidth:{default: 'default'},
        maxHeightPercent:{default: 'default'},
        minHeightPercent:{default: 'default'},
        maxWidthPercent:{default: 'default'},
        minWidthPercent:{default: 'default'},
        position:{default: 'default'},
        positionLeft: {type:'int',default: 0},
        positionRight: {type:'int',default: 0},
        positionTop: {type:'int',default: 0},
        positionBottom: {type:'int',default: 0},
        positionPercent:{default: 'default'},
        positionPercentLeft: {type:'int',default: 0},
        positionPercentRight: {type:'int',default: 0},
        positionPercentTop: {type:'int',default: 0},
        positionPercentBottom: {type:'int',default: 0},
        width:{default: 'default'},
        height:{default: 'default'},
        widthAuto:{type:'boolean',default: false},
        heightAuto:{type:'boolean',default: false},
        widthPercent:{default: 'default'},
        heightPercent:{default: 'default'},
    },
    init(){
        this.el.getYogaProperties = this.getProperties.bind(this);
        this.setProperties();
    },
    updateSchema(){
        this.setProperties();
    },
    setProperties(){
        this.properties = this.properties||[];
        this.properties.length = 0;
        // Store the current valid yoga properties;
        for(let name in this.data){
            if(this.data.hasOwnProperty(name)&&
                this.data[name]!=='default'&&this.data[name]){
                let value = this.mapPropertyToEnum(name);
                if(value)this.properties.push({method:'set'+name.charAt(0).toUpperCase() + name.substr(1),value:this.mapPropertyToEnum(name)});
            }
        }
    },
    getProperties(){
        // Get the current yoga properties array as an object
        let propertiesObj = {} as any;
        for(let i = 0;i < this.properties.length;i++){
            propertiesObj[this.properties[i].method] = this.properties[i];
        }
        return propertiesObj;
    },
    mapPropertyToEnum(name: string){
        // Get the yoga enum for the friendly name.
        switch(true){
            case name.indexOf('align') > -1:
                return this.enums.align[this.data[name]];
            case name.indexOf('Edge') > -1:
                return this.enums.edge[this.data[name]];
            case name === 'flexDirection':
            case name === 'flexWrap':
            case name === 'positionType':
            case name === 'overflow':
            case name === 'display':
            case name === 'justifyContent':
                return this.enums[name][this.data[name]];
            default:
                return this.data[name];
        }
    },
    enums:{
        align:{
            //count:ALIGN_COUNT,
            auto:ALIGN_AUTO,
            "flex-start":ALIGN_FLEX_START,
            center:ALIGN_CENTER,
            "flex-end":ALIGN_FLEX_END,
            stretch:ALIGN_STRETCH,
            baseline:ALIGN_BASELINE,
            "space-between":ALIGN_SPACE_BETWEEN,
            "space-around":ALIGN_SPACE_AROUND,
        },
        dimension:{
            //count:DIMENSION_COUNT,
            width:DIMENSION_WIDTH,
            height:DIMENSION_HEIGHT,
        },
        direction:{
            //count:DIRECTION_COUNT,
            inherit:DIRECTION_INHERIT,
            ltr:DIRECTION_LTR,
            rtl:DIRECTION_RTL,
        },
        display:{
            //count:DISPLAY_COUNT,
            flex:DISPLAY_FLEX,
            none:DISPLAY_NONE,
        },
        edge:{
            //count:EDGE_COUNT,
            left:EDGE_LEFT,
            top:EDGE_TOP,
            right:EDGE_RIGHT,
            bottom:EDGE_BOTTOM,
            start:EDGE_START,
            end:EDGE_END,
            horizontal:EDGE_HORIZONTAL,
            vertical:EDGE_VERTICAL,
            all:EDGE_ALL,
        },
        experimental:{
            //count:EXPERIMENTAL_FEATURE_COUNT,
            //"flex-basis":EXPERIMENTAL_FEATURE_WEB_FLEX_BASIS,
        },
        flexDirection:{
            //count:FLEX_DIRECTION_COUNT,
            column:FLEX_DIRECTION_COLUMN,
            "column-reverse":FLEX_DIRECTION_COLUMN_REVERSE,
            row:FLEX_DIRECTION_ROW,
            reverse:FLEX_DIRECTION_ROW_REVERSE,
        },
        justifyContent:{
            //count:JUSTIFY_COUNT,
            start:JUSTIFY_FLEX_START,
            center:JUSTIFY_CENTER,
            end:JUSTIFY_FLEX_END,
            between:JUSTIFY_SPACE_BETWEEN,
            around:JUSTIFY_SPACE_AROUND,
            evenly:JUSTIFY_SPACE_EVENLY,
        },
        logLevel:{
            //count:LOG_LEVEL_COUNT,
            //error:LOG_LEVEL_ERROR,
            //warn:LOG_LEVEL_WARN,
            //info:LOG_LEVEL_INFO,
            //debug:LOG_LEVEL_DEBUG,
            //verbose:LOG_LEVEL_VERBOSE,
            //fatal:LOG_LEVEL_FATAL,
        },
        measureMode:{
            //count:MEASURE_MODE_COUNT,
            undefined:MEASURE_MODE_UNDEFINED,
            exactly:MEASURE_MODE_EXACTLY,
            "at-most":MEASURE_MODE_AT_MOST,
        },
        nodeType:{
            //count:NODE_TYPE_COUNT,
            default:NODE_TYPE_DEFAULT,
            text:NODE_TYPE_TEXT,
        },
        overflow:{
            //count:OVERFLOW_COUNT,
            visible:OVERFLOW_VISIBLE,
            hidden:OVERFLOW_HIDDEN,
            scroll:OVERFLOW_SCROLL,
        },
        positionType:{
            //count:POSITION_TYPE_COUNT,
            relative:POSITION_TYPE_RELATIVE,
            absolute:POSITION_TYPE_ABSOLUTE,
        },
        printOptions:{
            //count:PRINT_OPTIONS_COUNT,
            //layout:PRINT_OPTIONS_LAYOUT,
            //style:PRINT_OPTIONS_STYLE,
            //children:PRINT_OPTIONS_CHILDREN,
        },
        unit:{
            //count:UNIT_COUNT,
            undefined:UNIT_UNDEFINED,
            point:UNIT_POINT,
            percent:UNIT_PERCENT,
            auto:UNIT_AUTO,
        },
        flexWrap:{
            //count:WRAP_COUNT,
            "no-wrap":WRAP_NO_WRAP,
            wrap:WRAP_WRAP,
            "wrap-reverse":WRAP_WRAP_REVERSE,
        }
    }
});