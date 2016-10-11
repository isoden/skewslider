/*! highlight.js v9.7.0 | BSD3 License | git.io/hljslicense */

/* jshint browser: true */
/* globals ko, SkewSlider */

(function () {
  'use strict';

  function AppViewModel() {
    /** canvas要素の参照 */
    this.canvasRef = document.getElementById('skewSlider');

    /** スライダーのインスタンス */
    this.sliderInstance = null;

    /** スライドの角度 */
    this.angle = ko.observable(30);

    /** スライダーの横幅 */
    this.width = ko.observable(300);

    /** スライダーの縦幅 */
    this.height = ko.observable(300);

    /** 次の画像に移るまでの時間 */
    this.interval = ko.observable(4000);

    /** アニメーションにかける時間 */
    this.duration = ko.observable(1400);

    /** 画像読み込み中か */
    this.loading = ko.observable(true);

    ko.computed(function () {
      if (this.sliderInstance) {
        this.sliderInstance.dispose();
      }

      this.canvasRef.width = this.width();
      this.canvasRef.height = this.height();
      this.loading(true);
      
      this.sliderInstance = new SkewSlider({
        el       : this.canvasRef,
        interval : this.interval(),
        duration : this.duration(),
        angle    : this.angle(),
        sources  : [
          `http://placeimg.com/${ this.width() }/${ this.height() }/people`,
          `http://placeimg.com/${ this.width() }/${ this.height() }/tech`,
          `http://placeimg.com/${ this.width() }/${ this.height() }/animals`,
          `http://placeimg.com/${ this.width() }/${ this.height() }/nature`
        ]
      });

      this.sliderInstance.ready.then(function () {
        this.loading(false);
      }.bind(this));
    }, this);
  }

  ko.applyBindings(new AppViewModel(), document.body);
})();
