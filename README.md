# AFRAME Material Collection.
![Demo](https://raw.githubusercontent.com/shaneharris/aframe-material-collection/master/demo.gif)


## Primitives



#### Scroll Pane

```HTML
<a-ui-scroll-pane position="0 -0.2 0">
    <a-entity class="container"></a-entity>
</a-ui-scroll-pane>
```

#### Button

```HTML
<a-ui-button text-value="Button" shadow="receive:false" class="intersectable"></a-ui-button>
```

#### Floating Action Button

```HTML
<a-ui-fab-button shadow="receive:false" class="intersectable" color="#f44336"></a-ui-fab-button>
```


#### Small Floating Action Button

```HTML
<a-ui-fab-button-small shadow="receive:false" class="intersectable" color="#2196f3"></a-ui-fab-button-small>
```


#### Switch

```HTML
<a-ui-switch class="intersectable"></a-ui-switch>
```


#### Checkbox

```HTML
<a-ui-checkbox class="intersectable" indeterminate="true" ></a-ui-checkbox>
```


#### Radio Group

```HTML
<a-entity width="1.8">
    <a-ui-radio class="intersectable"></a-ui-radio>
    <a-ui-radio disabled="true" class="intersectable"></a-ui-radio>
</a-entity>
```


#### Text Input

```HTML
<a-text font="roboto" baseLine="center" anchor="center" value="Text"
    color="#212121" wrap-count="25" width="1.8" height="0.2"></a-text>
```


#### Number (float) Input

```HTML
<a-ui-number-input width="1.8" height="0.3"></a-ui-number-input>
```


#### Integer Input

```HTML
<a-ui-int-input width="1.8" height="0.3"></a-ui-int-input>
```


## Components


#### Button

```HTML
<a-plane ui-btn width="1.8" height="0.3"></a-plane>
```


#### Checkbox

```HTML
<a-entity ui-checkbox></a-entity>
```


#### Double Click

```HTML
<a-circle ui-double-click></a-circle>
```


#### Icon

```HTML
<a-circle ui-icon="src:/icons/send_white_64dp.png;size:0.1 0.1;"></a-circle>
```


#### Mouse move - shims the raycaster to provide mouse move events.

```HTML
<a-entity ui-mouse-move></a-entity>
```


#### Radio

```HTML
<a-entity ui-radio></a-entity>
```


#### Ripple

```HTML
<a-entity ui-ripple="size:0.3 0.3;zIndex:-0.001;color:#f48fb1"></a-entity>
```


#### Rounded

```HTML
<a-entity ui-rounded="borderRadius:0.05"></a-entity>
```


#### Scroll Pane

```HTML
<a-entity ui-scroll-pane="scrollPadding:0.1;width:2.4;height: 1.6">
      <a-entity class="container"></a-entity>
</a-entity>
```


#### Switch

```HTML
<a-entity ui-switch></a-entity>
```


#### Text

```HTML
<a-entity ui-text="width: 1; height: 0.2;"></a-entity>
```


#### Yoga

```HTML
<a-entity ui-yoga="margin:0;"></a-entity>
```

