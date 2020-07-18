/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-shadow */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import SliderApp from '../app/app';

$.fn.myMVPSlider = function (options: App.Option): JQuery {
  const settings = $.extend({
    maxValue: 100,
    minValue: 0,
    step: 1,
    value: 0,
    secondValue: undefined,

    // view
    isHorizontal: true,
    range: false,
    dragInterval: false,
    runner: true,
    bar: true,
    scale: false,
    scaleStep: 1,
    displayScaleValue: false,
    displayValue: false,
    displayMin: false,
    displayMax: false,
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
  });

  return this;
};
