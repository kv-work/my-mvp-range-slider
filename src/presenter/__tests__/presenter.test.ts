import SliderPresenter from '../presenter';
import { OptionsModel, Observer, ViewData, View, Model } from '../../types';



//replace .only
describe.only('Presenter', () => {

  document.body.innerHTML = `<div id="container"></div>`;

  const testNode = document.getElementById('container');

  //Mock SliderModel class
  const mockModel = jest.fn<Model, [OptionsModel]>( (state: OptionsModel) => ({
    maxCount: state.maxCount,
    minCount: state.minCount,
    step: state.step,
    count: state.startCount,

    getState: jest.fn( (): OptionsModel => {
      return
    } ),
    updateState: jest.fn( (state: OptionsModel) => {} ),
    setCount: jest.fn( (value: number) => {} ),
    addObserver: jest.fn( (observer: Observer) => {} ),
    removeObserver: jest.fn( (observer: Observer) => {} )
  }) )

  const mockView = jest.fn<View, [HTMLElement]>( (): View => {
    return {
      render: jest.fn( (viewData: ViewData) => {} ),
      update: jest.fn( (viewData: ViewData) => {} ),
      unmount: jest.fn(),
      addObserver: jest.fn( (observer: Observer) => {} ),
      removeObserver: jest.fn( (observer: Observer) => {} )
    }
  } )

  let testPresenter: SliderPresenter,
      testModel: Model,
      testView: View,
      testSecondView: View;

  const testModelState: OptionsModel = {
    maxCount: 100,
    minCount: 0,
    step: 5,
    startCount: 25
  };

  beforeEach( () => {


  } )


  test('getModelData should return model state', () => {

  })

  
})