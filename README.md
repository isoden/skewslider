skewSlider
===

[![npm](https://img.shields.io/npm/v/skewslider.svg?style=flat-square)](https://www.npmjs.com/package/skewslider)

## Demo

- [http://isoden.github.io/skewSlider/demo](http://isoden.github.io/skewSlider/demo)

## Installation

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
  angle    : 15,
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

## Options

|name|description|default|
|:---|:---|:----|
|el: HTMLCanvasElement|描画対象のCanvas要素|-|
|angle: number  |斜めの角度|0|
|interval: number  |次のアニメーションまでの時間(ms)|2000|
|duration: number  |アニメーションの時間(ms)|1000|
|sources: string[]  |画像URLの配列|-|

## Support

IE >= 9 and modern browsers.

## License

MIT License.
