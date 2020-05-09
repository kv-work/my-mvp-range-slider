/* eslint-disable fsd/no-function-declaration-in-event-listener */
import SliderPresenter from '../presenter';
import {
  OptionsModel,
  View,
  Model,
  ViewData,
} from '../../types';

// replace .only
describe.only('Presenter', () => {
  document.body.innerHTML = '<div id="container"></div>';

  const testModelState: OptionsModel = {
    maxValue: 100,
    minValue: 0,
    step: 5,
    value: 25,
  };

  const testViewData: ViewData = {
    orientation: 'horizontal',
    range: false,
    runner: false,
    bar: true,
    scale: false,
    prefix: '',
    postfix: '',
  };

  // Mock funcs for test model
  const mockAddObserver = jest.fn();
  const mockRemoveObserver = jest.fn();
  const mockUpdateState = jest.fn();
  const mockGetState = jest.fn((): OptionsModel => testModelState);

  // Mock funcs for test view
  const mockRender = jest.fn();
  const mockViewAddObserver = jest.fn();
  const mockViewRemoveObserver = jest.fn();
  const mockUpdate = jest.fn();
  const mockGetViewData = jest.fn((): ViewData => testViewData);

  // Mock SliderModel class
  const MockModel = jest.fn<Model, []>(() => ({
    getState: mockGetState,
    updateState: mockUpdateState,
    addObserver: mockAddObserver,
    removeObserver: mockRemoveObserver,
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
      onStart: jest.fn(),
      onChange: jest.fn(),
      onFinish: jest.fn(),
      onUpdate: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('should have props: view, model, viewObserver, modelObserver, dataValues', () => {
      expect(testPresenter).toBeInstanceOf(SliderPresenter);
      expect(testPresenter).toHaveProperty('view', testView);
      expect(testPresenter).toHaveProperty('model', testModel);
      expect(testPresenter).toHaveProperty('viewObserver');
      expect(testPresenter).toHaveProperty('modelObserver');
      expect(testPresenter).toHaveProperty('dataValues');
    });

    test('should calls model method addObserver', () => {
      expect(mockAddObserver).toHaveBeenCalledTimes(1);
    });

    test('should calls view method addObserver', () => {
      expect(mockViewAddObserver).toHaveBeenCalledTimes(1);
    });

    test('should calls render method of view', () => {
      expect(mockRender).toBeCalledTimes(1);
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
        range: false,
        runner: false,
        bar: true,
        scale: false,
        prefix: '',
        postfix: '',
      });
    });
  });

  describe('getPresenterData', () => {
    test('should return presenter data: dataValues', () => {
      const presenterDataValues = testPresenter.getPresenterData();
      expect(presenterDataValues).toEqual([
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
      ]);
    });
  });
});
