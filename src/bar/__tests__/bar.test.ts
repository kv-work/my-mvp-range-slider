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

  $horizontalView.bind('myMVPSlider.startChanging', mockStart);
  $horizontalView.bind('myMVPSlider.changeValue', mockChange);
  $horizontalView.bind('myMVPSlider.finish', mockFinish);

  $verticalView.bind('myMVPSlider.startChanging', mockStart);
  $verticalView.bind('myMVPSlider.changeValue', mockChange);
  $verticalView.bind('myMVPSlider.finish', mockFinish);

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

    test('should append $bar to $view, if isRender is false', () => {
      expect($horizontalView.find('.js-slider__bar').length).toBe(1);
      expect($verticalView.find('.js-slider__bar').length).toBe(1);
    });

    test('should save render options and data in data attr of $bar', () => {
      const $bar = $horizontalView.find('.js-slider__bar');

      expect($bar.data('options')).toEqual({
        isHorizontal: true,
        range: true,
        dragInterval: false,
      });
      expect($bar.data('data')).toEqual(20);
    });

    test('should attache click event handler to bar', () => {
      const $clickEvent = $.Event('click', {
        clientX: 30,
        clientY: 20,
      });
      const $bar = $horizontalView.find('.js-slider__bar');
      $bar.trigger($clickEvent);

      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(30);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(30);

      jest.clearAllMocks();
      const $vertBar = $verticalView.find('.js-slider__bar');
      $vertBar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(20);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(20);
    });

    test('should set isRender flag', () => {
      expect(testBar).toHaveProperty('isRendered', true);
    });

    test('should add class slider__bar_horizontal, if isHorizontal option changed from false to true', () => {
      verticalBar.update({ options: { isHorizontal: true }, data: 20 });
      expect($verticalView.find('.slider__bar_horizontal').length).toBe(1);
    });

    test('should append bar range to $bar if options.range is true', () => {
      const $bar = $horizontalView.find('.js-slider__bar');
      expect($bar.data('options').range).toBeTruthy();
      expect($bar.find('.slider__range').length).toBe(1);
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
