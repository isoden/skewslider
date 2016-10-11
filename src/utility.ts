'use strict';

import { Promise } from 'es6-promise';

const noop = () => {};

interface TweenOptions {
  start: number;
  end: number;
  duration: number;
  onUpdate?: (value: number) => void;
  onComplete?: (value: number) => void;
}

export function tween({start, end, duration, onUpdate = noop, onComplete = noop}: TweenOptions) {
  const diff      = end - start;
  const defer     = new Deferred<void>();
  let prevTime    = Date.now();
  let elapsedTime = 0;
  let timer       = raf(function ticker() {
    let now         = Date.now();
    let timeRate    = elapsedTime / duration;
    let changeValue = diff * (1 - Math.pow((1 - timeRate), 3)) + start;

    onUpdate(changeValue);

    // 1フレーム分の時間を経過時間に加算
    elapsedTime += now - prevTime;
    prevTime = now;

    if (elapsedTime >= duration) {
      cancelRaf(timer);
      onUpdate(end);
      onComplete(end);
      return defer.resolve();
    }

    raf(ticker);
  });

  return defer.promise;
}

export class Deferred<T> {
  promise: Promise<T>;
  resolve: (value?: T | PromiseLike<T>) => void;
  reject: (error?: any, stackTrace?: string) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject  = reject;
    });
  }
}

/**
 * 一度だけ実行されるコールバック関数を登録する
 * @params target   対象の要素
 * @params type     イベント名。空白区切りで複数指定可
 * @params callback 実行されるコールバック関数
 */
export function once(target: HTMLElement, type: string, callback: (event: Event) => any) {
  type.split(/\s/).forEach(type => {
    target.addEventListener(type, function listener(event) {
      target.removeEventListener(type, listener);
      return callback(event);
    });
  });
}

/**
 * 渡された関数名の配列の内有効なメソッドが存在する場合にその関数を返却する。
 * 存在しなかった場合はfallbackを指定しておけばそれが返却される
 *
 * @params methodNames 関数名の配列
 * @params target      ターゲット
 * @params fallback    メソッドが存在しなかったときの代替実装
 */
function getMethod<T>(methodNames: string[], target: any = window, fallback?: Function): T {
  const results = methodNames.filter(methodName => !!target[methodName]);

  return ((...args: any[]) => target[results[0]](...args)) as any || fallback;
}

/**
 * requestAnimationFrame のショートカット
 * 存在しない場合はポリフィルが使われる
 */
export const raf = getMethod<typeof requestAnimationFrame>([
  'requestAnimationFrame',
  'webkitRequestAnimationFrame',
  'mozRequestAnimationFrame'
], window, (callback: (time: number) => void) => setTimeout(callback, 1000 / 60));

/**
 * cancelAnimationFrame のショートカット
 * 存在しない場合はポリフィルが使われる
 */
export const cancelRaf = getMethod<typeof cancelAnimationFrame>([
  'cancelAnimationFrame',
  'webkitCancelAnimationFrame',
  'mozCancelAnimationFrame'
], window, (requestId: number) => clearTimeout(requestId));

export function toRadian(degree: number): number {
  return degree * Math.PI / 180;
}
