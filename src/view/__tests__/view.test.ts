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

    test('should create $bar element, if options.bar is true', () => {
      expect(testOptions.bar).toBeTruthy();
      expect(testView).toHaveProperty('$bar');
    });

    test('should create $runner element, if options.runner is true', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(testView).toHaveProperty('$runner');
    });

    test('should create $scale element, if options.scale is true', () => {
      expect(testOptions.scale).toBeTruthy();
      expect(testView).toHaveProperty('$scale');
    });

    test('should create $secondRunner element, if options.range and options.runner is true', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(testOptions.range).toBeTruthy();
      expect(testView).toHaveProperty('$secondRunner');
    });
  });
});
