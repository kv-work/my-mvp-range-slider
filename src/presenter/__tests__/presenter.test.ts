import SliderPresenter from '../presenter';
import {
  OptionsModel,
  View,
  Model,
  ViewData,
  Observer,
  Stringable,
} from '../../types';

describe('Presenter', () => {
  document.body.innerHTML = '<div id="container"></div>';

  let testModelState: OptionsModel;

  let testViewData: ViewData;

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
  const mockViewNotify = jest.fn((event: {type: string; values?: [number, number] | number}) => {
    switch (event.type) {
      case 'start':
        viewObservers.forEach((observer: Observer) => observer.start());
        break;
      case 'change':
        viewObservers.forEach((observer: Observer) => observer.change(event.values));
        break;
      case 'finish':
        viewObservers.forEach((observer: Observer) => observer.finish(event.values));
        break;
      default:
        break;
    }
  });

  // Mock funcs for test model
  const mockAddObserver = jest.fn((observer: Observer) => {
    modelObservers.add(observer);
  });
  const mockRemoveObserver = jest.fn((observer: Observer) => {
    modelObservers.delete(observer);
  });
  const mockUpdateState = jest.fn((options: OptionsModel) => {
    testModelState = {
      ...testModelState,
      ...options,
    };
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
  const mockUpdate = jest.fn((options: ViewData) => {
    testViewData = {
      ...testViewData,
      ...options,
    };
  });
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
    testModelState = {
      maxValue: 100,
      minValue: 0,
      step: 5,
      value: 25,
      secondValue: 70,
    };
    testViewData = {
      isHorizontal: true,
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
      expect(mockRender).toBeCalledWith({
        data: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
        value: [25, 70],
        percentage: [25, 70],
      });
      expect(viewObservers.size).toBe(1);
    });

    test('should create presenter with dataValues', () => {
      testPresenter = new SliderPresenter({
        model: testModel,
        view: testView,
        dataValues: testDataValues,
        onStart: mockOnStart,
        onChange: mockOnChange,
        onFinish: mockOnFinish,
        onUpdate: mockOnUpdate,
      });

      expect(testPresenter).toHaveProperty('dataValues', ['one', 'two', 'three', 'four']);
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
      mockGetViewData.mockClear();
      testPresenter.getViewData();
    });

    test('should calls view method getData', () => {
      expect(mockGetViewData).toBeCalledTimes(1);
    });

    test('should returns view data', () => {
      expect(mockGetViewData).toHaveReturnedWith({
        isHorizontal: true,
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
        isHorizontal: true,
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

  describe('dataValues', () => {
    beforeEach(() => {
      mockUpdateState.mockClear();
      mockLockState.mockClear();
      mockRender.mockClear();
    });

    test('should changes and locks model values, if dataValues.length > 0', () => {
      // ['one', 'two', 'three', 'four']
      testPresenter.update({ dataValues: testDataValues });

      expect(mockUpdateState).toBeCalledWith({
        maxValue: 3,
        minValue: 0,
        step: 1,
      });

      expect(mockLockState).toBeCalledWith(['maxValue', 'minValue', 'step']);

      testPresenter.update({
        dataValues: [14, 122, 78, 90, 50, 88],
      });

      expect(mockUpdateState).toBeCalledWith({
        maxValue: 5,
        minValue: 0,
        step: 1,
      });
    });

    test('should not changes and locks model values, if dataValues.length <= 0', () => {
      testPresenter.update({ dataValues: [] });

      expect(mockLockState).not.toBeCalled();
      expect(mockUpdateState).not.toBeCalled();
    });

    test('should render view, after updating dataValues', () => {
      // ['one', 'two', 'three', 'four']
      testPresenter.update({ dataValues: testDataValues });

      expect(mockRender).toBeCalled();
    });
  });

  describe('model observer', () => {
    beforeEach(() => {
      mockGetState.mockClear();
      mockModelNotify.mockClear();
      mockRender.mockClear();
    });

    test('should request updated model data', () => {
      testModel.updateState({ value: 25 });
      expect(mockModelNotify).toHaveBeenCalledTimes(1);
      expect(mockGetState).toHaveBeenCalled();
    });

    test('should update renderData', () => {
      testPresenter.update({
        maxValue: 50,
        minValue: 25,
        step: 5,
      });

      expect(mockModelNotify).toHaveBeenCalledTimes(1);
      expect(testPresenter).toHaveProperty('renderData', [25, 30, 35, 40, 45, 50]);

      testPresenter.update({
        maxValue: 10,
        minValue: 0,
        step: 7,
      });

      expect(mockModelNotify).toHaveBeenCalledTimes(2);
      expect(testPresenter).toHaveProperty('renderData', [0, 7, 10]);
    });

    test('should convert units in the model to percent before calls render method of view', () => {
      testPresenter.update({
        maxValue: 10,
        minValue: 0,
        step: 2,
        value: 2,
        secondValue: 6,
      });

      expect(mockRender).toBeCalledWith({
        data: [0, 2, 4, 6, 8, 10],
        value: [2, 6],
        percentage: [20, 60],
      });
    });

    test('should calls render with new render data', () => {
      testPresenter.update({
        maxValue: 50,
        minValue: 25,
        step: 5,
        value: 35,
        secondValue: 40,
      });

      expect(mockRender).toBeCalledWith({
        data: [25, 30, 35, 40, 45, 50],
        value: [35, 40],
        percentage: [40, 60],
      });
    });
  });

  describe('view observer', () => {
    beforeEach(() => {
      mockOnStart.mockClear();
      mockOnChange.mockClear();
      mockOnFinish.mockClear();
    });

    test('should call onStart callback at the beginning of value change (for example, mousedown event)', () => {
      mockViewNotify({ type: 'start' });

      expect(mockOnStart).toBeCalledTimes(1);
      expect(mockOnUpdate).not.toBeCalled();
    });

    test('should update model state while changing the value', () => {
      mockViewNotify({
        type: 'change',
        values: 40,
      });

      expect(mockUpdateState).toBeCalledWith({ value: 40 });
      expect(mockOnUpdate).not.toBeCalled();

      // if range is true
      mockViewNotify({
        type: 'change',
        values: [30, 80],
      });

      expect(mockUpdateState).toBeCalledWith({ value: 30, secondValue: 80 });
      expect(mockOnUpdate).not.toBeCalled();
    });

    test('should call the onChange callback while changing the value (for example, the mousemove event before the mouseup event)', () => {
      mockViewNotify({ type: 'change', values: 30 });

      expect(mockOnChange).toBeCalledTimes(1);
      expect(mockOnUpdate).not.toBeCalled();

      // if range is true
      mockViewNotify({
        type: 'change',
        values: [40, 50],
      });

      expect(mockUpdateState).toBeCalledWith({ value: 40, secondValue: 50 });
      expect(mockOnUpdate).not.toBeCalled();
    });

    test('should update model state after changing the value ', () => {
      mockViewNotify({
        type: 'finish',
        values: 60,
      });

      expect(mockUpdateState).toBeCalledWith({ value: 60 });
      expect(mockOnUpdate).not.toBeCalled();

      // if range is true
      mockViewNotify({
        type: 'finish',
        values: [60, 80],
      });

      expect(mockUpdateState).toBeCalledWith({ value: 60, secondValue: 80 });
      expect(mockOnUpdate).not.toBeCalled();
    });

    test('should call the onFinish callback after changing the value (for example, the mouseup event)', () => {
      mockViewNotify({ type: 'finish', values: 35 });

      expect(mockOnFinish).toBeCalledTimes(1);
      expect(mockOnUpdate).not.toBeCalled();

      // if range is true
      mockViewNotify({
        type: 'finish',
        values: [50, 75],
      });

      expect(mockUpdateState).toBeCalledWith({ value: 50, secondValue: 75 });
      expect(mockOnUpdate).not.toBeCalled();
    });

    test('should convert percentages to units in the model', () => {
      testPresenter.update({
        maxValue: 10,
        minValue: 0,
        step: 10,
        value: 2,
        secondValue: 6,
      });
      expect(mockUpdateState).toBeCalledWith({
        maxValue: 10,
        minValue: 0,
        step: 10,
        value: 2,
        secondValue: 6,
      });
      mockUpdateState.mockClear();

      mockViewNotify({ type: 'change', values: 30 });
      expect(mockUpdateState).toBeCalledWith({ value: 3 });
      mockUpdateState.mockClear();

      mockViewNotify({ type: 'change', values: 40 });
      expect(mockUpdateState).toBeCalledWith({ value: 4 });
      mockUpdateState.mockClear();

      mockViewNotify({ type: 'finish', values: 55 });
      expect(mockUpdateState).toBeCalledWith({ value: 5.5 });

      testPresenter.update({
        maxValue: 15,
        minValue: 5,
        step: 0.5,
        value: 7.5,
        secondValue: 13.5,
      });
      mockUpdateState.mockClear();

      mockViewNotify({ type: 'change', values: [40, 60] });
      expect(mockUpdateState).toBeCalledWith({ value: 9, secondValue: 11 });
    });
  });

  describe('update', () => {
    beforeEach(() => {
      jest.clearAllMocks();
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
      expect(mockUpdate).not.toHaveBeenCalled();
    });

    test('should set secondValue to undefined if argument {secondValue: undefined}', () => {
      testPresenter.update({ secondValue: undefined });
      expect(mockUpdateState).toBeCalledWith({ secondValue: undefined });
    });

    test('should calls update method of view, if it is necessary to update the view props', () => {
      testPresenter.update({
        isHorizontal: false,
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
        isHorizontal: false,
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

      expect(mockUpdateState).not.toBeCalled();
    });

    test('should calls update method of view and updateState method of model, then changed renderData and calls render method of view', () => {
      testPresenter.update({
        range: false,
        maxValue: 25,
        minValue: 12,
        step: 3,
        value: 18,
      });

      expect(mockUpdate).toBeCalledWith({ range: false });
      expect(mockUpdateState).toBeCalledWith({
        maxValue: 25,
        minValue: 12,
        step: 3,
        value: 18,
      });

      expect(testPresenter.getViewData().range).toBeFalsy();

      expect(testPresenter).toHaveProperty('renderData', [12, 15, 18, 21, 24, 25]);

      expect(mockRender).toBeCalledWith({
        data: [12, 15, 18, 21, 24, 25],
        value: 18,
        percentage: 46.15384615384615,
      });
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
