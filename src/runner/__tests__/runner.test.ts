import $ from 'jquery';
import SliderRunner from '../runner';

describe('SliderRunner', () => {
  document.body.innerHTML = `
    <div id="view_container_horizontal"></div>
    <div id="view_container"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');
  const renderData: View.RenderData = {
    value: 10,
    percentage: 10,
  };

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
  };
  const testOptionsVertical: Runner.InitOptions = {
    $viewContainer: $verticalView,
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

    test('should set isSecond flag, if it is not undefined', () => {
      expect(testRunner).toHaveProperty('isSecond', false);
      expect(vertRunner).toHaveProperty('isSecond', false);

      const newRunner = new SliderRunner({
        ...testOptions,
        isSecond: true,
      });

      expect(newRunner).toHaveProperty('isSecond', true);
    });
  });

  describe('render', () => {
    beforeEach(() => {
      testRunner.render(renderData, horizontalOptions);
      vertRunner.render(renderData, verticalOptions);
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

    test('should save options and value in data attr', () => {
      const horizontalData = $horizontalView.find('.js-slider__runner').data();
      const verticalalData = $verticalView.find('.js-slider__runner').data();

      expect(horizontalData).toEqual({
        options: {
          isHorizontal: true,
          displayValue: true,
          prefix: '+',
          postfix: '$',
        },
        value: renderData.value,
      });
      expect(verticalalData).toEqual({
        options: {
          isHorizontal: false,
          displayValue: true,
          prefix: '+',
          postfix: '$',
        },
        value: renderData.value,
      });
    });

    test('should update $runner if it is rendered', () => {
      const newData: View.RenderData = {
        value: 20,
        percentage: 20,
      };

      testRunner.render(newData, horizontalOptions);

      expect($horizontalView.find('.js-slider__runner').length).toBe(1);

      const horizontalData = $horizontalView.find('.js-slider__runner').data();
      expect(horizontalData).toEqual({
        options: {
          isHorizontal: true,
          displayValue: true,
          prefix: '+',
          postfix: '$',
        },
        value: newData.value,
      });
    });
    test('should attach mouse events handlers to $runner', () => {});
  });
});
