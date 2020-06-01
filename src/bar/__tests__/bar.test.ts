import $ from 'jquery';
import SliderBar from '../bar';

describe('bar', () => {
  document.body.innerHTML = '<div id="view_container"></div>';
  let testBar: SliderBar;

  const mockNotify = jest.fn;

  const testOptions = {
    $viewContainer: $('#view_container'),
    observer: {
      notify: mockNotify,
    },
  };

  beforeEach(() => {
    testBar = new SliderBar(testOptions);
  });

  describe('constructor', () => {
    test('should create $bar, $container', () => {
      expect(testBar).toHaveProperty('$bar');
      expect(testBar).toHaveProperty('$container');
    });
    test('should create default options', () => {
      expect(testBar).toHaveProperty('options', {
        isHorizontal: true,
        range: true,
        dragInterval: true,
      });
    });
  });
  describe('render', () => {
    beforeEach(() => {
      testBar.render([40, 60]);
    });
    test('should append $bar to $container', () => {
      expect($('.js-slider__bar').length).toBe(1);
    });
  });
});
