import $ from 'jquery';
import SliderScale from '../scale';

describe('scale', () => {
  document.body.innerHTML = '<div id="view_container"></div>';
  let testScale: SliderScale;

  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();
  const testOptions: Scale.Options = {
    $viewContainer: $('#view_container'),
    renderOptions: {
      isHorizontal: true,
      scaleStep: 1,
      displayScaleValue: true,
      displayMin: true,
      displayMax: true,
    },
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
  });

  describe('constructor', () => {
    test('should save $container in prop', () => {
      expect(testScale).toHaveProperty('$container', testOptions.$viewContainer);
    });
    test('should save render options in prop', () => {
      expect(testScale).toHaveProperty('options', testOptions.renderOptions);
    });
    test('should save observer object in prop', () => {
      expect(testScale).toHaveProperty('observer', testOptions.observer);
    });
    test('should create and save in prop jQuery element container of scale elements', () => {
      expect(testScale).toHaveProperty('$scale', $('<div>', { class: 'js-slider__scale slider__scale scale' }));
    });
  });
  describe('render', () => {
    beforeEach(() => {
      testScale.render(testRenderData);
    });

    afterEach(() => {
      $('#view_container').empty();
    });

    test('should create and append scale elements to view container', () => {
      const $view = $('#view_container');
      const $scale = $view.find('.scale');
      const $elements = $scale.find('.scale__element');

      expect($scale.length).toBe(1);
      expect($elements.length).toBe(testRenderData.percentageData.length);
    });
    test('should render element.toString() content', () => {
      const $container = $('#view_container');
      $container.empty();
      const newData = {
        data: [
          { toString(): string { return '1'; } },
          { toString(): string { return 'second'; } },
          { toString(): string { return '3333'; } },
        ],
        percentageData: [0, 50, 100],
      };

      testScale.render(newData);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(3);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });
    test('should update scale if it is rendered', () => {
      const $container = $('#view_container');
      $container.empty();
      const newData = { data: [3, 4, 5, 6, 7, 8], percentageData: [0, 20, 40, 60, 80, 100] };

      testScale.render(newData);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(6);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });
    test('should attach event handlers to scale elements', () => {});
  });
  describe('Event handler', () => {
    test('should listen click event', () => {});
    test('should notify observer of onset event', () => {});
  });
  describe('destroy', () => {
    test('should detach scale container', () => {});
    test('should remove scale elements event listeners', () => {});
  });
});
