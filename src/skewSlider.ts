'use strict';

import { Promise } from 'es6-promise';

import { tween, TweenResult, toRadian, once, Deferred } from './utility';

/** インスタンス固有の設定 */
interface Options {
  el: HTMLCanvasElement;
  angle: number;
  sources: string[];
  interval: number;
  duration: number;
}

/** 切り取り範囲 */
interface ClipPathRegion {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class SkewSlider {
  /** 描画対象のCanvas要素 */
  protected _el: HTMLCanvasElement;

  /** 描画コンテキスト */
  protected _ctx: CanvasRenderingContext2D;

  /** スライダーの横幅 */
  protected _width: number;

  /** スライダーの縦幅 */
  protected _height: number;

  /** 表示させる画像のリスト */
  protected _images: HTMLImageElement[] = [];

  /** _images の中で表示中の画像の添字番号 */
  protected _visibleIndex = 0;

  /** クリップ領域の回転角 */
  protected _angle: number;

  /** 次の画像に移るまでの時間 */
  protected _interval: number;

  /** アニメーションにかける時間 */
  protected _duration: number;

  /** ループのタイマーID */
  protected _timerId: number;

  /** アニメーション中のトゥイーン */
  protected _tweener: TweenResult;

  /** 画像のロード状況を返すプロミス */
  public ready: Promise<void>;

  /**
   * 次に表示させる画像のインデックス
   */
  protected get _getNextVisibleIndex() {
    const current = this._visibleIndex;

    return current === this._images.length - 1
      ? 0
      : current + 1;
  }

  /**
   * 初期化処理
   */
  constructor({el, sources, angle = 0, interval = 2000, duration = 1000}: Options) {
    this._el           = el;
    this._ctx          = this._el.getContext('2d');
    this._width        = this._el.width;
    this._height       = this._el.height;
    this._angle        = angle;
    this._interval     = interval;
    this._duration     = duration;

    this.ready = this._preload(sources).then(() => {
      this._ctx.drawImage(this._images[0], 0, 0);
      this._ticker();
    });
  }

  /**
   * インスタンスを破棄する
   */
  dispose() {
    clearTimeout(this._timerId);
    this._tweener && this._tweener.flush();

    // 一応 null を突っ込む。意味ないかも
    this._el           = null;
    this._ctx          = null;
    this._width        = null;
    this._height       = null;
    this._images       = null;
    this._visibleIndex = null;
    this._angle        = null;
    this._interval     = null;
    this._duration     = null;
    this._timerId      = null;
    this._tweener      = null;
    this.ready         = null;
  }

  /**
   * 画像の事前読み込み
   */
  protected _preload(sources: string[]) {
    return Promise.all(sources.map(src => {
      const img   = document.createElement('img');
      const defer = new Deferred<HTMLImageElement>();

      once(img, 'load error', (event) => {
        return event.type === 'load'
          ? defer.resolve(img)
          : defer.reject((event as ErrorEvent).message);
      });

      img.src = src;

      return defer.promise;
    }))
    .then(result => this._images = result)
    .catch(message => console.error(message));
  }

  /**
   * ループ再生
   */
  protected _ticker(): void {
    this._timerId = setTimeout(() => {
      this._animate().then(() => {
        this._visibleIndex = this._getNextVisibleIndex;
        this._ticker();
      });
    }, this._interval);
  }

  /**
   * クリップパスの領域をアニメーションする
   */
  protected _animate() {
    const direction = Math.abs(this._width * Math.cos(toRadian(this._angle))) + Math.abs(this._height * Math.sin(toRadian(this._angle)));

    this._tweener = tween({
      start   : direction,
      end     : 0,
      duration: this._duration,
      onUpdate: value => {
        this._ctx.save();
        this._drawImage(this._getNextVisibleIndex);
        this._createClipPath(value);
        this._drawImage(this._visibleIndex);
        this._ctx.restore();
      }
    });

    return this._tweener.result;
  }

  /**
   * CanvasRenderingContext2D#drawImageのショートカット
   */
  protected _drawImage(index: number) {
    this._ctx.drawImage(this._images[index], 0, 0, this._width, this._height);
  }

  /**
   * クリップパスの領域を作る
   */
  protected _createClipPath(size: number) {
    const clipPath = this._getClippingRegion();

    this._ctx.beginPath();
    this._ctx.save();
    this._ctx.translate(clipPath.x + clipPath.width / 2, clipPath.y + clipPath.height / 2);
    this._ctx.rotate(toRadian(this._angle));
    this._ctx.rect(- clipPath.width / 2, - clipPath.height / 2, size, clipPath.height);
    this._ctx.restore();
    this._ctx.closePath();
    this._ctx.clip();
  }

  /**
   * クリップパス領域の座標情報を返却する
   */
  protected _getClippingRegion(): ClipPathRegion {
    const width  = Math.abs(this._width * Math.cos(toRadian(this._angle))) + Math.abs(this._height * Math.sin(toRadian(this._angle)));
    const height = Math.abs(this._width * Math.sin(toRadian(this._angle))) + Math.abs(this._height * Math.cos(toRadian(this._angle)));
    const x      = this._width  / 2 - width  / 2;
    const y      = this._height / 2 - height / 2;

    return { width, height, x, y };
  }
}

declare var module: any;
module.exports = SkewSlider;
