import '../plugin';
import SliderApp from '../../App/app';

describe('myMVPSlider', () => {
  document.body.innerHTML = `
    <div class="js-container"></div>
    <div class="js-container"></div>
    <div id="js-container_with_options"></div>
  `;

  const testNodes = document.getElementsByClassName('js-container');
  const $testWithOptions = $('#js-container_with_options');

  const mockOnStart = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnFinish = jest.fn();
  const mockOnUpdate = jest.fn();

  const initialOpts: App.Option = {
    // model
    maxValue: 12,
    minValue: 1,
    step: 1,
    value: 1,
    secondValue: 10,

    // view
    isHorizontal: true,
    isRange: true,
    isDragInterval: true,
    hasRunner: true,
    hasBar: true,
    hasScale: true,
    displayScaleValue: true,
    numOfScaleVal: 10,
    displayValue: true,
    displayMin: true,
    displayMax: true,
    prefix: '',
    postfix: '',

    // presenter
    dataValues: [],

    // callbacks
    onStart: mockOnStart,
    onChange: mockOnChange,
    onFinish: mockOnFinish,
    onUpdate: mockOnUpdate,
  };

  beforeAll(() => {
    $(testNodes[0]).myMVPSlider();
  });

  test('should render slider with default options', () => {
    expect($('.js-slider__bar').length).toBe(1);
    expect($('.js-slider__runner').length).toBe(1);
    expect($('.js-slider__scale').length).toBe(1);
    expect($('.js-slider__display_container').length).toBe(1);
  });

  test('should support call chains', () => {
    expect($(testNodes[1]).myMVPSlider().css({
      position: 'absolute',
      top: '50px',
    })).toBeInstanceOf($);
  });

  test('should save instance of Slider in data attr "myMVPSlider"', () => {
    const slider = $(testNodes[0]).data('myMVPSlider');
    expect(slider).toBeInstanceOf(SliderApp);
  });

  test('should save initial options in data attributes', () => {
    $testWithOptions.myMVPSlider(initialOpts);
    expect($testWithOptions.data('init-options')).toEqual(initialOpts);
  });

  test('should validate init options', () => {
    const wrongOpts: App.Option = {
      maxValue: undefined,
      minValue: undefined,
      step: undefined,
      value: undefined,
      secondValue: undefined,

      // view
      isHorizontal: undefined,
      isRange: undefined,
      isDragInterval: undefined,
      hasRunner: undefined,
      hasBar: undefined,
      hasScale: undefined,
      numOfScaleVal: -10,
      displayScaleValue: undefined,
      displayValue: undefined,
      displayMin: undefined,
      displayMax: undefined,
      prefix: undefined,
      postfix: undefined,

      // presenter
      dataValues: undefined,

      // callbacks
      onStart: undefined,
      onChange: undefined,
      onFinish: undefined,
      onUpdate: undefined,
    };

    $testWithOptions.myMVPSlider(wrongOpts);

    const initOpts = $testWithOptions.data('init-options');
    const test: App.Option = {
      maxValue: 100,
      minValue: 0,
      step: 1,
      value: 0,
      isHorizontal: true,
      isRange: true,
      isDragInterval: false,
      hasRunner: true,
      hasBar: true,
      hasScale: true,
      numOfScaleVal: 3,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
      prefix: '',
      postfix: '',
      dataValues: [],
    };

    expect(initOpts).toMatchObject(test);
  });

  test('should destroy plugin if calls .myMVPSlider("destroy")', () => {
    $(testNodes[0]).myMVPSlider('destroy');

    expect($(testNodes[0]).find('.js-slider__bar').length).toBe(0);
    expect($(testNodes[0]).find('.js-slider__runner').length).toBe(0);
    expect($(testNodes[0]).find('.js-slider__scale').length).toBe(0);
    expect($(testNodes[0]).find('.js-slider__display_container').length).toBe(0);
    const slider = $(testNodes[0]).data('myMVPSlider');
    expect(slider).toBeUndefined();
    const options = $(testNodes[0]).data('init-options');
    expect(options).toBeUndefined();
  });
});
