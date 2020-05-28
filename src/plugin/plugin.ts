/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import $ from 'jquery';
import App from '../app/app';
import { ApplicationOption } from '../types';

$.fn.myMVPSlider = function myMVPSlider(options: ApplicationOption): JQuery {
  this.each(function addPlugin(): void {
    const app = new App(options, this);
  });

  return this;
};
