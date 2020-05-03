import { OptionsModel, Observer, Model } from '../../types';
import SliderModel from '../model';



describe.only('model', () => {

  const testOptions: OptionsModel = {
    maxValue: 10,
    minValue: 0,
    value: 3,
    step: 2
  };

  let testModel: SliderModel,
      observer: Observer,
      anotherObserver: Observer;

  let updateFunc: jest.Mock,
      anotherUpdateFunc: jest.Mock;

  beforeEach( () => {
    testModel = new SliderModel(testOptions);
    updateFunc = jest.fn(),
    anotherUpdateFunc = jest.fn();
  
    observer = {
      update: updateFunc
    };
  
    anotherObserver = {
      update: anotherUpdateFunc
    }

  } );

  afterEach( () => {
    testModel = null;
  } );

  test('constructor should set instance properties', () => {
    expect(testModel).toBeInstanceOf(SliderModel);
    expect(testModel).toHaveProperty('maxValue', 10);
    expect(testModel).toHaveProperty('minValue', 0);
    expect(testModel).toHaveProperty('step', 2);
    expect(testModel).toHaveProperty('value', 3);
  })

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object);

    const state = testModel.getState();
    expect(state).toHaveProperty('maxValue', 10);
    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('value', 3);
    expect(state).toHaveProperty('step', 2);
  })

  test('setCount should set the value', () => {
    testModel.setValue(7);
    expect(testModel.getState().value).toBe(7);

    testModel.setValue(2);
    expect(testModel.getState().value).toBe(2);
  })

  test('if the argument of the setCount func is greater than the maxCount, then the function call returns an error', () => {
    expect( () => {
      testModel.setValue(15)
    } ).toThrowError(/^Value greater then maximum value of slider$/);
  })

  test('if the argument of the setCount func is less than the minCount, then the function call returns an error', () => {
    expect( () => {
      testModel.setValue(-15)
    } ).toThrowError(/^Value less then minimum value of slider$/);
  })

  test('addObserver should added observer to this.observers', () => {
    expect(testModel).toHaveProperty('observers');
    testModel.addObserver(observer);

    const entries: Array<any> = Object.entries(testModel)
    entries.forEach( (entry: [String, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy()
      }
    });
  })

  test('removeObserver should removed observer', () => {
    expect(testModel).toHaveProperty('observers');
    const entries: Array<any> = Object.entries(testModel)

    //Add observer
    testModel.addObserver(observer);
    entries.forEach( (entry: [String, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy()
      }
    });

    //Remove observer
    testModel.removeObserver(observer);
    entries.forEach( (entry: [String, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeFalsy()
      }
    });
  })

  test('if the count CHANGES, the model should notify observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    for (let i = 1; i < 6; i++) {
      testModel.setValue(i)
    }

    expect(updateFunc).toHaveBeenCalledTimes(5);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(5);
  })

  test('if the count does NOT CHANGES, the model should not notify observers', () => {
    testModel.addObserver(observer);

    //setCount()
    testModel.setValue(3);
    expect(updateFunc).not.toHaveBeenCalled()
  })
})