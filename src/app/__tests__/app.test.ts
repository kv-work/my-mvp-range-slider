import $ from 'jquery';
import App from '../app';

describe('app', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const testNode = document.getElementById('container');
  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();
  const mockUpdate = jest.fn();
  const testOptions = {
    maxValue: 100,
    minValue: 0,
    step: 5,
    value: 25,
    secondValue: 75,
    isHorizontal: true,
    range: true,
    dragInterval: false,
    runner: true,
    bar: true,
    scale: true,
    scaleStep: 10,
    displayScaleValue: true,
    displayValue: true,
    displayMin: true,
    displayMax: true,
    prefix: '$',
    postfix: 'USD',
    onStart: mockStart,
    onChange: mockChange,
    onFinish: mockFinish,
    onUpdate: mockUpdate,
  };
  let testApp: App;

  beforeEach(() => {
    testApp = new App(testOptions, testNode);
  });

  afterEach(() => {
    $(testNode).html('');
  });

  describe('constructor', () => {
    test('should set props: options, node', () => {
      expect(testApp).toHaveProperty('options', testOptions);
      expect(testApp).toHaveProperty('node', testNode);
    });

    test('should create model', () => {
      expect(testApp).toHaveProperty('model');
    });

    test('should create presenter', () => {
      expect(testApp).toHaveProperty('presenter');
    });

    test('should create view', () => {
      expect(testApp).toHaveProperty('view');
    });

    test('should render view', () => {
      expect($('.js-slider__container').length).toBe(1);
      expect($('.js-slider__bar').length).toBe(1);
      expect($('.js-slider__scale').length).toBe(1);
      expect($('.js-slider__second_runner').length).toBe(1);
    });
  });
});
