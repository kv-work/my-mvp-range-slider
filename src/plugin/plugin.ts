/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eol-last */
import $ from 'jquery';
import App from '../app/app';
import { ApplicationOption } from '../types';
import './plugin.d';

$.fn.myMVPSlider = function myMVPSlider(options: ApplicationOption): JQuery {
  const app = new App(options, this);
  return this;
};
