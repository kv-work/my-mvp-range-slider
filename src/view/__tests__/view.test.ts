import $ from 'jquery';
import SliderView from '../view';
import SliderBar from '../../bar/bar';
import SliderScale from '../../scale/scale';
import SliderRunner from '../../runner/runner';

const mockBarUpdate = jest.fn();
const mockBarDestroy = jest.fn();

jest.mock('../../bar/bar', jest.fn(() => jest.fn().mockImplementation(() => ({
  update: mockBarUpdate,
  destroy: mockBarDestroy,
}))));

const mockScaleUpdate = jest.fn();
const mockScaleDestroy = jest.fn();

jest.mock('../../scale/scale', jest.fn(() => jest.fn().mockImplementation(() => ({
  update: mockScaleUpdate,
  destroy: mockScaleDestroy,
}))));

const mockRunnerUpdate = jest.fn();
const mockRunnerDestroy = jest.fn();

jest.mock('../../runner/runner', jest.fn(() => jest.fn().mockImplementation(() => ({
  update: mockRunnerUpdate,
  destroy: mockRunnerDestroy,
}))));

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
    value: [10, 30],
    percentage: [20, 60],
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
    testView.destroy();

    jest.clearAllMocks();
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

    test('should create bar instance', () => {
      expect(testOptions.bar).toBeTruthy();
      expect(testView).toHaveProperty('bar');
      expect(SliderBar).toBeCalledTimes(1);
    });

    test('should create runner instance, if options.runner is true', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(testView).toHaveProperty('runner');
      expect(SliderRunner).toBeCalledTimes(1);
    });

    test('should create scale instance, if options.scale is true', () => {
      expect(testOptions.scale).toBeTruthy();
      expect(testView).toHaveProperty('scale');
      expect(SliderScale).toBeCalledTimes(1);
    });

    test('should reset isRendered flag to false', () => {
      expect(testView).toHaveProperty('isRendered', false);
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

    test('should append $view to container if isRendered is false', () => {
      expect(testView).toHaveProperty('isRendered', false);
      expect($container.find('.js-slider__container').length).toBe(0);
      testView.render(testRenderData);
      expect($container.find('.js-slider__container').length).toBe(1);
    });

    test('should set isRendered flag to true', () => {
      expect(testView).toHaveProperty('isRendered', false);
      testView.render(testRenderData);
      expect(testView).toHaveProperty('isRendered', true);
    });

    test('should attach event handlers to $view', () => {
      const $startEvent = $.Event('startChanging.myMVPSlider');
      const $changeEvent = $.Event('changeValue.myMVPSlider');
      const $finishEvent = $.Event('finish.myMVPSlider');
      const $dragRangeEvent = $.Event('dragRange.myMVPSlider');
      const $dropEvent = $.Event('dropRange.myMVPSlider');

      testView.render(testRenderData);

      const $view = $container.find('.js-slider__container');

      $view.trigger($startEvent);
      $view.trigger($changeEvent, [30, false]); // value: 30, isSecond: false
      $view.trigger($finishEvent, [30, false]); // value: 30, isSecond: false
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith([30, 60]);
      expect(mockFinish).toBeCalledWith([30, 60]);

      // second runner
      jest.clearAllMocks();
      $view.trigger($startEvent);
      $view.trigger($changeEvent, [50, true]); // value: 30, isSecond: true
      $view.trigger($finishEvent, [50, true]); // value: 30, isSecond: true
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith([20, 50]);
      expect(mockFinish).toBeCalledWith([20, 50]);

      // drag and drop interval
      jest.clearAllMocks();
      $view.trigger($startEvent, [true]); // isDragStart is true
      $view.trigger($dragRangeEvent, [20]);
      $view.trigger($dropEvent, [20]);

      // [20+20, 60+20] => [40, 80]
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith([40, 80]);
      expect(mockFinish).toBeCalledWith([40, 80]);

      jest.clearAllMocks();
      $view.trigger($startEvent, [true]);
      $view.trigger($dragRangeEvent, [50]);
      $view.trigger($dropEvent, [50]);
      // [20+50, 60+50] => [70, 110], but should [60, 100]
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith([60, 100]);
      expect(mockFinish).toBeCalledWith([60, 100]);

      jest.clearAllMocks();
      $view.trigger($startEvent, [true]);
      $view.trigger($dragRangeEvent, [-50]);
      $view.trigger($dropEvent, [-50]);
      // [20-50, 60-50] => [-30, 10], but should [0, 40]
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith([0, 40]);
      expect(mockFinish).toBeCalledWith([0, 40]);

      // if range is false
      jest.clearAllMocks();
      const $newNode = $('<div>', { class: 'new_node' });
      $('body').append($newNode);
      const newView: SliderView = new SliderView($newNode[0], {
        range: false,
        runner: true,
      });

      expect(newView).toHaveProperty('isRendered', false);

      newView.addObserver(testObserver);
      newView.render({
        data: [0, 10, 20],
        percentageData: [0, 50, 100],
        value: 10,
        percentage: 50,
      });
      expect(newView).toHaveProperty('isRendered', true);
      const $newView = $newNode.find('.js-slider__container');
      expect($newView.length).toBe(1);
      $newView.trigger($startEvent);
      $newView.trigger($changeEvent, [100]);
      $newView.trigger($finishEvent, [100]);
      expect(mockStart).toBeCalled();
      expect(mockChange).toBeCalledWith(100);
      expect(mockFinish).toBeCalledWith(100);
      newView.destroy();
      $newNode.remove();
    });

    test('should create second runner instance, if renderData.value is array', () => {
      expect(testOptions.runner).toBeTruthy();
      expect(Array.isArray(testRenderData.value)).toBeTruthy();
      testView.render(testRenderData);
      expect(testView).toHaveProperty('secondRunner');
      expect(SliderRunner).toBeCalledTimes(1);
    });

    test('should update bar, scale, runner, secondRunner', () => {
      testView.render(testRenderData);
      expect(mockBarUpdate).toBeCalledTimes(1);
      expect(mockScaleUpdate).toBeCalledTimes(1);
      expect(mockRunnerUpdate).toBeCalledTimes(2);
      // create second runner
      expect(SliderRunner).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    let newView: SliderView;

    beforeEach(() => {
      newView = new SliderView(testNode, {
        isHorizontal: false,
        bar: false,
        scale: false,
        runner: false,
        range: false,
      });
      testView.render(testRenderData);
      jest.clearAllMocks();
    });

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

      testView.update({ scaleStep: undefined });
      expect(testView.getData().scaleStep).toBe(25);

      testView.update({ scaleStep: 20 });
      expect(testView.getData().scaleStep).toBe(20);

      testView.update({ prefix: '+', postfix: '!' });
      expect(testView.getData().prefix).toBe('+');
      expect(testView.getData().postfix).toBe('!');
    });

    test('should update bar, scale, runner and secondRunner', () => {
      testView.update({ isHorizontal: false });

      expect(mockBarUpdate).toBeCalledTimes(1);
      expect(mockScaleUpdate).toBeCalledTimes(1);
      expect(mockRunnerUpdate).toBeCalledTimes(2);
    });

    test('should destroy bar,if options.bar is false', () => {
      testView.update({ bar: false });

      expect(mockBarDestroy).toBeCalled();
    });

    test('should create SliderBar instance if (options.bar && !this.bar) is true', () => {
      newView.render({
        data: [0, 1, 2, 3, 4],
        percentageData: [0, 25, 50, 75, 100],
        value: [1, 3],
        percentage: [25, 75],
      });

      newView.update({ bar: true });
      expect(SliderBar).toBeCalledTimes(1);

      newView.destroy();
    });

    test('should destroy scale,if options.scale is false', () => {
      testView.update({ scale: false });

      expect(mockScaleDestroy).toBeCalled();
    });

    test('should create SliderScale instance if (options.scale && !this.scale) is true', () => {
      newView.render({
        data: [0, 1, 2, 3, 4],
        percentageData: [0, 25, 50, 75, 100],
        value: [1, 3],
        percentage: [25, 75],
      });

      newView.update({ scale: true });
      expect(SliderScale).toBeCalledTimes(1);

      newView.destroy();
    });

    test('should destroy runner and secondRunner,if options.runner is false', () => {
      testView.update({ runner: false });

      expect(mockRunnerDestroy).toBeCalledTimes(2);
    });

    test('should destroy secondRunner,if options.range is false', () => {
      testView.update({ range: false });

      expect(mockRunnerDestroy).toBeCalledTimes(1);
    });

    test('should create SliderRunner instance if (options.runner && !this.runner) is true', () => {
      newView.render({
        data: [0, 1, 2, 3, 4],
        percentageData: [0, 25, 50, 75, 100],
        value: 1,
        percentage: 25,
      });

      newView.update({ runner: true });
      expect(SliderRunner).toBeCalledTimes(1);

      newView.destroy();
    });

    test('should create runner and secondRunner instances if (options.runner && options.range && !this.runner && !this.secondRunner && Array.isArray(renderData.value)) is true', () => {
      newView.render({
        data: [0, 1, 2, 3, 4],
        percentageData: [0, 25, 50, 75, 100],
        value: [1, 3],
        percentage: [25, 75],
      });

      newView.update({
        runner: true,
        range: true,
      });
      expect(SliderRunner).toBeCalledTimes(2);

      newView.destroy();
    });

    test('should re-render view with current renderData', () => {
      const $container = $('#container');
      expect(testView.getData().isHorizontal).toBe(true);
      expect($container.find('.slider__container_horizontal').length).toBe(1);

      testView.update({ isHorizontal: false });
      expect(testView.getData().isHorizontal).toBe(false);
      expect($container.find('.slider__container_horizontal').length).toBe(0);
      expect($container.find('.slider__container').length).toBe(1);
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

  describe('destroy', () => {
    beforeEach(() => {
      testView.render(testRenderData);
    });

    test('should call destroy methods of SliderBar, SliderScale, SliderRunner', () => {
      testView.destroy();
      expect(mockBarDestroy).toBeCalledTimes(1);
      expect(mockScaleDestroy).toBeCalledTimes(1);
      expect(mockRunnerDestroy).toBeCalledTimes(2);
    });

    test('should detach event listeners', () => {
      const $startEvent = $.Event('startChanging.myMVPSlider');
      const $changeEvent = $.Event('changeValue.myMVPSlider');
      const $finishEvent = $.Event('finish.myMVPSlider');
      const $dragRangeEvent = $.Event('dragRange.myMVPSlider');
      const $dropEvent = $.Event('dropRange.myMVPSlider');

      const $view = $(testNode).find('.js-slider__container');
      testView.destroy();

      $view.trigger($startEvent);
      $view.trigger($changeEvent);
      $view.trigger($finishEvent);
      $view.trigger($dragRangeEvent);
      $view.trigger($dropEvent);

      expect(mockStart).not.toBeCalled();
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });

    test('should remove $view', () => {
      expect($(testNode).find('.js-slider__container').length).toBe(1);
      testView.destroy();
      expect($(testNode).find('.js-slider__container').length).toBe(0);
    });

    test('should reset isRendered flag to false', () => {
      expect(testView).toHaveProperty('isRendered', true);
      testView.destroy();
      expect(testView).toHaveProperty('isRendered', false);
    });
  });
});
