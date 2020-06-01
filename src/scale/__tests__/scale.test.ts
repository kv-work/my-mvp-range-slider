import $ from 'jquery';
import SliderScale from '../scale';

describe('scale', () => {
  document.body.innerHTML = '<div id="view_container"></div>';
  let testScale: SliderScale;

  const mockUpdate = jest.fn();
  const testOptions: Scale.Options = {
    $viewContainer: $('#view_container'),
    observer: {
      update: mockUpdate,
    },
  };

  beforeEach(() => {
    testScale = new SliderScale(testOptions);
  });

  describe('constructor', () => {
    test('should save $container in prop', () => {
      expect(testScale).toHaveProperty('$container', testOptions.$viewContainer);
    });
    test('should save observer object in prop', () => {
      expect(testScale).toHaveProperty('observer', testOptions.observer);
    });
    test('should create and save in prop jQuery element container of scale elements', () => {
      expect(testScale).toHaveProperty('$scale', $('<div>', { class: 'slider__scale' }));
    });
  });
  describe('render', () => {
    test('should create jQuery elements of scale', () => {});
    test('should append scale elements to container', () => {});
    test('should append scale container to view container', () => {});
    test('should update scale if it is rendered', () => {});
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
