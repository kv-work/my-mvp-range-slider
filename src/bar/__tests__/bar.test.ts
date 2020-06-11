/* eslint-disable fsd/no-function-declaration-in-event-listener */
import $ from 'jquery';
import SliderBar from '../bar';

describe.only('bar', () => {
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

  const horzOptions = {
    $viewContainer: $('#view_container_horizontal'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
    renderOptions: {
      isHorizontal: true,
      range: true,
      dragInterval: false,
    },
    data: 10,
  };
  const vertOptions = {
    $viewContainer: $('#view_container'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
    renderOptions: {
      isHorizontal: false,
      range: true,
      dragInterval: false,
    },
    data: 20,
  };

  beforeEach(() => {
    testBar = new SliderBar(horzOptions);
    verticalBar = new SliderBar(vertOptions);
  });

  afterEach(() => {
    $horizontalView.empty();
    $verticalView.empty();
  });

  describe('constructor', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should create $view, observer, $bar', () => {
      expect(testBar).toHaveProperty('observer', horzOptions.observer);
      expect(testBar).toHaveProperty('$view', horzOptions.$viewContainer);
      expect(testBar).toHaveProperty('$bar');

      expect(verticalBar).toHaveProperty('observer', vertOptions.observer);
      expect(verticalBar).toHaveProperty('$view', vertOptions.$viewContainer);
      expect(verticalBar).toHaveProperty('$bar');
    });

    test('should append $bar to $view', () => {
      expect($horizontalView.find('.js-slider__bar').length).toBe(1);
      expect($verticalView.find('.js-slider__bar').length).toBe(1);
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
      expect(mockChange).toBeCalledWith(30);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(30);

      jest.clearAllMocks();
      const $vertBar = $verticalView.find('.js-slider__bar');
      $vertBar.trigger($clickEvent);
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange).toBeCalledWith(20);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(20);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should detach bar', () => {
      const $bar = $horizontalView.find('.js-slider__bar');
      expect($bar.length).toBe(1);

      testBar.destroy();
      expect($horizontalView.find('.js-slider__bar').length).toBe(0);

      // testBar.update({
      //   data: [10, 90],
      //   options: renderOpts,
      // });
      // const $horizontalBar = $horizontalView.find('.slider__bar_horizontal');

      // expect($horizontalBar.length).toBe(1);
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
      expect(mockChange).toBeCalledWith(30);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(30);
      jest.clearAllMocks();

      testBar.destroy();
      $bar.trigger($clickEvent);
      expect(mockStart).not.toBeCalled();
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });
  });
});
