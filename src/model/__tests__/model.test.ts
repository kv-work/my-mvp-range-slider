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
    expect(testModel.maxValue).toBe(10);
    expect(testModel).toHaveProperty('minValue', 0);
    expect(testModel).toHaveProperty('step', 2);
  })

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object);

    const state = testModel.getState();
    expect(state).toHaveProperty('maxValue', 10);
    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('step', 2);
  })

  test('should set the value', () => {
    testModel.value = 2;
    expect(testModel.value).toBe(2);
    testModel.value = 4;
    expect(testModel.value).toBe(4);
    testModel.value = 6;
    expect(testModel.value).toBe(6);
  })

  test('set maxValue should change this._maxValue', () => {
    testModel.maxValue = 15;
    expect(testModel.maxValue).toBe(15)
  })

  test('set maxValue should NOT change this._maxValue, if  newValue less then this.minValue', () => {
    testModel.maxValue = -10;
    expect(testModel.maxValue).toBe(10)
  })

  test('setMinValue should change this.minValue', () => {
    testModel.setMinValue(5);
    expect(testModel).toHaveProperty('minValue', 5)
  })

  test('setMinValue should NOT change this.minValue, if  newValue greater then this.maxValue', () => {
    testModel.setMinValue(1000)
    expect(testModel).toHaveProperty('minValue', 0)
  })

  test('the set value should be a multiple of the step', () => {
    expect(testModel).toHaveProperty('value', 2);
    testModel.value = 7;
    expect(testModel.value).toBe(6);
  })

  test('if the argument of the setCount func is greater than the maxCount, then value should equal maxValue', () => {
    const maxValue = testModel.getState().maxValue;
    testModel.value = 555;
    expect(testModel.value).toEqual(maxValue);
  })

  test('if the argument of the setCount func is less than the minCount, then value should equal minValue', () => {
    const minValue = testModel.getState().minValue;
    testModel.value = -15;
    expect(testModel.getState().value).toEqual(minValue);
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

    for (let i = 0; i < 11; i += testOptions.step) {
      testModel.value = i;
    }

    expect(updateFunc).toHaveBeenCalledTimes(6);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(6);
  })

  test('if the count does NOT CHANGES, the model should not notify observers', () => {
    testModel.addObserver(observer);

    const currValue = testModel.getState().value;

    //setCount()
    testModel.value = currValue;
    expect(updateFunc).not.toHaveBeenCalled();
  })

  test('updateState should take OptionsModel object or object {prop: value} and update instance properties', () => {
    const newModelState: OptionsModel = {
      maxValue: 100,
      minValue: 50,
      step: 5,
      value: 0
    };
    const newMaxValue: OptionsModel = {
      maxValue: 200
    };

    testModel.updateState(newModelState);
    expect(testModel).toHaveProperty('maxValue', 100);
    expect(testModel).toHaveProperty('minValue', 50);
    expect(testModel).toHaveProperty('step', 5);
    //value should be equal minValue
    expect(testModel).toHaveProperty('value', 50);

    testModel.updateState(newMaxValue);
    expect(testModel).toHaveProperty('maxValue', 200);

    testModel.updateState({value: 199});
    expect(testModel).toHaveProperty('value', 200)
  })
})