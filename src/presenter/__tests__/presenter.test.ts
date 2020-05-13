/* eslint-disable fsd/no-function-declaration-in-event-listener */
import SliderPresenter from '../presenter';
import {
  OptionsModel,
  View,
  Model,
  ViewData,
  Observer,
  Stringable,
} from '../../types';

// replace .only
describe('Presenter', () => {
  document.body.innerHTML = '<div id="container"></div>';

  const testModelState: OptionsModel = {
    maxValue: 100,
    minValue: 0,
    step: 5,
    value: 25,
    secondValue: 70,
  };

  const testViewData: ViewData = {
    orientation: 'horizontal',
    range: true,
    dragInterval: true,
    runner: true,
    bar: true,
    scale: true,
    scaleStep: 25,
    displayScaleValue: true,
    displayValue: true,
    displayMin: true,
    displayMax: true,
    prefix: 'value',
    postfix: '$',
  };

  const testDataValues: Stringable[] = ['one', 'two', 'three', 'four'];

  // Mock callbacks
  const mockOnStart = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnFinish = jest.fn();
  const mockOnUpdate = jest.fn();

  // Mock observers
  const modelObservers = new Set<Observer>();
  const viewObservers = new Set<Observer>();
  const mockModelNotify = jest.fn(() => {
    modelObservers.forEach((observer: Observer) => {
      observer.update();
    });
  });

  // Mock funcs for test model
  const mockAddObserver = jest.fn((observer: Observer) => {
    modelObservers.add(observer);
  });
  const mockRemoveObserver = jest.fn((observer: Observer) => {
    modelObservers.delete(observer);
  });
  const mockUpdateState = jest.fn(() => {
    mockModelNotify();
  });
  const mockGetState = jest.fn((): OptionsModel => testModelState);
  const mockLockState = jest.fn();
  const mockUnlockState = jest.fn();

  // Mock funcs for test view
  const mockRender = jest.fn();
  const mockViewAddObserver = jest.fn((observer: Observer) => {
    viewObservers.add(observer);
  });
  const mockViewRemoveObserver = jest.fn((observer: Observer) => {
    viewObservers.delete(observer);
  });
  const mockUpdate = jest.fn();
  const mockGetViewData = jest.fn((): ViewData => testViewData);

  // Mock SliderModel class
  const MockModel = jest.fn<Model, []>(() => ({
    getState: mockGetState,
    updateState: mockUpdateState,
    addObserver: mockAddObserver,
    removeObserver: mockRemoveObserver,
    lockState: mockLockState,
    unlockState: mockUnlockState,
  }));

  const MockView = jest.fn<View, []>((): View => ({
    render: mockRender,
    update: mockUpdate,
    addObserver: mockViewAddObserver,
    removeObserver: mockViewRemoveObserver,
    getData: mockGetViewData,
  }));

  let testPresenter: SliderPresenter;
  let testModel: Model;
  let testView: View;

  beforeEach(() => {
    testModel = new MockModel();
    testView = new MockView();
    testPresenter = new SliderPresenter({
      model: testModel,
      view: testView,
      onStart: mockOnStart,
      onChange: mockOnChange,
      onFinish: mockOnFinish,
      onUpdate: mockOnUpdate,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
    modelObservers.clear();
    viewObservers.clear();
  });

  describe('constructor', () => {
    test('should set props: view, model, viewObserver, modelObserver, dataValues, renderData', () => {
      expect(testPresenter).toBeInstanceOf(SliderPresenter);
      expect(testPresenter).toHaveProperty('view', testView);
      expect(testPresenter).toHaveProperty('model', testModel);
      expect(testPresenter).toHaveProperty('viewObserver');
      expect(testPresenter).toHaveProperty('modelObserver');
      expect(testPresenter).toHaveProperty('dataValues');
      expect(testPresenter).toHaveProperty('renderData');
      expect(testPresenter).toHaveProperty('callbacks');
    });

    test('should calls model method addObserver', () => {
      expect(mockAddObserver).toHaveBeenCalledTimes(1);
      expect(modelObservers.size).toBe(1);
    });

    test('should calls view method addObserver', () => {
      expect(mockViewAddObserver).toHaveBeenCalledTimes(1);
    });

    test('should calls render method of view', () => {
      expect(mockRender).toBeCalledTimes(1);
      expect(viewObservers.size).toBe(1);
    });
  });

  describe('getModelData', () => {
    beforeEach(() => {
      mockGetState.mockClear();
      testPresenter.getModelData();
    });

    test('should calls model method getState', () => {
      expect(mockGetState).toBeCalledTimes(1);
    });

    test('should returns model state', () => {
      expect(mockGetState).toHaveReturnedWith({
        maxValue: 100,
        minValue: 0,
        step: 5,
        value: 25,
        secondValue: 70,
      });
    });
  });

  describe('getViewData', () => {
    beforeEach(() => {
      testPresenter.getViewData();
    });

    test('should calls view method getData', () => {
      expect(mockGetViewData).toBeCalledTimes(1);
    });

    test('should returns view data', () => {
      expect(mockGetViewData).toHaveReturnedWith({
        orientation: 'horizontal',
        range: true,
        dragInterval: true,
        runner: true,
        bar: true,
        scale: true,
        scaleStep: 25,
        displayScaleValue: true,
        displayValue: true,
        displayMin: true,
        displayMax: true,
        prefix: 'value',
        postfix: '$',
      });
    });
  });

  describe('getPresenterData', () => {
    test('should return presenter data: dataValues, renderData', () => {
      const presenterDataValues = testPresenter.getPresenterData();
      expect(presenterDataValues).toEqual({
        dataValues: [],
        renderData: [
          0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
        ],
      });
    });
  });

  describe('getAllData', () => {
    test('should returns model data, view data and presenter data', () => {
      const data = testPresenter.getAllData();
      expect(data).toEqual({
        maxValue: 100,
        minValue: 0,
        step: 5,
        value: 25,
        secondValue: 70,
        orientation: 'horizontal',
        range: true,
        dragInterval: true,
        runner: true,
        bar: true,
        scale: true,
        scaleStep: 25,
        displayScaleValue: true,
        displayValue: true,
        displayMin: true,
        displayMax: true,
        prefix: 'value',
        postfix: '$',
        dataValues: [],
        renderData: [
          0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
        ],
      });
    });
  });

  describe('model observer', () => {
    beforeEach(() => {
      mockGetState.mockClear();
      testModel.updateState({ value: 25 });
    });

    test('should request updated model data', () => {
      expect(mockModelNotify).toHaveBeenCalledTimes(1);
      expect(mockGetState).toHaveBeenCalledTimes(1);
    });

    // need add tests
    test('should calls updateView with new render data', () => {});
  });

  describe('update', () => {
    beforeEach(() => {
      mockOnUpdate.mockClear();
    });

    test('should calls updateState method of model, if it is necessary to update the model state', () => {
      testPresenter.update({
        maxValue: 90,
        minValue: 10,
        step: 10,
        value: 30,
        secondValue: 60,
      });

      expect(mockUpdateState).toBeCalledWith({
        maxValue: 90,
        minValue: 10,
        step: 10,
        value: 30,
        secondValue: 60,
      });

      testPresenter.update({ value: 40 });

      expect(mockUpdateState).toBeCalledWith({ value: 40 });
    });

    test('should calls update method of view, if it is necessary to update the view props', () => {
      testPresenter.update({
        orientation: 'vertical',
        range: true,
        dragInterval: false,
        runner: false,
        bar: true,
        scale: true,
        scaleStep: 25,
        displayScaleValue: true,
        displayValue: false,
        displayMin: true,
        displayMax: true,
        prefix: '+',
        postfix: ' p.',
      });

      expect(mockUpdate).toBeCalledWith({
        orientation: 'vertical',
        range: true,
        dragInterval: false,
        runner: false,
        bar: true,
        scale: true,
        scaleStep: 25,
        displayScaleValue: true,
        displayValue: false,
        displayMin: true,
        displayMax: true,
        prefix: '+',
        postfix: ' p.',
      });

      testPresenter.update({ runner: true });

      expect(mockUpdate).toBeCalledWith({ runner: true });
    });

    test('should updates dataValues and renderData', () => {
      testPresenter.update({ dataValues: testDataValues });

      expect(testPresenter).toHaveProperty('dataValues', ['one', 'two', 'three', 'four']);

      expect(testPresenter).toHaveProperty('renderData', ['one', 'two', 'three', 'four']);
    });

    test('should calls onUpdate callback', () => {
      testPresenter.update({
        value: 50,
        maxValue: 200,
      });

      expect(mockOnUpdate).toBeCalledTimes(1);
    });
  });
});
