import App from '../app';
import SliderModel from '../../model/model';
import SliderPresenter from '../../presenter/presenter';
import SliderView from '../../view/view';

const mockUpdateModelState = jest.fn();
const mockLockModelState = jest.fn();
const mockUnlockModelState = jest.fn();
jest.mock('../../model/model', jest.fn(() => jest.fn().mockImplementation(() => ({
  updateState: mockUpdateModelState,
  lockState: mockLockModelState,
  unlockState: mockUnlockModelState,
}))));

const mockUpdatePresenter = jest.fn();
const mockGetAllData = jest.fn();
const mockGetModelData = jest.fn();
const mockGetViewData = jest.fn();
const mockGetPresenterData = jest.fn();
const mockSetUserData = jest.fn();
jest.mock('../../presenter/presenter', jest.fn(() => jest.fn().mockImplementation(() => ({
  update: mockUpdatePresenter,
  getAllData: mockGetAllData,
  getModelData: mockGetModelData,
  getViewData: mockGetViewData,
  getPresenterData: mockGetPresenterData,
  setUserData: mockSetUserData,
}))));

const mockRenderView = jest.fn();
const mockUpdateView = jest.fn();
const mockDestroyView = jest.fn();
jest.mock('../../view/view', jest.fn(() => jest.fn().mockImplementation(() => ({
  render: mockRenderView,
  update: mockUpdateView,
  destroy: mockDestroyView,
}))));

describe('app', () => {
  document.body.innerHTML = '<div id="container"></div>';
  const testNode = document.getElementById('container');

  const testOptions: App.Option = {
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
  };
  let testApp: App;

  beforeEach(() => {
    testApp = new App(testOptions, testNode);
  });

  afterEach(() => {
    $(testNode).html('');
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should set props: options, node', () => {
      expect(testApp).toHaveProperty('initOptions', testOptions);
      expect(testApp).toHaveProperty('node', testNode);
    });

    test('should create model', () => {
      expect(testApp).toHaveProperty('model');
      expect(SliderModel).toBeCalledTimes(1);
    });

    test('should create presenter', () => {
      expect(testApp).toHaveProperty('presenter');
      expect(SliderPresenter).toBeCalledTimes(1);
    });

    test('should create view', () => {
      expect(testApp).toHaveProperty('view');
      expect(SliderView).toBeCalledTimes(1);
    });
  });

  describe('update', () => {
    const newOptions: App.Option = {
      maxValue: 10,
      minValue: 0,
      step: 1,
      value: 5,
      secondValue: 7,
      dragInterval: true,
      displayScaleValue: true,
      displayValue: true,
      prefix: '$',
      postfix: 'USD',
    };

    beforeEach(() => {
      testApp.update(newOptions);
    });

    test('should save new options in this.newOptions', () => {
      expect(testApp).toHaveProperty('options', { ...testOptions, ...newOptions });

      testApp.update({ maxValue: 100, dragInterval: false });
      expect(testApp).toHaveProperty('options', {
        maxValue: 100,
        minValue: 0,
        step: 1,
        value: 5,
        secondValue: 7,
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
      });
    });

    test('should call update method of Presenter', () => {
      expect(mockUpdatePresenter).toBeCalledWith(newOptions);
    });
  });

  describe('getAllData', () => {
    test('should call getAllData method of Presenter', () => {
      testApp.getAllData();
      expect(mockGetAllData).toBeCalledTimes(1);
    });
  });
  describe('getModelData', () => {
    test('should call getModelData method of Presenter', () => {
      testApp.getModelData();
      expect(mockGetModelData).toBeCalledTimes(1);
    });
  });
  describe('getPresenterData', () => {
    test('should call getPresenterData method of Presenter', () => {
      testApp.getPresenterData();
      expect(mockGetPresenterData).toBeCalledTimes(1);
    });
  });
  describe('getViewData', () => {
    test('should call getViewData method of Presenter', () => {
      testApp.getViewData();
      expect(mockGetViewData).toBeCalledTimes(1);
    });
  });
  describe('reset', () => {
    test('should update presenter, model and view with init options', () => {
      testApp.update({
        maxValue: 50,
        minValue: 10,
        step: 5,
        value: 15,
        secondValue: undefined,
        isHorizontal: false,
        range: false,
        dragInterval: false,
        runner: false,
        bar: true,
        scale: false,
      });
      expect(testApp).toHaveProperty('options', {
        maxValue: 50,
        minValue: 10,
        step: 5,
        value: 15,
        secondValue: undefined,
        isHorizontal: false,
        range: false,
        dragInterval: false,
        runner: false,
        bar: true,
        scale: false,
        scaleStep: 10,
        displayScaleValue: true,
        displayValue: true,
        displayMin: true,
        displayMax: true,
        prefix: '$',
        postfix: 'USD',
      });
      testApp.reset();
      expect(testApp).toHaveProperty('options', testOptions);
      expect(mockUpdatePresenter).toBeCalledWith(testOptions);
    });
  });
  describe('destroy', () => {
    test('should call destroy method of view', () => {
      testApp.destroy();
      expect(mockDestroyView).toBeCalled();
    });
  });
});
