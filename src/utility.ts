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
  let prevTime    = Date.now();
  let elapsedTime = 0;

  return new Promise(resolve => {
    let timer = raf(function ticker() {
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
        return resolve();
      }

      raf(ticker);
    });
  });
}


export function raf(callback: Function) {
  return (
    window.requestAnimationFrame ||
    (<any>window).mozRequestAnimationFrame ||
    (<any>window).webkitRequestAnimationFrame ||
    (<any>window).msRequestAnimationFrame ||
    function (callback: Function) {
      return setTimeout(callback, 1000 / 60);
    }
  )(callback);
}

export function cancelRaf(requestId: number) {
  return (
    window.cancelAnimationFrame ||
    (<any>window).mozCancelAnimationFrame ||
    (<any>window).webkitCancelAnimationFrame ||
    function (requestId: number) {
      clearTimeout(requestId);
    }
  )(requestId);
}

export function toRadian(degree: number): number {
  return degree * Math.PI / 180;
}
