import $ from 'jquery';
import SliderScale from '../scale';

describe('scale', () => {
  document.body.innerHTML = `
    <div id="view_container"></div>
    <div id="view_container_horizontal"></div>
  `;

  let testScale: SliderScale;
  let verticalScale: SliderScale;

  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();
  const renderOptions: Scale.RenderOptions = {
    isHorizontal: true,
    scaleStep: 1,
    displayScaleValue: true,
    displayMin: true,
    displayMax: true,
  };
  const vertRenderOptions: Scale.RenderOptions = {
    ...renderOptions,
    isHorizontal: false,
  };
  const testOptions: Scale.Options = {
    $viewContainer: $('#view_container_horizontal'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
  };
  const vertOptions: Scale.Options = {
    $viewContainer: $('#view_container'),
    observer: {
      start: mockStart,
      change: mockChange,
      finish: mockFinish,
    },
  };
  const testRenderData: View.RenderData = {
    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  };

  beforeEach(() => {
    testScale = new SliderScale(testOptions);
    verticalScale = new SliderScale(vertOptions);
  });

  describe('constructor', () => {
    test('should save $container in prop', () => {
      expect(testScale).toHaveProperty('$container', testOptions.$viewContainer);
    });

    test('should save observer object in prop', () => {
      expect(testScale).toHaveProperty('observer', testOptions.observer);
    });

    test('should reset isRendered flag', () => {
      expect(testScale).toHaveProperty('isRendered', false);
    });
  });
  describe('render', () => {
    beforeEach(() => {
      testScale.render(testRenderData, renderOptions);
      verticalScale.render(testRenderData, vertRenderOptions);
      jest.clearAllMocks();
    });

    afterEach(() => {
      $('#view_container').empty();
      $('#view_container_horizontal').empty();
    });

    test('should create and save in prop jQuery element container of scale elements', () => {
      expect(testScale).toHaveProperty('$scale');
      expect(verticalScale).toHaveProperty('$scale');
    });

    test('should create and append scale elements to view container', () => {
      const $verticalView = $('#view_container');
      const $view = $('#view_container_horizontal');
      const $horizontalScale = $view.find('.slider__scale_horizontal');
      const $verticalScale = $verticalView.find('.slider__scale');
      const $horizontalElements = $horizontalScale.find('.scale__element_horizontal');
      const $verticalElements = $verticalScale.find('.scale__element');

      // expect($horizontalScale.length).toBe(1);
      expect($verticalScale.length).toBe(1);
      expect($horizontalElements.length).toBe(testRenderData.percentageData.length);
      expect($verticalElements.length).toBe(testRenderData.percentageData.length);
    });

    test('should render element.toString() content', () => {
      const $container = $('#view_container_horizontal');
      const newData = {
        data: [
          { toString(): string { return '1'; } },
          { toString(): string { return 'second'; } },
          { toString(): string { return '3333'; } },
        ],
        percentageData: [0, 50, 100],
      };

      testScale.render(newData, renderOptions);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(3);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should update scale if it is rendered', () => {
      const $container = $('#view_container_horizontal');
      const newData = { data: [3, 4, 5, 6, 7, 8], percentageData: [0, 20, 40, 60, 80, 100] };

      testScale.render(newData, renderOptions);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(6);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should attach event handlers to scale elements', () => {
      const $clickEvent = $.Event('click');
      const $scale = $('.js-slider__scale');
      const scaleElement = $scale.find('.scale__element_horizontal')[5];

      expect($scale.find('.scale__element_horizontal').length).toBe(11);
      $(scaleElement).trigger($clickEvent);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange).toBeCalledWith(50);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish).toBeCalledWith(50);

      mockChange.mockClear();
      const $scaleClickEvent = $.Event('click', {
        target: $scale[0],
      });
      $scale.trigger($scaleClickEvent);
      expect(mockChange).not.toBeCalled();
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      testScale.render(testRenderData, renderOptions);
      jest.clearAllMocks();
    });

    test('should detach scale container', () => {
      const $scale = $('.js-slider__scale');
      expect($scale.length).toBe(1);
      expect($scale.find('.scale__element').length).not.toBe(0);

      testScale.destroy();
      expect($('.js-slider__scale').length).toBe(0);
      expect($('#view_container').find('.scale__element').length).toBe(0);

      testScale.render(testRenderData, renderOptions);
      const $view = $('#view_container_horizontal');
      const $horizontalScale = $view.find('.slider__scale_horizontal');
      const $horizontalElements = $horizontalScale.find('.scale__element_horizontal');

      expect($horizontalScale.length).toBe(1);
      expect($horizontalElements.length).toBe(testRenderData.percentageData.length);
    });

    test('should reset isRendered flag', () => {
      testScale.destroy();
      expect(testScale).toHaveProperty('isRendered', false);
    });

    test('should remove scale elements event listeners', () => {
      const $clickEvent = $.Event('click');

      const $scale = $('.js-slider__scale');
      const scaleElement = $scale.find('.scale__element')[5];
      testScale.destroy();
      $(scaleElement).trigger($clickEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });
  });
});
