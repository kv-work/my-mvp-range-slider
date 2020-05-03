import SliderPresenter from '../presenter';
import { OptionsModel, Observer, ViewData, View, Model } from '../../types';

//replace .only
describe.only('Presenter', () => {

  document.body.innerHTML = `<div id="container"></div>`;

  const testNode = document.getElementById('container');

  const testModelState: OptionsModel = {
    maxCount: 100,
    minCount: 0,
    step: 5,
    startCount: 25
  };

  //Mock funcs for test model
  const mockAddObserver = jest.fn(),
        mockSetCount = jest.fn(),
        mockRemoveObserver = jest.fn(),
        mockUpdateState = jest.fn(),
        mockGetState = jest.fn((): OptionsModel => {
          return testModelState
        });

  //Mock funcs for test view
  const mockViewAddObserver = jest.fn(),
        mockViewRemoveObserver = jest.fn(),
        mockRender = jest.fn(),
        mockUpdate = jest.fn(),
        mockUnmount = jest.fn();

  //Mock SliderModel class
  const MockModel = jest.fn<Model, []>( () => {
    return {
      addObserver: mockAddObserver,
      setCount: mockSetCount,
      removeObserver: mockRemoveObserver,
      updateState: mockUpdateState,
      getState: mockGetState
    }
  } )

  const MockView = jest.fn<View, []>( (): View => {
    return {
      render: mockRender,
      update: mockUpdate,
      unmount: mockUnmount,
      addObserver: mockViewAddObserver,
      removeObserver: mockViewRemoveObserver
    }
  } )

  let testPresenter: SliderPresenter,
      testModel: Model,
      testView: View,
      testSecondView: View,
      entries: Array<any>;

  beforeEach( () => {

    testModel = new MockModel()
    testView = new MockView()
    testSecondView = new MockView()

    testPresenter = new SliderPresenter(testModel, testView, testSecondView)

    entries = Object.entries(testPresenter)
    
  } )

  afterEach( () => {

    mockAddObserver.mockClear()
    mockViewAddObserver.mockClear()
  })

  test('should have props: views, model, viewObserver, modelObserver', () => {

    expect(testPresenter).toBeInstanceOf(SliderPresenter);

    expect(testPresenter).toHaveProperty('views');
    entries.forEach( (entry) => {
      if ( entry[0] === 'views' ) {
        expect(entry[1].size).toBe(2)
      }
    } )

    expect(testPresenter).toHaveProperty('model', testModel);

    expect(testPresenter).toHaveProperty('viewObserver');
    expect(testPresenter).toHaveProperty('modelObserver');
  })

  test('method sentModelObserver should calls model method addObserver', () => {
    expect(mockAddObserver).toHaveBeenCalledTimes(1)
  })

  test('method sentModelObserver should calls view method addObserver', () => {
    expect(mockViewAddObserver).toHaveBeenCalledTimes(2)
  } )
})