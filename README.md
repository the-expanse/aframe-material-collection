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


#### Switch

```HTML
<a-entity ui-switch></a-entity>
```


#### Checkbox

```HTML
<a-entity ui-checkbox></a-entity>
```


#### Radio

```HTML
<a-entity ui-radio></a-entity>
```
