import $ from 'jquery';
import SliderView from '../view';
import { ViewData } from '../../types';

// const $ = require('jquery');

describe('SliderView', () => {
  document.body.innerHTML = '<div id="container"></div>';

  const testNode = document.getElementById('container');
  const testOptions: ViewData = {
    orientation: 'horizontal',
    range: true,
    dragInterval: true,
    runner: true,
    bar: true,
    scale: true,
    scaleStep: 25,
    displayScaleValue: true,
    displayValue: true,
    displayMin: true,
    displayMax: true,
    prefix: 'value',
    postfix: '$',
  };

  let testView: SliderView;

  beforeEach(() => {
    testView = new SliderView(testNode, testOptions);
  });

  describe('constructor', () => {
    test('should set props: $container, options', () => {
      expect(testView).toHaveProperty('$container', $(testNode));
      expect(testView).toHaveProperty('viewOptions', testOptions);
    });
  });
});
