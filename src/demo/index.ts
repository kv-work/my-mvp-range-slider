import $ from 'jquery';
import '../plugin/plugin';
import { ApplicationOption } from '../types';

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
  onStart: () => {},
  onChange: () => {},
  onFinish: () => {},
  onUpdate: () => {},
};

const anotherOptions: ApplicationOption = {
  maxValue: 100,
  minValue: 0,
  step: 10,
  value: 30,
  secondValue: 75,
  isHorizontal: false,
  range: true,
  dragInterval: false,
  runner: true,
  bar: true,
  scale: false,
  displayValue: false,
  displayMin: false,
  displayMax: false,
  onStart: () => {},
  onChange: () => {},
  onFinish: () => {},
  onUpdate: () => {},
};

$('.js-test_with_options').myMVPSlider(options);
$('.js-test_with_another_options').myMVPSlider(anotherOptions);
