import SliderPresenter from '../presenter';

describe('Presenter', () => {
  document.body.innerHTML = '<div id="container"></div>';

  let testModelState: Model.State;

  let testViewData: View.Options;

  const testDataValues: App.Stringable[] = ['one', 'two', 'three', 'four'];

  // Mock callbacks
  const mockOnStart = jest.fn();
  const mockOnChange = jest.fn();
  const mockOnFinish = jest.fn();
  const mockOnUpdate = jest.fn();

  // Mock observers
  const modelObservers = new Set<Model.Observer>();
  const viewObservers = new Set<View.Observer>();
  const mockModelNotify = jest.fn(() => {
    modelObservers.forEach((observer: Model.Observer) => {
      observer.update();
    });
  });
  const mockViewNotify = jest.fn((event: {type: string; values?: [number, number] | number}) => {
    switch (event.type) {
      case 'start':
        viewObservers.forEach((observer: View.Observer) => observer.start());
        break;
      case 'change':
        viewObservers.forEach((observer: View.Observer) => {
          if (event.values) {
            observer.change(event.values);
          }
        });
        break;
      case 'finish':
        viewObservers.forEach((observer: View.Observer) => observer.finish());
        break;
      case 'update':
        viewObservers.forEach((observer: View.Observer) => observer.update());
        break;
      default:
        break;
    }
  });

  // Mock funcs for test model
  const mockAddObserver = jest.fn((observer: Model.Observer) => {
    modelObservers.add(observer);
  });
  const mockRemoveObserver = jest.fn((observer: Model.Observer) => {
    modelObservers.delete(observer);
  });
  const mockUpdateState = jest.fn((options: Model.Options) => {
    const newState = $.extend({}, testModelState, options);

    testModelState.maxValue = newState.maxValue;
    testModelState.minValue = newState.minValue;
    testModelState.step = newState.step;
    testModelState.value = newState.value;
    testModelState.secondValue = newState.secondValue;
    testModelState.lockedValues = newState.lockedValues;

    mockModelNotify();
  });
  const mockGetState = jest.fn((): Model.State => testModelState);
  const mockLockState = jest.fn();
  const mockUnlockState = jest.fn();

  // Mock funcs for test view
  const mockRender = jest.fn();
  const mockViewAddObserver = jest.fn((observer: View.Observer) => {
    viewObservers.add(observer);
  });
  const mockViewRemoveObserver = jest.fn((observer: View.Observer) => {
    viewObservers.delete(observer);
  });
  const mockUpdate = jest.fn((options: View.Options) => {
    testViewData = {
      ...testViewData,
      ...options,
    };

    mockViewNotify({ type: 'update' });
  });
  const mockGetViewData = jest.fn((): View.Options => testViewData);
  const mockDestroy = jest.fn();

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
    destroy: mockDestroy,
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
      lockedValues: [],
    };
    testViewData = {
      isHorizontal: true,
      isRange: true,
      isDragInterval: true,
      hasRunner: true,
      hasBar: true,
      hasScale: true,
      numOfScaleVal: 9,
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
      expect(mockRender).toBeCalledWith(testModelState);
      expect(viewObservers.size).toBe(1);
    });

    test('should create dataValues', () => {
      expect(testPresenter).toHaveProperty('dataValues', []);

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

    test('should subscribe to Model and View', () => {
      expect(mockViewAddObserver).toBeCalled();
      expect(mockAddObserver).toBeCalled();
    });
  });

  describe('getPresenterData', () => {
    test('should return presenter data: dataValues', () => {
      const presenterDataValues = testPresenter.getPresenterData();
      expect(presenterDataValues).toEqual({
        dataValues: [],
      });
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

    test('should calls render with new render data', () => {
      const newState = {
        maxValue: 50,
        minValue: 25,
        step: 5,
        value: 35,
        secondValue: 40,
      };
      testPresenter.update(newState);

      expect(testModelState).toEqual({
        maxValue: 50,
        minValue: 25,
        step: 5,
        value: 35,
        secondValue: 40,
        lockedValues: [],
      });
      expect(mockRender).toBeCalledWith(testModelState);
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

    test('should call the onFinish callback after changing the value (for example, the mouseup event)', () => {
      mockViewNotify({ type: 'finish' });

      expect(mockOnFinish).toBeCalledTimes(1);
      expect(mockOnUpdate).not.toBeCalled();

      // if range is true
      mockViewNotify({
        type: 'finish',
      });

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

      mockViewNotify({ type: 'finish' });
      expect(mockOnUpdate).toBeCalled();

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

    test('should call render method of View if notify action if update', () => {
      mockViewNotify({ type: 'update' });

      expect(mockRender).toBeCalled();
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

    test('should set secondValue to null if argument {secondValue: null}', () => {
      testPresenter.update({ secondValue: null });
      expect(mockUpdateState).toBeCalledWith({ secondValue: null });
    });

    test('should calls update method of view, if it is necessary to update the view props', () => {
      testPresenter.update({
        isHorizontal: false,
        isRange: true,
        isDragInterval: false,
        hasRunner: false,
        hasBar: true,
        hasScale: true,
        numOfScaleVal: 9,
        displayScaleValue: true,
        displayValue: false,
        displayMin: true,
        displayMax: true,
        prefix: '+',
        postfix: ' p.',
      });

      expect(mockUpdate).toBeCalledWith({
        isHorizontal: false,
        isRange: true,
        isDragInterval: false,
        hasRunner: false,
        hasBar: true,
        hasScale: true,
        numOfScaleVal: 9,
        displayScaleValue: true,
        displayValue: false,
        displayMin: true,
        displayMax: true,
        prefix: '+',
        postfix: ' p.',
      });

      testPresenter.update({ hasRunner: true });

      expect(mockUpdate).toBeCalledWith({ hasRunner: true });

      expect(mockUpdateState).not.toBeCalled();
    });

    test('should calls update method of view and updateState method of model, then changed renderData and calls render method of view', () => {
      testPresenter.update({
        isRange: false,
        maxValue: 25,
        minValue: 12,
        step: 3,
        value: 18,
        secondValue: null,
      });

      expect(mockUpdate).toBeCalledWith({ isRange: false });
      expect(mockUpdateState).toBeCalledWith({
        maxValue: 25,
        minValue: 12,
        step: 3,
        value: 18,
        secondValue: null,
      });

      expect(mockRender).toBeCalledWith({
        maxValue: 25,
        minValue: 12,
        step: 3,
        value: 18,
        secondValue: null,
        lockedValues: [],
      });

      // with userData
      jest.clearAllMocks();

      testPresenter.update({
        dataValues: testDataValues,
        value: 1,
        secondValue: 3,
      });
      expect(mockRender).toBeCalledTimes(1);
      expect(mockRender).toBeCalledWith({
        maxValue: 3,
        minValue: 0,
        step: 1,
        value: 1,
        secondValue: 3,
        lockedValues: ['maxValue', 'minValue', 'step'],
      },
      ['one', 'two', 'three', 'four']);
    });

    test('should update dataValues, change model state and numOfScaleVal, if options.dataValues.length > 1', () => {
      testPresenter.update({ dataValues: testDataValues });

      expect(testPresenter).toHaveProperty('dataValues', ['one', 'two', 'three', 'four']);

      expect(mockUpdateState).toBeCalledWith({
        unlockValues: 'all',
        maxValue: 3,
        minValue: 0,
        step: 1,
        lockedValues: ['maxValue', 'minValue', 'step'],
      });

      expect(mockUpdate).toBeCalledWith({ numOfScaleVal: 2 });

      jest.clearAllMocks();
      const data = [1];
      testPresenter.update({ dataValues: data });
      expect(mockUpdateState).not.toBeCalled();
      expect(mockUpdate).not.toBeCalled();
    });

    test('should update callbacks', () => {
      const mockNewOnStart = jest.fn();
      const mockNewOnChange = jest.fn();
      const mockNewOnFinish = jest.fn();
      const mockNewOnUpdate = jest.fn();

      testPresenter.update({
        onStart: mockNewOnStart,
        onChange: mockNewOnChange,
        onFinish: mockNewOnFinish,
        onUpdate: mockNewOnUpdate,
      });

      expect(testPresenter).toHaveProperty('callbacks', {
        onStart: mockNewOnStart,
        onChange: mockNewOnChange,
        onFinish: mockNewOnFinish,
        onUpdate: mockNewOnUpdate,
      });
    });

    test('should calls onUpdate callback', () => {
      testPresenter.update({
        value: 50,
        maxValue: 200,
      });

      expect(mockOnUpdate).toBeCalledTimes(1);
    });
  });

  describe('setUserData', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      testPresenter.setUserData(testDataValues);
    });

    test('should save user data to dataValues prop', () => {
      expect(testPresenter).toHaveProperty('dataValues', testDataValues);
    });

    test('should update model state', () => {
      expect(mockUpdateState).toBeCalledWith({
        unlockValues: 'all',
        maxValue: 3,
        minValue: 0,
        step: 1,
        lockedValues: ['maxValue', 'minValue', 'step'],
      });
    });

    test('should update numOfScaleVal option of view', () => {
      expect(mockUpdate).toBeCalledWith({ numOfScaleVal: 2 });
    });

    test('should render view', () => {
      expect(mockRender).toBeCalledTimes(1);
    });

    test('should not update model and render view if data.length < 2', () => {
      jest.clearAllMocks();
      testPresenter.setUserData([1]);

      expect(mockUpdateState).toBeCalledTimes(0);
      expect(mockUpdate).toBeCalledTimes(0);
      expect(mockRender).toBeCalledTimes(0);
    });
  });
});
