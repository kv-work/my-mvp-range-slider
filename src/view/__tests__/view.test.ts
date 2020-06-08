import $ from 'jquery';
import SliderView from '../view';

describe('SliderView', () => {
  document.body.innerHTML = '<div id="container"></div>';

  const testNode = document.getElementById('container');
  const testOptions: View.Options = {
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
  const testRenderData: View.RenderData = {
    data: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    value: 4,
  };

  HTMLElement.prototype.getBoundingClientRect = (): DOMRect => ({
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    bottom: 100,
    left: 0,
    right: 100,
    top: 0,
    toJSON: (): void => {},
  });

  const mockUpdate = jest.fn();
  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();

  let testView: SliderView;
  let testObserver: View.Observer;

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
          const observers: Set<View.Observer> = entry[1];
          expect(observers.size).toEqual(0);
        }
      });
    });

    test('should create $view', () => {
      expect(testView).toHaveProperty('$view');
    });

    test('should create bar instance, if options.bar is true', () => {
      expect(testOptions.bar).toBeTruthy();
      expect(testView).toHaveProperty('bar');
    });

    test('should create runner instance, if options.runner is true', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(testView).toHaveProperty('runner');
    });

    test('should create scale instance, if options.scale is true', () => {
      expect(testOptions.scale).toBeTruthy();
      expect(testView).toHaveProperty('scale');
    });

    test('should create second runner instance, if options.range and options.runner is true', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(testOptions.range).toBeTruthy();
      expect(testView).toHaveProperty('secondRunner');
    });
  });

  describe('getData', () => {
    test('should return view data', () => {
      expect(testView.getData()).toEqual(testOptions);
    });
  });

  describe('render', () => {
    const $container = $('#container');
    beforeEach(() => {
      testView.addObserver(testObserver);
      jest.clearAllMocks();
    });
    test('should save render data to this.renderData', () => {
      expect(testView).not.toHaveProperty('renderData');
      testView.render(testRenderData);
      expect(testView).toHaveProperty('renderData', testRenderData);
    });

    test('should append bar, runner, secondRunner to container node only once', () => {
      testView.render(testRenderData);
      expect($(testNode).find('.js-slider__bar').length).toBe(1);
      expect($(testNode).find('.runner_first').length).toBe(1);
      expect($(testNode).find('.js-slider__scale').length).toBe(1);
      expect($(testNode).find('.runner_second').length).toBe(1);

      testView.render({
        ...testRenderData,
        value: 5,
      });
      expect($(testNode).find('.js-slider__bar').length).toBe(1);
      expect($(testNode).find('.runner_first').length).toBe(1);
      expect($(testNode).find('.js-slider__scale').length).toBe(1);
      expect($(testNode).find('.runner_second').length).toBe(1);
    });

    test('should attach event handlers for bar', () => {
      testView.render(testRenderData);
      expect($(testNode).find('.js-slider__bar').length).toBe(1);

      const $clickEvent = $.Event('click', {
        clientX: 50,
      });

      const $bar = $container.find('.js-slider__bar');
      $bar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange).toBeCalledWith(50);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(50);
    });

    test('should attach event handlers for runner', () => {
      testView.render(testRenderData);
      expect($(testNode).find('.runner_first').length).toBe(1);

      const $mouseDownEvent = $.Event('mousedown');
      const $mouseMoveEvent = $.Event('mousemove', {
        clientX: 70,
      });
      const $AnotherMouseMoveEvent = $.Event('mousemove', {
        clientX: 90,
      });
      const mouseUpEvent = new Event('mouseup');

      $container.find('.js-slider__container')
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(0);

      $('.js-slider__runner.runner_first').trigger($mouseDownEvent);
      expect(mockStart).toBeCalledTimes(1);

      $container.find('.js-slider__container')
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(2);
      expect(mockChange.mock.calls[0][0]).toBe(70);
      expect(mockChange.mock.calls[1][0]).toBe(90);

      document.dispatchEvent(mouseUpEvent);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(90);
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
          const observers: Set<View.Observer> = entry[1];
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
          const observers: Set<View.Observer> = entry[1];
          expect(observers.has(testObserver)).toBeTruthy();
        }
      });

      testView.removeObserver(testObserver);

      entries = Object.entries(testView);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<View.Observer> = entry[1];
          expect(observers.has(testObserver)).toBeFalsy();
        }
      });
    });
  });
});
