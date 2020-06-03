import $ from 'jquery';
import SliderBar from '../bar';

describe('bar', () => {
  document.body.innerHTML = `
    <div id="view_container"></div>
    <div id="view_container_horizontal"></div>
  `;

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

  const testOptions = {
    $viewContainer: $('#view_container_horizontal'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
  };
  const vertOptions = {
    $viewContainer: $('#view_container'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
  };

  const renderOpts: Bar.RenderOptions = {
    isHorizontal: true,
    range: true,
    dragInterval: false,
  };
  const vertRenderOpts: Bar.RenderOptions = {
    ...renderOpts,
    isHorizontal: false,
  };

  beforeEach(() => {
    testBar = new SliderBar(testOptions);
    verticalBar = new SliderBar(vertOptions);
  });

  describe('constructor', () => {
    test('should create $container, observer', () => {
      expect(testBar).toHaveProperty('observer', testOptions.observer);
      expect(testBar).toHaveProperty('$container', testOptions.$viewContainer);

      expect(verticalBar).toHaveProperty('observer', vertOptions.observer);
      expect(verticalBar).toHaveProperty('$container', vertOptions.$viewContainer);
    });

    test('should reset isRendered flag', () => {
      expect(testBar).toHaveProperty('isRendered', false);
      expect(verticalBar).toHaveProperty('isRendered', false);
    });
  });
  describe('render', () => {
    const $horizontalView = $('#view_container_horizontal');
    const $verticalView = $('#view_container');

    beforeEach(() => {
      testBar.render([40, 60], renderOpts);
      verticalBar.render([40, 60], vertRenderOpts);
      jest.clearAllMocks();
    });

    afterEach(() => {
      $('#view_container').empty();
      $('#view_container_horizontal').empty();
    });

    test('should create $bar prop', () => {
      expect(testBar).toHaveProperty('$bar');
      expect(verticalBar).toHaveProperty('$bar');
    });

    test('should append $bar to $container', () => {
      expect($horizontalView.find('.js-slider__bar').length).toBe(1);
      expect($verticalView.find('.js-slider__bar').length).toBe(1);
    });

    test('should update bar if it is rendered', () => {
      const newData: [number, number] = [30, 70];

      testBar.render(newData, renderOpts);

      expect($horizontalView.find('.js-slider__bar').length).toBe(1);
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
});
