/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import SliderApp from '../app/app';

(function ($: JQueryStatic): void {
  $.fn.myMVPSlider = function (options: App.Option): JQuery {
    const settings = $.extend({
      maxValue: 100,
      minValue: 0,
      step: 1,
      value: 0,
      secondValue: undefined,

      // view
      isHorizontal: true,
      range: true,
      dragInterval: false,
      runner: true,
      bar: true,
      scale: true,
      numOfScaleVal: 3,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
      prefix: '',
      postfix: '',

      // presenter
      dataValues: [],

      // callbacks
      onStart: () => {},
      onChange: () => {},
      onFinish: () => {},
      onUpdate: () => {},
    }, options);

    this.each(function addPlugin(): void {
      const $this = $(this);
      const app = new SliderApp(settings, this);

      $this.data('myMVPSlider', app);
      $this.data('init-options', settings);
    });

    return this;
  };
}(jQuery));
