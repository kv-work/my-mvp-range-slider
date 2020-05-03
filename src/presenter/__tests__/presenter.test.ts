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

  //Mock SliderModel class
  const MockModel = jest.fn<Model, []>( () => {
    return {
      getState: jest.fn( (): OptionsModel => {
        return testModelState
      } ),
      updateState: jest.fn(),
      setCount: jest.fn(),
      addObserver: jest.fn(),
      removeObserver: jest.fn()
    }
  } )

  const MockView = jest.fn<View, []>( (): View => {
    return {
      render: jest.fn(),
      update: jest.fn(),
      unmount: jest.fn(),
      addObserver: jest.fn(),
      removeObserver: jest.fn()
    }
  } )

  let testPresenter: SliderPresenter,
      testModel: Model,
      testView: View,
      testSecondView: View;

  beforeEach( () => {
    testModel = new MockModel()
    testView = new MockView()
    testSecondView = new MockView()

    testPresenter = new SliderPresenter(testModel, testView, testSecondView)
  } )

  test('should have props: views, model, viewObserver, modelObserver', () => {
    expect(testPresenter).toBeInstanceOf(SliderPresenter);

    expect(MockView).toHaveBeenCalledTimes(2)
    expect(testPresenter).toHaveProperty('views');

    expect(MockModel).toHaveBeenCalledTimes(1)
    expect(testPresenter).toHaveProperty('model', testModel);
    
    expect(testPresenter).toHaveProperty('viewObserver');
    expect(testPresenter).toHaveProperty('modelObserver');
  })

  
})