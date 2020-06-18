import $ from 'jquery';
import SliderBar from '../bar';

describe('bar', () => {
  document.body.innerHTML = `
    <div id="view_container"></div>
    <div id="view_container_horizontal"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');

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

  let testBar: SliderBar;
  let verticalBar: SliderBar;

  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();
  const mockDragRange = jest.fn();
  const mockDropRange = jest.fn();

  $horizontalView.bind('startChanging.myMVPSlider', mockStart);
  $horizontalView.bind('changeValue.myMVPSlider', mockChange);
  $horizontalView.bind('finish.myMVPSlider', mockFinish);
  $horizontalView.bind('dragRange.myMVPSlider', mockDragRange);
  $horizontalView.bind('dropRange.myMVPSlider', mockDropRange);

  $verticalView.bind('startChanging.myMVPSlider', mockStart);
  $verticalView.bind('changeValue.myMVPSlider', mockChange);
  $verticalView.bind('finish.myMVPSlider', mockFinish);
  $verticalView.bind('dragRange.myMVPSlider', mockDragRange);
  $verticalView.bind('dropRange.myMVPSlider', mockDropRange);

  beforeEach(() => {
    testBar = new SliderBar({ $viewContainer: $('#view_container_horizontal') });
    verticalBar = new SliderBar({ $viewContainer: $('#view_container') });
  });

  afterEach(() => {
    $horizontalView.empty();
    $verticalView.empty();
  });

  describe('constructor', () => {
    test('should create $view, $bar', () => {
      expect(testBar).toHaveProperty('$view', $('#view_container_horizontal'));
      expect(testBar).toHaveProperty('$bar');

      expect(verticalBar).toHaveProperty('$view', $('#view_container'));
      expect(verticalBar).toHaveProperty('$bar');
    });

    test('should reset isRender flag', () => {
      expect(testBar).toHaveProperty('isRendered', false);
    });
  });

  describe('update', () => {
    let $bar: JQuery;
    let $vertBar: JQuery;

    beforeEach(() => {
      testBar.update({
        options: {
          isHorizontal: true,
          range: true,
          dragInterval: false,
        },
        data: 20,
      });
      verticalBar.update({
        options: {
          isHorizontal: false,
          range: true,
          dragInterval: false,
        },
        data: 20,
      });

      $bar = $horizontalView.find('.js-slider__bar');
      $vertBar = $verticalView.find('.js-slider__bar');

      jest.clearAllMocks();
    });

    test('should append $bar to $view, if isRender is false', () => {
      expect($horizontalView.find('.js-slider__bar').length).toBe(1);
      expect($verticalView.find('.js-slider__bar').length).toBe(1);
    });

    test('should save render options and data in data attr of $bar', () => {
      expect($bar.data('options')).toEqual({
        isHorizontal: true,
        range: true,
        dragInterval: false,
      });
      expect($bar.data('data')).toEqual(20);
    });

    test('should attache click event handler to bar', () => {
      let $clickEvent = $.Event('click', {
        clientX: 30,
        clientY: 20,
      });

      $bar.trigger($clickEvent);

      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(30);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(30);

      jest.clearAllMocks();

      $vertBar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(20);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(20);

      // if type of data is Array and options.range is true
      jest.clearAllMocks();
      testBar.update({
        options: {
          range: true,
        },
        data: [20, 60],
      });
      expect($bar.data('data')).toEqual([20, 60]);
      $clickEvent = $.Event('click', {
        clientX: 50,
        clientY: 20,
      });

      $bar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(50); // value
      expect(mockChange.mock.calls[0][2]).toBe(true); // isSecond
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(50); // value
      expect(mockFinish.mock.calls[0][2]).toBe(true); // isSecond

      $clickEvent = $.Event('click', {
        clientX: 30,
        clientY: 20,
      });

      jest.clearAllMocks();
      expect($bar.data('data')).toEqual([20, 60]);
      $bar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(30); // value
      expect(mockChange.mock.calls[0][2]).toBe(false); // isSecond
      expect(mockFinish.mock.calls[0][1]).toBe(30); // value
      expect(mockFinish.mock.calls[0][2]).toBe(false); // isSecond
    });

    test('should attach drag and drop event handler to $range, if options.range && options.dragInterval && Array.isArray(data)', () => {
      testBar.update({
        options: { dragInterval: true },
        data: [20, 60],
      });

      const $mousedownEvent = $.Event('mousedown', {
        clientX: 40,
        clientY: 30,
      });
      const $range = $horizontalView.find('.slider__range');

      $range.trigger($mousedownEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();

      const $mousemoveEvent = $.Event('mousemove', {
        clientX: 50,
        clientY: 40,
      });
      const $newMousemoveEvent = $.Event('mousemove', {
        clientX: 70,
        clientY: 60,
      });

      $bar
        .trigger($mousemoveEvent)
        .trigger($newMousemoveEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDragRange).toBeCalledTimes(2);
      expect(mockDragRange.mock.calls[0][1]).toBe(10);
      expect(mockDragRange.mock.calls[1][1]).toBe(30);

      const mouseUpEvent = new Event('mouseup');

      document.dispatchEvent(mouseUpEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDropRange).toBeCalledTimes(1);
      expect(mockDropRange.mock.calls[0][1]).toBe(30);

      // vertical
      jest.clearAllMocks();
      verticalBar.update({
        options: { dragInterval: true },
        data: [20, 50],
      });

      const $vertRange = $verticalView.find('.slider__range');

      $vertRange.trigger($mousedownEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();

      $vertBar
        .trigger($mousemoveEvent)
        .trigger($newMousemoveEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDragRange).toBeCalledTimes(2);
      expect(mockDragRange.mock.calls[0][1]).toBe(10);
      expect(mockDragRange.mock.calls[1][1]).toBe(30);

      document.dispatchEvent(mouseUpEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDropRange).toBeCalledTimes(1);
      expect(mockDropRange.mock.calls[0][1]).toBe(30);

      // click on range
      jest.clearAllMocks();
      const $clickEvent = $.Event('click');

      $range.trigger($clickEvent);
      $vertRange.trigger($clickEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });

    test('should set isRender flag', () => {
      expect(testBar).toHaveProperty('isRendered', true);
    });

    test('should add class slider__bar_horizontal, if isHorizontal option changed from false to true', () => {
      verticalBar.update({ options: { isHorizontal: true }, data: 20 });
      expect($verticalView.find('.slider__bar_horizontal').length).toBe(1);
    });

    test('should remove class slider__bar_horizontal, if isHorizontal option changed from true to false', () => {
      testBar.update({ options: { isHorizontal: false }, data: 100 });
      expect($horizontalView.find('.slider__bar_horizontal').length).toBe(0);
    });

    test('should append bar range to $bar if options.range is true', () => {
      expect($bar.data('options').range).toBeTruthy();
      expect($bar.find('.slider__range').length).toBe(1);
    });

    test('should remove bar range if options.range is false', () => {
      expect($bar.find('.slider__range').length).toBe(1);
      testBar.update({ options: { range: false }, data: 0 });
      expect($bar.find('.slider__range').length).toBe(0);
    });

    test('should detach bar range event listeners if options.dragInterval is false', () => {
      testBar.update({ options: { dragInterval: true }, data: [20, 60] });
      testBar.update({
        options: { dragInterval: false },
        data: [20, 60],
      });
      const $mousedownEvent = $.Event('mousedown', {
        clientX: 40,
        clientY: 30,
      });
      const $range = $horizontalView.find('.slider__range');
      expect($bar.data('options').dragInterval).toBeFalsy();

      $range.trigger($mousedownEvent);
      // expect(mockStart).not.toBeCalled();
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();

      const $mousemoveEvent = $.Event('mousemove', {
        clientX: 50,
        clientY: 30,
      });
      const $newMousemoveEvent = $.Event('mousemove', {
        clientX: 70,
        clientY: 10,
      });

      $bar
        .trigger($mousemoveEvent)
        .trigger($newMousemoveEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDragRange).not.toBeCalled();
      const mouseUpEvent = new Event('mouseup');

      document.dispatchEvent(mouseUpEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
      expect(mockDropRange).not.toBeCalled();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      testBar.update({
        options: {
          isHorizontal: true,
          range: true,
          dragInterval: false,
        },
        data: 20,
      });
      verticalBar.update({
        options: {
          isHorizontal: false,
          range: true,
          dragInterval: false,
        },
        data: 20,
      });
      jest.clearAllMocks();
    });

    test('should detach bar', () => {
      const $bar = $horizontalView.find('.js-slider__bar');
      expect($bar.length).toBe(1);

      testBar.destroy();
      expect($horizontalView.find('.js-slider__bar').length).toBe(0);

      testBar.update({
        data: [10, 90],
        options: {
          isHorizontal: true,
          range: true,
          dragInterval: false,
        },
      });
      const $horizontalBar = $horizontalView.find('.slider__bar_horizontal');

      expect($horizontalBar.length).toBe(1);
    });

    test('should remove bar event listeners', () => {
      const $clickEvent = $.Event('click', {
        clientX: 30,
        clientY: 20,
      });
      const $bar = $horizontalView.find('.js-slider__bar');
      $bar.trigger($clickEvent);

      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledTimes(1);
      jest.clearAllMocks();

      testBar.destroy();
      $bar.trigger($clickEvent);
      expect(mockStart).not.toBeCalled();
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });

    test('should reset isRender flag', () => {
      testBar.destroy();
      expect(testBar).toHaveProperty('isRendered', false);
    });
  });
});
