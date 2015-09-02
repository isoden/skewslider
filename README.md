skewSlider
===

[![npm](https://img.shields.io/npm/v/skewslider.svg?style=flat-square)](https://www.npmjs.com/package/skewslider)


## installation

```
 $ npm install --save skewslider
```

## Usage

```html
<canvas id="canvas" width="640" height="640"></canvas>
<script src="path/to/skewslider.js"></script>
```

```js
var skewSlider = new SkewSlider({
  el       : document.getElementById('canvas'),
  interval : 5000,
  duration : 1000,
  sources  : [
    'http://placeimg.com/640/640/people?p=1',
    'http://placeimg.com/640/640/people?p=2',
    'http://placeimg.com/640/640/people?p=3',
    'http://placeimg.com/640/640/people?p=4'
  ]
});
```
