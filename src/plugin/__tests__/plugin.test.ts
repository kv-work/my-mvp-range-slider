import '../plugin';
import SliderApp from '../../app/app';

describe('myMVPSlider', () => {
  document.body.innerHTML = `
    <div class="js-container"></div>
    <div class="js-container"></div>
    <div id="js-contaainer_with_options"></div>
  `;

  const testNodes = document.getElementsByClassName('js-container');
  const $testWithOptions = $('#js-contaainer_with_options');

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
    range: true,
    dragInterval: true,
    runner: true,
    bar: true,
    scale: true,
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

  beforeEach(() => {
    $(testNodes[0]).myMVPSlider();
  });

  test('should render slider with default options', () => {
    expect($('.js-slider__bar').length).toBe(1);
    expect($('.js-slider__runner').length).toBe(1);
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
  // test('should have some methods');
  test('should save initial options in data attributes', () => {
    $testWithOptions.myMVPSlider(initialOpts);
    expect($testWithOptions.data('init-options')).toEqual(initialOpts);
  });
});
