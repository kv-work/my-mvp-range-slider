/* eslint-disable fsd/no-function-declaration-in-event-listener */
import SliderPresenter from '../presenter';
import {
  OptionsModel,
  Observer,
  ViewData,
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
  const MockModel = jest.fn<Model, []>(() => {
    const model = {
      value: 10,
      maxValue: 100,
      minValue: 0,
      step: 5,
      getState: mockGetState,
      updateState: mockUpdateState,
      addObserver: mockAddObserver,
      removeObserver: mockRemoveObserver,
    };

    return model;
  });

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
  let testSecondView: View;
  let entries: [string, any][];

  beforeEach(() => {
    testModel = new MockModel();
    testView = new MockView();
    testSecondView = new MockView();
    testPresenter = new SliderPresenter(testModel, testView, testSecondView);
    entries = Object.entries(testPresenter);
  });

  afterEach(() => {
    mockAddObserver.mockClear();
    mockViewAddObserver.mockClear();
  });

  test('should have props: views, model, viewObserver, modelObserver', () => {
    expect(testPresenter).toBeInstanceOf(SliderPresenter);

    expect(testPresenter).toHaveProperty('views');
    entries.forEach((entry) => {
      if (entry[0] === 'views') {
        expect(entry[1].size).toBe(2);
      }
    });

    expect(testPresenter).toHaveProperty('model', testModel);

    expect(testPresenter).toHaveProperty('viewObserver');
    expect(testPresenter).toHaveProperty('modelObserver');
  });

  test('method sentModelObserver should calls model method addObserver', () => {
    expect(mockAddObserver).toHaveBeenCalledTimes(1);
  });

  test('method sentModelObserver should calls view method addObserver', () => {
    expect(mockViewAddObserver).toHaveBeenCalledTimes(2);
  });
});
