/// <reference path="../typings/bundle.d.ts" />

import {Promise} from 'es6-promise';
import {
  tween,
  toRadian
} from './utility';

interface SkewSliderOptions {
  el       : HTMLCanvasElement;
  angle    : number;
  sources  : string[];
  interval : number;
  duration : number;
}

interface ClipPathRegion {
  size : number;
  x    : number;
  y    : number;
}

class SkewSlider {
  protected _el           : HTMLCanvasElement;
  protected _ctx          : CanvasRenderingContext2D;
  protected _width        : number;
  protected _height       : number;
  protected _images       : HTMLImageElement[];
  protected _visibleIndex : number;
  protected _angle        : number;
  protected _interval     : number;
  protected _duration     : number;

  /**
   * 初期化処理
   */
  constructor({el, sources, angle = 0, interval = 2000, duration = 1000}: SkewSliderOptions) {
    this._el           = el;
    this._ctx          = this._el.getContext('2d');
    this._width        = this._el.width;
    this._height       = this._el.height;
    this._images       = [];
    this._visibleIndex = 0;
    this._angle        = angle;
    this._interval     = interval;
    this._duration     = duration;

    this._preload(sources)
      .then(() => {
        this._ctx.drawImage(this._images[0], 0, 0);
        this._ticker();
      });
  }

  /**
   * 画像の事前読み込み
   */
  protected _preload(sources: string[]) {
    return Promise.all(sources.map((src: string) => {
      let img   = document.createElement('img');
      return new Promise((resolve, reject) => {
        function onload() {
          removeListener();
          resolve();
        }
        function onerror() {
          removeListener();
          reject();
        }
        function removeListener() {
          img.removeEventListener('load', onload);
          img.removeEventListener('error', onerror);
        }

        img.addEventListener('load' , onload, false);
        img.addEventListener('error', onerror, false);
        img.src = src;

        this._images.push(img);
      });
    }));
  }

  /**
   * ループ再生
   */
  protected _ticker(): void {
    setTimeout(() => {
      this._animate().then(() => {
        this._visibleIndex = this._getNextVisibleIndex();
        this._ticker();
      });
    }, this._interval);
  }

  /**
   * クリップパスの領域をアニメーションする
   */
  protected _animate() {
    let direction = this._width  * Math.sin(toRadian(this._angle)) + this._height * Math.cos(toRadian(this._angle));
    return tween({
      start      : direction,
      end        : 0,
      duration   : this._duration,
      onComplete : () => {},
      onUpdate   : (value: number) => {
        this._ctx.save();
        this._drawImage(this._getNextVisibleIndex());
        this._createClipPath(value);
        this._drawImage(this._visibleIndex);
        this._ctx.restore();
      }
    })
  }

  /**
   * 次に表示させる画像のインデックスを返却
   */
  protected _getNextVisibleIndex() {
    let current = this._visibleIndex;
    return current === this._images.length - 1 ? 0
                                               : current + 1;
  }

  /**
   * CanvasRenderingContext2D.drawImageのショートカット
   */
  protected _drawImage(index: number) {
    this._ctx.drawImage(this._images[index], 0, 0, this._width, this._height);
  }

  /**
   * クリップパスの領域を作る
   */
  protected _createClipPath(size: number) {
    let clipPath = this._getClippingRegion();

    this._ctx.beginPath();
    this._ctx.save();
    this._ctx.translate(clipPath.x + clipPath.size / 2, clipPath.y + clipPath.size / 2);
    this._ctx.rotate(toRadian(this._angle));
    this._ctx.rect(- clipPath.size / 2, - clipPath.size / 2, size, clipPath.size);
    this._ctx.restore();
    this._ctx.closePath();
    this._ctx.clip();
  }

  /**
   * クリップパス領域の座標情報を返却する
   */
  protected _getClippingRegion(): ClipPathRegion {
    let width  = this._width  * Math.sin(toRadian(this._angle));
    let height = this._height * Math.cos(toRadian(this._angle));
    let size   = width + height;
    let posX   = this._width / 2  - size / 2;
    let posY   = this._height / 2 - size / 2;

    return {
      size,
      x    : posX,
      y    : posY
    };
  }
}


export = SkewSlider;
