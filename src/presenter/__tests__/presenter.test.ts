/* eslint-disable fsd/no-function-declaration-in-event-listener */
import SliderPresenter from '../presenter';
import {
  OptionsModel,
  View,
  Model,
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

  // Mock funcs for test model
  const mockAddObserver = jest.fn();
  const mockRemoveObserver = jest.fn();
  const mockUpdateState = jest.fn();
  const mockGetState = jest.fn((): OptionsModel => testModelState);

  // Mock funcs for test view
  const mockViewAddObserver = jest.fn();
  const mockViewRemoveObserver = jest.fn();
  const mockRender = jest.fn();
  const mockUpdate = jest.fn();
  const mockUnmount = jest.fn();

  // Mock SliderModel class
  const MockModel = jest.fn<Model, []>(() => ({
    maxValue: 100,
    minValue: 0,
    step: 5,
    value: 25,
    getState: mockGetState,
    updateState: mockUpdateState,
    addObserver: mockAddObserver,
    removeObserver: mockRemoveObserver,
  }));

  const MockView = jest.fn<View, []>((): View => ({
    render: mockRender,
    update: mockUpdate,
    unmount: mockUnmount,
    addObserver: mockViewAddObserver,
    removeObserver: mockViewRemoveObserver,
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

  test('should have props: view, model, viewObserver, modelObserver, settings', () => {
    expect(testPresenter).toBeInstanceOf(SliderPresenter);
    expect(testPresenter).toHaveProperty('view', testView);
    expect(testPresenter).toHaveProperty('model', testModel);
    expect(testPresenter).toHaveProperty('viewObserver');
    expect(testPresenter).toHaveProperty('modelObserver');
    expect(testPresenter).toHaveProperty('settings');
  });

  test('method sentModelObserver should calls model method addObserver', () => {
    expect(mockAddObserver).toHaveBeenCalledTimes(1);
  });

  test('method sentViewObserver should calls view method addObserver', () => {
    expect(mockViewAddObserver).toHaveBeenCalledTimes(1);
  });
});
