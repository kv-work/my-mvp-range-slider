/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import $ from 'jquery';
import App from '../app/app';

$.fn.myMVPSlider = function myMVPSlider(options: App.Option): JQuery {

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
    scaleStep: false,
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
    const app = new App(settings, this);
  });

  return this;
};
