import $ from 'jquery';
import './plugin/plugin';
import { ApplicationOption } from './types';

// need added default options in App.ts
// $('.js-test_default').myMVPSlider();

const options: ApplicationOption = {
  maxValue: 100,
  minValue: 0,
  step: 10,
  value: 30,
  isHorizontal: true,
  range: false,
  dragInterval: false,
  runner: true,
  bar: true,
  scale: false,
  displayValue: false,
  displayMin: false,
  displayMax: false,
  onStart: () => console.log('start'),
  onChange: () => console.log('change'),
  onFinish: () => console.log('finish'),
  onUpdate: () => console.log('update'),
};

$('.js-test_with_options').myMVPSlider(options);
