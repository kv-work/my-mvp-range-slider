import $ from 'jquery';
import SliderView from '../view';
import { ViewData, Observer, ViewRenderData } from '../../types';

// const $ = require('jquery');

describe('SliderView', () => {
  document.body.innerHTML = '<div id="container"></div>';

  const testNode = document.getElementById('container');
  const testOptions: ViewData = {
    isHorizontal: true,
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
  const testRenderData: ViewRenderData = {
    data: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    value: 4,
  };

  HTMLElement.prototype.getBoundingClientRect = (): DOMRect => ({
    x: 30,
    y: 50,
    height: 100,
    width: 100,
    bottom: 100,
    left: 30,
    right: 100,
    top: 50,
    toJSON: (): void => {},
  });

  const mockUpdate = jest.fn();
  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();

  let testView: SliderView;
  let testObserver: Observer;

  beforeEach(() => {
    testView = new SliderView(testNode, testOptions);
    testObserver = {
      update: mockUpdate,
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    };
  });

  afterEach(() => {
    $(testNode).html('');
  });

  describe('constructor', () => {
    test('should set props: $container, options', () => {
      expect(testView).toHaveProperty('$container', $(testNode));
      expect(testView).toHaveProperty('viewOptions', testOptions);
    });

    test('should create empty Set object this.observers', () => {
      expect(testView).toHaveProperty('observers');

      const entries = Object.entries(testView);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.size).toEqual(0);
        }
      });
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

  describe('getData', () => {
    test('should return view data', () => {
      expect(testView.getData()).toEqual(testOptions);
    });
  });

  describe('render', () => {
    test('should save render data to this.renderData', () => {
      expect(testView).not.toHaveProperty('renderData');
      testView.render(testRenderData);
      expect(testView).toHaveProperty('renderData', testRenderData);
    });

    test('should create $view if this.$view is undefined', () => {
      expect(testView).not.toHaveProperty('$view');
      testView.render(testRenderData);
      expect(testView).toHaveProperty('$view');
    });

    test('should append bar, scale, runner, secondRunner to container node only once', () => {
      expect(testView).not.toHaveProperty('$view');
      testView.render(testRenderData);
      expect($(testNode).find('.js-slider__bar').length).toBe(1);
      expect($(testNode).find('.js-slider__runner').length).toBe(1);
      expect($(testNode).find('.js-slider__scale').length).toBe(1);
      expect($(testNode).find('.js-slider__second_runner').length).toBe(1);

      testView.render({ value: 5 });
      expect($(testNode).find('.js-slider__bar').length).toBe(1);
      expect($(testNode).find('.js-slider__runner').length).toBe(1);
      expect($(testNode).find('.js-slider__scale').length).toBe(1);
      expect($(testNode).find('.js-slider__second_runner').length).toBe(1);
    });
  });

  describe('update', () => {
    test('should update this.viewOptions', () => {
      testView.update({ isHorizontal: false });
      expect(testView.getData().isHorizontal).toBe(false);

      testView.update({
        bar: false,
        scale: false,
      });

      expect(testView.getData()).toEqual({
        isHorizontal: false,
        range: true,
        dragInterval: true,
        runner: true,
        bar: false,
        scale: false,
        scaleStep: 25,
        displayScaleValue: true,
        displayValue: true,
        displayMin: true,
        displayMax: true,
        prefix: 'value',
        postfix: '$',
      });
    });

    test('should validate data', () => {
      testView.update({
        isHorizontal: undefined,
        range: undefined,
        dragInterval: undefined,
        runner: undefined,
        bar: undefined,
        scale: undefined,
        scaleStep: -25,
        displayScaleValue: undefined,
        displayValue: undefined,
        displayMin: undefined,
        displayMax: undefined,
        prefix: undefined,
        postfix: undefined,
      });

      testView.update({
        isHorizontal: null,
        range: null,
        dragInterval: null,
        runner: null,
        bar: null,
        scale: null,
        scaleStep: 0,
        displayScaleValue: null,
        displayValue: null,
        displayMin: null,
        displayMax: null,
        prefix: null,
        postfix: null,
      });

      testView.update({ scaleStep: NaN });

      expect(testView.getData()).toEqual({
        isHorizontal: true,
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
      });
    });

    test('should re-render view with current renderData', () => {

    });
  });

  describe('addObserver', () => {
    test('should added observer to this.observers', () => {
      testView.addObserver(testObserver);

      const entries = Object.entries(testView);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.has(testObserver)).toBeTruthy();
        }
      });
    });
  });

  describe('removeObserver', () => {
    test('should removed observer from this.observers', () => {
      testView.addObserver(testObserver);

      let entries = Object.entries(testView);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.has(testObserver)).toBeTruthy();
        }
      });

      testView.removeObserver(testObserver);

      entries = Object.entries(testView);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.has(testObserver)).toBeFalsy();
        }
      });
    });
  });

  describe('createSliderContainer', () => {
    test('should attache event handlers for bar, scale and runners', () => {
      testView.render(testRenderData);
      expect($(testNode).find('.js-slider__bar').length).toBe(1);
      const $bar = $(testNode).find('.js-slider__bar');
      const $view = $(testNode).find('.js-slider__container');

      const $mouseDownEvent = $.Event('mousedown', {
        clientX: 60,
      });

      // const mouseDownEvent = new Event('mousedown');

      // $bar[0].dispatchEvent(mouseDownEvent);
      $('.js-slider__bar').trigger($mouseDownEvent);

      expect(mockStart).toBeCalledTimes(1);
      $view.trigger('mousemove');
      expect(mockChange).toBeCalledTimes(1);
      $bar.trigger('mouseup');
      expect(mockFinish).toBeCalledTimes(1);
    });
  });
});
