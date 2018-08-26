# AFRAME Material Collection.
![Demo](https://raw.githubusercontent.com/shaneharris/aframe-material-collection/master/demo.gif)

Aframe Material Collection uses material design and the [yoga layout engine](https://github.com/facebook/yoga) to make prototyping UI configurations much easier inside aframe.
It goes further than providing some reusable components for your UI, but also integrates yoga for easy and powerful flex layouts. 2D primitives used inside the a-ui-scroll-pane are automatically measured for width and height to allow the layout engine to automatically place them with default settings, but all of these can be overridden with the ui-yoga component to allow granular control over the layout properties. Note only a subset of 2D primitives are supported for auto layout including a-plane, a-circle, a-ring, a-text ( width width and height explicitly set ) and all the primitives below.
## Live Demo

[FULL DEMO](https://shaneharris.github.io/aframe-material-collection/)

[SCROLL PANE DEMO](https://shaneharris.github.io/aframe-material-collection/scroll-pane.html)

[MANY ELEMENTS DEMO](https://shaneharris.github.io/aframe-material-collection/performance.html)

## Getting Started

#### CDN for browser
```HTML
<script src="https://cdn.rawgit.com/shaneharris/CanvasInput/master/CanvasInput.js"></script>
<script src="https://aframe.io/releases/0.8.0/aframe.min.js"></script>
<!-- Include yoga layout for scroll pane layouts after aframe -->
<script src="https://unpkg.com/aframe-material-collection/dist/aframe-yoga-layout.min.js"></script>
<!-- Include aframe-material-collection after aframe and yoga layout-->
<script src="https://unpkg.com/aframe-material-collection/dist/aframe-material-collection.min.js"></script>
```

#### Installing

```
npm i aframe-material-collection
```

#### Running

```
npm start
```

#### Building

```
npm run build
```

## Documentation

[Primitives](https://github.com/shaneharris/aframe-material-collection/wiki/Primitives)

[Components](https://github.com/shaneharris/aframe-material-collection/wiki/Components)

[Yoga Layout Engine](https://github.com/shaneharris/aframe-material-collection/wiki/Yoga-Layout-Engine)


## Examples

```HTML
<!-- Button -->
<a-ui-button text-value="Button" class="intersectable"></a-ui-button>

<!-- FAB Button -->
<a-ui-fab-button color="#f44336" class="intersectable"></a-ui-fab-button>

<!-- Small FAB Button -->
<a-ui-fab-button-small class="intersectable" color="#2196f3"></a-ui-fab-button-small>

<!-- Switch -->
<a-ui-switch class="intersectable"></a-ui-switch>

<!-- Checkbox -->
<a-ui-checkbox class="intersectable" indeterminate="true"></a-ui-checkbox>

<!-- Radio -->
<a-entity width="1.8">
    <a-ui-radio selected="true" class="intersectable"></a-ui-radio>
    <a-ui-radio class="intersectable"></a-ui-radio>
    <a-ui-radio disabled="true" class="intersectable"></a-ui-radio>
</a-entity>

<!-- Text Input -->
<a-ui-text-input width="0.9" height="0.15" value="something"></a-ui-text-input>

```

## TODOs:

* Need to add touchpad/joystick support for scrolling.
* Need to document yoga layout properties/strategies.
* Need to improve canvasinput and remove dom dependencies.
* Need to expose DOM-like events on all the primitives, as well as getters and setters for values etc.
* Look at [unit testing with Karma](https://github.com/aframevr/aframe/tree/master/tests)