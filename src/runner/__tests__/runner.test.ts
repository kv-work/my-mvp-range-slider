import $ from 'jquery';
import SliderRunner from '../runner';

describe('SliderRunner', () => {
  document.body.innerHTML = `
    <div id="view_container_horizontal"></div>
    <div id="view_container"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');

  const horizontalOptions: Runner.RenderOptions = {
    isHorizontal: true,
    displayValue: true,
    prefix: '+',
    postfix: '$',
  };
  const verticalOptions: Runner.RenderOptions = {
    ...horizontalOptions,
    isHorizontal: false,
  };

  const testOptions: Runner.InitOptions = {
    $viewContainer: $horizontalView,
    renderOptions: horizontalOptions,
  };
  const testOptionsVertical: Runner.InitOptions = {
    $viewContainer: $verticalView,
    renderOptions: verticalOptions,
  };

  let testRunner: SliderRunner;
  let vertRunner: SliderRunner;

  beforeEach(() => {
    testRunner = new SliderRunner(testOptions);
    vertRunner = new SliderRunner(testOptionsVertical);
  });

  describe('constructor', () => {
    test('should save $view in prop', () => {
      expect(testRunner).toHaveProperty('$view', testOptions.$viewContainer);
      expect(vertRunner).toHaveProperty('$view', testOptionsVertical.$viewContainer);
    });

    test('should reset isRendered flag', () => {
      expect(testRunner).toHaveProperty('isRendered', false);
      expect(vertRunner).toHaveProperty('isRendered', false);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      testRunner.render(10, horizontalOptions);
      vertRunner.render(10, horizontalOptions);
    });

    afterEach(() => {
      $horizontalView.empty();
      $verticalView.empty();
    });

    test('should create $runner prop', () => {
      expect(testRunner).toHaveProperty('$runner');
      expect(vertRunner).toHaveProperty('$runner');
    });
    test('should append $runner to $view', () => {
      expect($horizontalView.find('.js-slider__runner').length).toBe(1);
      expect($verticalView.find('.js-slider__runner').length).toBe(1);
    });
    test('should update $runner if it is rendered', () => {});
    test('should attach mouse events handlers to $runner', () => {});
  });
});
