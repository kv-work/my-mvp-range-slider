import { OptionsModel, Observer, Model } from '../../types';
import SliderModel from '../model';



describe.only('model', () => {

  const testOptions: OptionsModel = {
    maxValue: 10,
    minValue: 0,
    value: 3,
    step: 2
  };

  const optionsWithSecondValue: OptionsModel = {
    secondValue: 8,
    ...testOptions
  }

  let testModel: SliderModel,
      modelWithSecondValue: SliderModel,
      observer: Observer,
      anotherObserver: Observer;

  let updateFunc: jest.Mock,
      anotherUpdateFunc: jest.Mock;

  beforeEach( () => {
    testModel = new SliderModel(testOptions);
    modelWithSecondValue = new SliderModel(optionsWithSecondValue);
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
    modelWithSecondValue = null;
  } );

  test('constructor should set instance properties', () => {
    expect(testModel).toBeInstanceOf(SliderModel);
    expect(testModel.maxValue).toBe(10);
    expect(testModel.minValue).toBe(0);
    expect(testModel.step).toBe(2);
    expect(testModel.secondValue).toBeUndefined()

    //With second value
    expect(modelWithSecondValue).toBeInstanceOf(SliderModel);
    expect(modelWithSecondValue.secondValue).toBe(8);
  })

  test('getState should returns model state object', () => {
    expect(testModel.getState()).toBeInstanceOf(Object);

    const state = testModel.getState();
    expect(state).toHaveProperty('maxValue', 10);
    expect(state).toHaveProperty('minValue', 0);
    expect(state).toHaveProperty('step', 2);
    expect(state.secondValue).toBeUndefined()

    //With second value
    const stateWithSecondValue = modelWithSecondValue.getState();
    expect(stateWithSecondValue).toHaveProperty('secondValue', 8);
  })

  test('should set the value', () => {
    testModel.value = 2;
    expect(testModel.value).toBe(2);
    testModel.value = 4;
    expect(testModel.value).toBe(4);
    testModel.value = 6;
    expect(testModel.value).toBe(6);
  })

  test('should set the secondValue', () => {
    modelWithSecondValue.secondValue = 4;
    expect(modelWithSecondValue.secondValue).toBe(4);
    modelWithSecondValue.secondValue = 6;
    expect(modelWithSecondValue.secondValue).toBe(6);
    modelWithSecondValue.secondValue = 8;
    expect(modelWithSecondValue.secondValue).toBe(8);
  })

  test('set maxValue should change this._maxValue', () => {
    testModel.maxValue = 15;
    expect(testModel.maxValue).toBe(15)
  })

  test('set maxValue should NOT change this._maxValue, if newValue less then this.minValue', () => {
    testModel.maxValue = -10;
    expect(testModel.maxValue).toBe(10)
  })

  test('set minValue should change this.minValue', () => {
    testModel.minValue = 5;
    expect(testModel.minValue).toBe(5)
  })

  test('set minValue should NOT change this.minValue, if newValue greater then this.maxValue', () => {
    testModel.minValue = 1000;
    expect(testModel.minValue).toBe(0)
  })

  test('set step should change this.step', () => {
    testModel.step = 4;

    expect(testModel).toHaveProperty('_step', 4)
  })

  test('step always should be greater then 0', () => {
    testModel.step = -1;
    expect(testModel).toHaveProperty('_step', 2);
    expect(testModel.step).toBe(2);

    testModel.step = 0;
    expect(testModel).toHaveProperty('_step', 2);
    expect(testModel.step).toBe(2);
  })

  test('changing step should changed value, secondValue', () => {
    testModel.step = 3;
    expect(testModel.value).toBe(3);

    testModel.step = 10;
    expect(testModel.value).toBe(0);

    //with second value
    modelWithSecondValue.step = 3;
    expect(modelWithSecondValue.secondValue).toBe(9);

    modelWithSecondValue.step = 7;
    expect(modelWithSecondValue.secondValue).toBe(7);
  })

  test('changing max or min limit should changed value and secondValue, if necessary', () => {
    testModel.value = 9;
    testModel.maxValue = 5;
    expect(testModel.value).toBe(5);

    testModel.value = 2;
    testModel.minValue = 3;
    expect(testModel.value).toBe(3);

    //with second value
    modelWithSecondValue.maxValue = 7;
    expect(modelWithSecondValue.secondValue).toBe(7);
    modelWithSecondValue.secondValue = 4; 
    modelWithSecondValue.minValue = 5;
    expect(modelWithSecondValue.secondValue).toBe(5);
    expect(modelWithSecondValue.value).toBe(5);
  })

  test('the set value, secondValue should be a multiple of the step', () => {
    expect(testModel.value).toBe(2);
    testModel.value = 7;
    expect(testModel.value).toBe(6);

    //with second value
    modelWithSecondValue.secondValue = 7;
    expect(modelWithSecondValue.secondValue).toBe(6);
  })

  test('if the argument of the set value, secondValue accessor is greater than the maxCount, then value should equal maxValue', () => {
    const maxValue = testModel.maxValue;
    testModel.value = 555;
    expect(testModel.value).toEqual(maxValue);

    //with second value
    modelWithSecondValue.secondValue = 1000;
    expect(modelWithSecondValue.secondValue).toBe(maxValue);
  })

  test('if the argument of the set value, secondValue accessor is less than the minCount, then value should equal minValue', () => {
    const minValue = testModel.minValue;
    testModel.value = -15;
    expect(testModel.value).toEqual(minValue);

    //with second value
    modelWithSecondValue.value = -1000;
    modelWithSecondValue.secondValue = -100;
    expect(modelWithSecondValue.secondValue).toBe(minValue);
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

  test('if the state CHANGES, the model should notify observers', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);

    testModel.value = 0;
    testModel.value = 8;

    testModel.maxValue = 20;
    testModel.minValue = 5;
    testModel.step = 5;

    expect(updateFunc).toHaveBeenCalledTimes(5);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(5);

    testModel.step = 7

    expect(updateFunc).toHaveBeenCalledTimes(6);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(6);

    //with second value
    modelWithSecondValue.addObserver(observer);
    modelWithSecondValue.addObserver(anotherObserver);

    modelWithSecondValue.minValue = -100;                    //change #1
    modelWithSecondValue.maxValue = 100;                     //change #2
    modelWithSecondValue.value = -50;                        //change #3
    modelWithSecondValue.secondValue = 75;                   //change #4
    expect(modelWithSecondValue.secondValue).toBe(74);
    modelWithSecondValue.step = 5;                           //change #5
    expect(modelWithSecondValue.secondValue).toBe(75);

    expect(updateFunc).toHaveBeenCalledTimes(11);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(11);
  })

  test('if the values does NOT CHANGES, the model should not notify observers', () => {
    testModel.addObserver(observer);

    const currValue = testModel.getState().value;

    //setCount()
    testModel.value = currValue;
    expect(updateFunc).not.toHaveBeenCalled();

    //with second value
    modelWithSecondValue.addObserver(observer);
    modelWithSecondValue.secondValue = 8;
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
    expect(testModel).toHaveProperty('_maxValue', 100);
    expect(testModel).toHaveProperty('_minValue', 50);
    expect(testModel).toHaveProperty('_step', 5);
    //value should be equal minValue
    expect(testModel).toHaveProperty('_value', 50);

    testModel.updateState(newMaxValue);
    expect(testModel.maxValue).toBe(200);

    testModel.updateState({value: 199});
    expect(testModel.value).toBe(200);

    testModel.updateState({minValue: 0});
    expect(testModel.minValue).toBe(0);

    //set wrong step
    testModel.updateState({step: 0, value: -5, minValue: -10});
    expect(testModel.value).toBe(-5);
    expect(testModel.step).toBe(5);
    expect(testModel.minValue).toBe(-10);

    //add second value
    expect(testModel.secondValue).toBeUndefined(); 
    testModel.updateState({
      secondValue: 50
    });
    expect(testModel.secondValue).toBe(50);
  })

  test('after updating the model with the method updateState(), the notify() should be called only once', () => {
    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);
    testModel.updateState({
      maxValue: 100,
      minValue: 0,
      step: 25,
      value: 40
    })

    expect(updateFunc).toHaveBeenCalledTimes(1);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(1);

    //with second value
    testModel.updateState({
      secondValue: 55
    })

    expect(updateFunc).toHaveBeenCalledTimes(2);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
  })

  test('set accessors should validate arguments', () => {
    testModel.value = undefined;
    expect(testModel).toHaveProperty('_value', 2)
    testModel.value = null;
    expect(testModel).toHaveProperty('_value', 2)
    testModel.value = Infinity;
    expect(testModel).toHaveProperty('_value', 2)

    testModel.maxValue = 25;
    testModel.maxValue = undefined;
    expect(testModel.maxValue).toBe(25);
    testModel.maxValue = null;
    expect(testModel.maxValue).toBe(25);
    testModel.maxValue = -Infinity;
    expect(testModel.maxValue).toBe(25);

    testModel.minValue = 5;
    testModel.minValue = undefined;
    expect(testModel.minValue).toBe(5);
    testModel.minValue = null;
    expect(testModel.minValue).toBe(5);
    testModel.minValue = 1000 / 0;
    expect(testModel.minValue).toBe(5);

    testModel.step = 1;
    testModel.step = undefined;
    expect(testModel.step).toBe(1);
    testModel.step = null;
    expect(testModel.step).toBe(1);
    testModel.step = 42 + Infinity;
    expect(testModel.step).toBe(1);
    

    testModel.secondValue = 20;
    expect(testModel).toHaveProperty('_secondValue', 20)
    testModel.secondValue = null;
    expect(testModel).toHaveProperty('_secondValue', 20)
    testModel.secondValue = NaN;
    expect(testModel).toHaveProperty('_secondValue', 20)
  })

  test('value should less or equal then secondValue', () => {
    modelWithSecondValue.secondValue = 8;
    modelWithSecondValue.value = 8;
    expect(modelWithSecondValue.value).toBe(8);

    modelWithSecondValue.value = 10;
    expect(modelWithSecondValue.value).toBe(8);
  })

  test('secondValue should greater or equal then value', () => {
    modelWithSecondValue.secondValue = 8;
    modelWithSecondValue.value = 8;

    modelWithSecondValue.secondValue = 5;
    expect(modelWithSecondValue.secondValue).toBe(8);

    modelWithSecondValue.secondValue = 0;
    expect(modelWithSecondValue.secondValue).toBe(8);
  })
})