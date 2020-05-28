/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import $ from 'jquery';
import App from '../app/app';

$.fn.myMVPSlider = function myMVPSlider(options: App.Option): JQuery {
  this.each(function addPlugin(): void {
    const app = new App(options, this);
  });

  return this;
};
