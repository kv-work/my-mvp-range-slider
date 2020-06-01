import $ from 'jquery';
import SliderScale from '../scale';

describe('scale', () => {
  document.body.innerHTML = '<div id="view_container"></div>';
  let testScale: SliderScale;

  const mockUpdate = jest.fn();
  const testOptions: Scale.Options = {
    $viewContainer: $('#view_container'),
    renderOptions: {
      scaleStep: 1,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
    },
    observer: {
      update: mockUpdate,
    },
  };
  const testRenderData: App.Stringable[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

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
      expect(testScale).toHaveProperty('$scale', $('<div>', { class: 'slider__scale scale' }));
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
      expect($elements.length).toBe(testRenderData.length);
    });
    test('should render element.toString() content', () => {
      const $container = $('#view_container');
      $container.empty();
      const newData = [
        { toString(): string { return '1'; } },
        { toString(): string { return 'second'; } },
        { toString(): string { return '3333'; } },
      ];

      testScale.render(newData);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(3);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData[idx].toString());
      });
    });
    test('should update scale if it is rendered', () => {
      const $container = $('#view_container');
      $container.empty();
      const newData = [3, 4, 5, 6, 7, 8];

      testScale.render(newData);
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(6);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData[idx].toString());
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
