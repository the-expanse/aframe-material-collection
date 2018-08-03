
## Documentation - Primitives


### Scroll Pane

```HTML
<a-ui-scroll-pane position="0 -0.2 0">
    <a-entity class="container">
        <!-- Your content here -->
    </a-entity>
</a-ui-scroll-pane>
```
| Attribute                        | Component Mapping                      | Default Value |
| --------                         | -----------------                      | ------------- |
| width                            | ui-scroll-pane.width                   | 2.5           |
| height                           | ui-scroll-pane.height                  | 1.2           |
| scroll-padding                   | ui-scroll-pane.scrollPadding           | 0.1           |
| scroll-z-offset                  | ui-scroll-pane.scrollZOffset           | 0             |
| handle-color                     | ui-scroll-pane.scrollHandleColor       | #009688       |


### Button

```HTML
<a-ui-button text-value="Button" class="intersectable"></a-ui-button>
```
| Attribute                        | Component Mapping                      | Default Value   |
| --------                         | -----------------                      | --------------- |
| width                            | geometry.width                         | 0.5             |
| height                           | geometry.height                        | 0.175           |
| color                            | material.color                         | #009688         |
| transparent                      | material.transparent                   | false           |
| font-color                       | text.color                             | #ffffff         |
| text-value                       | text.value                             | <empty>         |
| wrap-count                       | text.wrapCount                         | 10              |
| ripple-color                     | ui-ripple.color                        | #ffffff         |
| ripple-size                      | ui-ripple.size                         | {x:0.5,y:0.175} |
| ripple-z-index                   | ui-ripple.zIndex                       | 0.001           |
| disabled                         | ui-btn.disabled                        | false           |


### Floating Action Button

```HTML
<a-ui-fab-button color="#f44336" class="intersectable"></a-ui-fab-button>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| radius                           | geometry.radius                        | 0.1               |
| color                            | material.color                         | #009688           |
| transparent                      | material.transparent                   | false             |
| ripple-color                     | ui-ripple.color                        | #ffffff           |
| ripple-size                      | ui-ripple.size                         | {x:0.105,y:0.105} |
| ripple-z-index                   | ui-ripple.zIndex                       | 0.001             |
| disabled                         | ui-btn.disabled                        | false             |


### Small Floating Action Button

```HTML
<a-ui-fab-button-small class="intersectable" color="#2196f3"></a-ui-fab-button-small>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| radius                           | geometry.radius                        | 0.075             |
| color                            | material.color                         | #009688           |
| transparent                      | material.transparent                   | false             |
| ripple-color                     | ui-ripple.color                        | #ffffff           |
| ripple-size                      | ui-ripple.size                         | {x:0.075,y:0.075} |
| ripple-z-index                   | ui-ripple.zIndex                       | 0.001             |
| disabled                         | ui-btn.disabled                        | false             |


### Switch

```HTML
<a-ui-switch class="intersectable"></a-ui-switch>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-switch.value                        | false             |
| disabled                         | ui-switch.disabled                     | false             |


### Checkbox

```HTML
<a-ui-checkbox class="intersectable" indeterminate="true" ></a-ui-checkbox>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-checkbox.value                      | false             |
| indeterminate                    | ui-checkbox.indeterminate              | false             |
| disabled                         | ui-checkbox.disabled                   | false             |



### Radio Group

```HTML
<a-entity width="1.8">
    <a-ui-radio selected="true" class="intersectable"></a-ui-radio>
    <a-ui-radio class="intersectable"></a-ui-radio>
    <a-ui-radio disabled="true" class="intersectable"></a-ui-radio>
</a-entity>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-checkbox.value                      | false             |
| color                            | ui-radio.selectedColor                 | #009688           |
| selected                         | ui-radio.selected                      | false             |
| disabled                         | ui-radio.disabled                      | false             |


### Text Input

```HTML
<a-ui-text-input width="0.9" height="0.15" value="something"></a-ui-text-input>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-text.value                          | <empty>           |
| width                            | ui-text.width                          | 0.5               |
| height                           | ui-text.height                         | 0.1               |
| place-holder                     | ui-text.placeHolder                    | Text...           |


### Number (float) Input

```HTML
<a-ui-number-input width="1.8" height="0.3"></a-ui-number-input>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-text.value                          | <empty>           |
| width                            | ui-text.width                          | 0.5               |
| height                           | ui-text.height                         | 0.1               |
| place-holder                     | ui-text.placeHolder                    | Number...         |


### Integer Input

```HTML
<a-ui-int-input width="1.8" height="0.3"></a-ui-int-input>
```
| Attribute                        | Component Mapping                      | Default Value     |
| --------                         | -----------------                      | ----------------- |
| value                            | ui-text.value                          | <empty>           |
| width                            | ui-text.width                          | 0.5               |
| height                           | ui-text.height                         | 0.1               |
| place-holder                     | ui-text.placeHolder                    | Whole Number...   |


## Documentation - Components


### Button

```HTML
<a-plane ui-btn width="1.8" height="0.3"></a-plane>
```
| Property                         | Description                                              | Type        | Default Value |
| --------                         | -----------------                                        | ----------- | ------------- |
| duration                         | The button animation duration                            | int         | 250           |
| hoverHeight                      | The z offset of the button when hovering                 | number      | 0.01          |
| activeHeight                     | The z offset of the button when pressed                  | number      | -0.001        |
| disabled                         | The button responds to mouse events or not               | boolean     | false         |



### Checkbox

```HTML
<a-entity ui-checkbox></a-entity>
```
| Property                         | Description                                              | Type        | Default Value |
| --------                         | -----------------                                        | ----------- | ------------- |
| value                            | The checkbox state.                                      | boolean     | false         |
| selectedColor                    | The color of the checkbox when selected                  | string      | #009688       |
| unselectedColor                  | The color of the checkbox when not selected              | string      | #7f7f7f       |
| disabledColor                    | The color of the checkbox when disabled                  | string      | #afafaf       |
| indeterminate                    | Is the checkbox in an intermediate state                 | boolean     | false         |
| disabled                         | The checkbox responds to mouse events or not             | boolean     | false         |



### Radio

```HTML
<a-entity>
    <a-entity ui-radio></a-entity>
    <a-entity ui-radio="selected:true;"></a-entity>
    <a-entity ui-radio="disabled:true;"></a-entity>
</a-entity>
```
| Property                         | Description                                              | Type        | Default Value |
| --------                         | -----------------                                        | ----------- | ------------- |
| value                            | The radio state.                                         | boolean     | false         |
| selectedRadius                   | The radius of the inner selected circle                  | number      | 0.045         |
| selectedColor                    | The color of the radio when selected                     | string      | #009688       |
| unselectedColor                  | The color of the radio when not selected                 | string      | #5f5f5f       |
| disabledColor                    | The color of the radio when disabled                     | string      | #afafaf       |
| disabled                         | The radio responds to mouse events or not                | boolean     | false         |



### Icon

```HTML
<a-circle ui-icon="src:/icons/send_white_64dp.png;size:0.1 0.1;"></a-circle>
```
| Property                         | Description                                              | Type        | Default Value              |
| --------                         | -----------------                                        | ----------- | -------------              |
| src                              | The url of the icon                                      | string      | /icons/send_white_64dp.png |
| size                             | The vertical/horizontal size of the icon                 | vec2        | {x:0.1,y:0.1}              |
| zIndex                           | The z offset of the icon                                 | number      | 0.003                      |
| color                            | The color of the icon                                    | string      | #ffffff                    |


### Ripple

```HTML
<a-entity ui-ripple="size:0.3 0.3;zIndex:-0.001;color:#f48fb1"></a-entity>
```
| Property                         | Description                                              | Type        | Default Value              |
| --------                         | -----------------                                        | ----------- | -------------              |
| color                            | The color of the ripple                                  | string      | #ffffff                    |
| duration                         | The ripple animation duration                            | int         | 1000                       |
| fadeDuration                     | The fade animation duration                              | int         | 750                        |
| fadeDelay                        | The fade animation delay                                 | int         | 250                        |
| clampToSquare                    | Whether to contain ripple inside a clipped region        | boolean     | false                      |
| size                             | The size of the ripple                                   | vec2        | {x:1,y:1}                  |
| zIndex                           | The z offset of the ripple                               | number      | -0.001                     |
| segments                         | The number of segments in the circle ripple geometry     | int         | 6                          |



### Rounded

```HTML
<a-entity ui-rounded="borderRadius:0.05"></a-entity>
```
| Property                         | Description                                              | Type        | Default Value              |
| --------                         | -----------------                                        | ----------- | -------------              |
| borderRadius                     | The corner radius                                        | number      | 0.01                       |
| curveSegments                    | The number of segments in the curved corners             | int         | 1                       |



### Scroll Pane

```HTML
<a-entity ui-scroll-pane="scrollPadding:0.1;width:2.4;height: 1.6">
      <a-entity class="container">
        <!-- Your content here -->
      </a-entity>
</a-entity>
```
| Property                         | Description                                              | Type        | Default Value |
| --------                         | -----------------                                        | ----------- | ------------- |
| width                            | The fixed width of the scroll panel                      | number      | 2.5           |
| height                           | The fixed height of the scroll panel                     | number      | 1.2           |
| scrollPadding                    | The space between the scroll bar and the content         | number      | 0.1           |
| scrollZOffset                    | The z-index or z offset of the scroll bar to raise it up | number      | 0             |
| scrollHandleColor                | The color of the handle on the scroll bar                | string      | #009688       |


### Switch

```HTML
<a-entity ui-switch></a-entity>
```
| Property                          | Description                                              | Type        | Default Value |
| --------                          | -----------------                                        | ----------- | ------------- |
| value                             | If the switch listens for mouse events                   | boolean     | false         |
| progressColor                     | The color of the rail when selected                      | string      | #4db6ac       |
| handleColor                       | The color of the handle                                  | string      | #009688       |
| handleDisabledColor               | The color of the handle when disabled                    | string      | #afafaf       |
| railColor                         | The color of the rail when not selected                  | string      | #ffffff       |
| switchDuration                    | The duration of the switch animation                     | int         | 350           |
| handleZIndex                      | The z-index or z offset of the handle to raise it up     | number      | 0.01          |
| intersectableClass                | The class to apply to the handle to allow cursor input   | string      | intersectable |
| disabled                          | The switch responds to mouse events or not               | boolean     | false         |



### Text

```HTML
<a-entity ui-text="width: 1; height: 0.2;"></a-entity>
```
| Property                         | Description                                                | Type        | Default Value |
| --------                         | -----------------                                          | ----------- | ------------- |
| width                            | The fixed width of the input field                         | number      | 0.5           |
| height                           | The fixed height of the input field                        | number      | 0.1           |
| value                            | The input text value                                       | string      | <empty>       |
| type                             | The type of input i.e `text`, `number`, `int`              | string      | text          |
| lineFocusColor                   | The color of underline when focused                        | string      | #009688       |
| lineBlurColor                    | The color of underline when blurred                        | string      | #cfcfcf       |
| disabledColor                    | The color of underline when disabled                       | string      | #afafaf       |
| fontFamily                       | The font face                                              | string      | Roboto        |
| fontColor                        | The font color                                             | string      | #4f4f4f       |
| placeHolder                      | The placeholder text to show when the input field is empty | string      | Text...       |
| disabled                         | The field responds to mouse events or not                  | boolean     | false         |


### Yoga

```HTML
<a-entity ui-yoga="margin:0;"></a-entity>
```


