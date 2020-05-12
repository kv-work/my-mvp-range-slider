/* eslint-disable fsd/no-function-declaration-in-event-listener */
import { OptionsModel, Observer } from '../../types';
import SliderModel from '../model';

describe.only('model', () => {
  const testOptions: OptionsModel = {
    maxValue: 10,
    minValue: 0,
    value: 3,
    step: 2,
  };

  const optionsWithSecondValue: OptionsModel = {
    secondValue: 8,
    ...testOptions,
  };

  let testModel: SliderModel;
  let modelWithSecondValue: SliderModel;
  let observer: Observer;
  let anotherObserver: Observer;

  let updateFunc: jest.Mock;
  let anotherUpdateFunc: jest.Mock;

  beforeEach(() => {
    testModel = new SliderModel(testOptions);
    modelWithSecondValue = new SliderModel(optionsWithSecondValue);
    updateFunc = jest.fn();
    anotherUpdateFunc = jest.fn();

    observer = {
      update: updateFunc,
    };

    anotherObserver = {
      update: anotherUpdateFunc,
    };

    testModel.addObserver(observer);
    testModel.addObserver(anotherObserver);
    modelWithSecondValue.addObserver(observer);
    modelWithSecondValue.addObserver(anotherObserver);
    testModel.lockedValues.clear();
  });

  afterEach(() => {
    testModel = null;
    modelWithSecondValue = null;
  });

  describe('constructor', () => {
    test('should set instance properties', () => {
      expect(testModel).toBeInstanceOf(SliderModel);
      expect(testModel.maxValue).toBe(10);
      expect(testModel.minValue).toBe(0);
      expect(testModel.step).toBe(2);
      expect(testModel.secondValue).toBeUndefined();

      // With second value
      expect(modelWithSecondValue).toBeInstanceOf(SliderModel);
      expect(modelWithSecondValue.secondValue).toBe(8);
    });
  });

  describe('getState', () => {
    test('should returns model state object', () => {
      expect(testModel.getState()).toBeInstanceOf(Object);

      const state = testModel.getState();
      expect(state).toHaveProperty('maxValue', 10);
      expect(state).toHaveProperty('minValue', 0);
      expect(state).toHaveProperty('step', 2);
      expect(state.secondValue).toBeUndefined();

      // With second value
      const stateWithSecondValue = modelWithSecondValue.getState();
      expect(stateWithSecondValue).toHaveProperty('secondValue', 8);
    });
  });

  describe('_value', () => {
    test('should have setter and getter', () => {
      testModel.value = 2;
      expect(testModel.value).toBe(2);
      testModel.value = 4;
      expect(testModel.value).toBe(4);
      testModel.value = 6;
      expect(testModel.value).toBe(6);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.value = undefined;
      expect(testModel).toHaveProperty('_value', 2);
      testModel.value = null;
      expect(testModel).toHaveProperty('_value', 2);
      testModel.value = Infinity;
      expect(testModel).toHaveProperty('_value', 2);
    });

    test('should be a multiple of the step', () => {
      expect(testModel.value).toBe(2);
      testModel.value = 7;
      expect(testModel.value).toBe(6);
    });

    test('should not be more than maxCount', () => {
      const { maxValue } = testModel;
      testModel.value = 555;
      expect(testModel.value).toEqual(maxValue);
    });

    test('should not be less than minCount', () => {
      const { minValue } = testModel;
      testModel.value = -15;
      expect(testModel.value).toEqual(minValue);
    });

    test('should be less or equal then secondValue', () => {
      modelWithSecondValue.secondValue = 8;
      modelWithSecondValue.value = 8;
      expect(modelWithSecondValue.value).toBe(8);

      modelWithSecondValue.value = 10;
      expect(modelWithSecondValue.value).toBe(8);
    });

    test('should notify of changes', () => {
      expect(testModel.value).toBe(2);
      testModel.value = 0;
      expect(testModel.value).toBe(0);
      testModel.value = 8;
      expect(testModel.value).toBe(8);

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if value has not changed', () => {
      expect(testModel.value).toBe(2);
      expect(testModel.step).toBe(2);
      testModel.value = 2;
      testModel.value = 3;
      testModel.value = 2.5;

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();
    });

    test('should not change value if it is locked', () => {
      expect(testModel.value).toBe(2);
      testModel.lockState(['value']);

      testModel.value = 6;
      expect(testModel.value).toBe(2);
    });
  });

  describe('_secondValue', () => {
    test('should have setter and getter', () => {
      modelWithSecondValue.secondValue = 4;
      expect(modelWithSecondValue.secondValue).toBe(4);
      modelWithSecondValue.secondValue = 6;
      expect(modelWithSecondValue.secondValue).toBe(6);
      modelWithSecondValue.secondValue = 8;
      expect(modelWithSecondValue.secondValue).toBe(8);
    });

    test('should not be null or Infinity', () => {
      testModel.maxValue = 25;
      testModel.step = 1;
      testModel.secondValue = 20;
      expect(testModel).toHaveProperty('_secondValue', 20);
      testModel.secondValue = null;
      expect(testModel).toHaveProperty('_secondValue', 20);
      testModel.secondValue = NaN;
      expect(testModel).toHaveProperty('_secondValue', 20);
    });

    test('should be a multiple of the step', () => {
      modelWithSecondValue.secondValue = 7;
      expect(modelWithSecondValue.secondValue).toBe(6);
    });

    test('should not be more than maxCount', () => {
      const { maxValue } = testModel;
      modelWithSecondValue.secondValue = 1000;
      expect(modelWithSecondValue.secondValue).toBe(maxValue);
    });

    test('should not be less than minCount', () => {
      const { minValue } = testModel;
      // with second value
      modelWithSecondValue.value = -1000;
      modelWithSecondValue.secondValue = -100;
      expect(modelWithSecondValue.secondValue).toBe(minValue);
    });

    test('should be greater or equal then value', () => {
      modelWithSecondValue.secondValue = 8;
      modelWithSecondValue.value = 8;

      modelWithSecondValue.secondValue = 5;
      expect(modelWithSecondValue.secondValue).toBe(8);

      modelWithSecondValue.secondValue = 0;
      expect(modelWithSecondValue.secondValue).toBe(8);
    });

    test('should notify of changes', () => {
      expect(modelWithSecondValue.secondValue).toBe(8);
      modelWithSecondValue.secondValue = 4;
      expect(modelWithSecondValue.secondValue).toBe(4);
      modelWithSecondValue.secondValue = 8;
      expect(modelWithSecondValue.secondValue).toBe(8);

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if secondValue has not changed', () => {
      expect(modelWithSecondValue.secondValue).toBe(8);
      expect(modelWithSecondValue.step).toBe(2);
      modelWithSecondValue.secondValue = 8;
      modelWithSecondValue.secondValue = 9;
      expect(modelWithSecondValue.secondValue).toBe(8);
      modelWithSecondValue.secondValue = 8.7;
      expect(modelWithSecondValue.secondValue).toBe(8);

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();
    });

    test('should not change secondValue if it is locked', () => {
      expect(modelWithSecondValue.secondValue).toBe(8);
      modelWithSecondValue.lockState(['secondValue']);

      modelWithSecondValue.secondValue = 6;
      expect(modelWithSecondValue.secondValue).toBe(8);
    });
  });

  describe('_maxValue', () => {
    test('should have setter and getter', () => {
      testModel.maxValue = 15;
      expect(testModel.maxValue).toBe(15);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.maxValue = 25;
      testModel.maxValue = undefined;
      expect(testModel.maxValue).toBe(25);
      testModel.maxValue = null;
      expect(testModel.maxValue).toBe(25);
      testModel.maxValue = -Infinity;
      expect(testModel.maxValue).toBe(25);
    });

    test('should NOT be changed, if newValue less then this._minValue', () => {
      testModel.maxValue = -10;
      expect(testModel.maxValue).toBe(10);
    });

    test('should changed value and secondValue, if necessary', () => {
      testModel.value = 9;
      testModel.maxValue = 5;
      expect(testModel.value).toBe(5);

      // with second value
      modelWithSecondValue.maxValue = 7;
      expect(modelWithSecondValue.secondValue).toBe(7);
      modelWithSecondValue.secondValue = 4;
    });

    test('should notify of changes', () => {
      expect(testModel.maxValue).toBe(10);
      testModel.maxValue = 20;
      expect(testModel.maxValue).toBe(20);
      testModel.maxValue = 100;
      expect(testModel.maxValue).toBe(100);

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if maxValue has not changed', () => {
      expect(testModel.maxValue).toBe(10);
      expect(testModel.minValue).toBe(0);
      testModel.maxValue = 10;
      testModel.maxValue = -1;

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();
    });

    test('should not change maxValue if it is locked', () => {
      expect(testModel.maxValue).toBe(10);
      testModel.lockState(['maxValue']);

      testModel.maxValue = 100;
      expect(testModel.maxValue).toBe(10);
    });
  });

  describe('_minValue', () => {
    test('should have setter and getter', () => {
      testModel.minValue = 5;
      expect(testModel.minValue).toBe(5);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.minValue = 5;
      testModel.minValue = undefined;
      expect(testModel.minValue).toBe(5);
      testModel.minValue = null;
      expect(testModel.minValue).toBe(5);
      testModel.minValue = 1000 / 0;
      expect(testModel.minValue).toBe(5);
    });

    test('should NOT be changed, if newValue greater then this.maxValue', () => {
      testModel.minValue = 1000;
      expect(testModel.minValue).toBe(0);
    });

    test('should changed value and secondValue, if necessary', () => {
      testModel.value = 2;
      testModel.minValue = 3;
      expect(testModel.value).toBe(3);

      // with second value
      modelWithSecondValue.secondValue = 4;
      modelWithSecondValue.minValue = 5;
      expect(modelWithSecondValue.secondValue).toBe(5);
      expect(modelWithSecondValue.value).toBe(5);
    });

    test('should notify of changes', () => {
      expect(testModel.minValue).toBe(0);
      testModel.minValue = -10;
      expect(testModel.minValue).toBe(-10);
      testModel.minValue = 5;
      expect(testModel.minValue).toBe(5);

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if minValue has not changed', () => {
      expect(testModel.maxValue).toBe(10);
      expect(testModel.minValue).toBe(0);
      testModel.minValue = 0;
      testModel.minValue = 100;

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();
    });

    test('should not change minValue if it is locked', () => {
      expect(testModel.minValue).toBe(0);
      testModel.lockState(['minValue']);

      testModel.minValue = 5;
      expect(testModel.minValue).toBe(0);
      testModel.minValue = -5;
      expect(testModel.minValue).toBe(0);
    });
  });

  describe('_step', () => {
    test('should have setter and getter', () => {
      testModel.step = 4;

      expect(testModel).toHaveProperty('_step', 4);
    });

    test('should not be undefined, null or Infinity', () => {
      testModel.step = 1;
      testModel.step = undefined;
      expect(testModel.step).toBe(1);
      testModel.step = null;
      expect(testModel.step).toBe(1);
      testModel.step = 42 + Infinity;
      expect(testModel.step).toBe(1);
    });

    test('always should be greater then 0', () => {
      testModel.step = -1;
      expect(testModel).toHaveProperty('_step', 2);
      expect(testModel.step).toBe(2);

      testModel.step = 0;
      expect(testModel).toHaveProperty('_step', 2);
      expect(testModel.step).toBe(2);
    });

    test('should changed value, secondValue, if necessary', () => {
      testModel.step = 3;
      expect(testModel.value).toBe(3);

      testModel.step = 10;
      expect(testModel.value).toBe(0);

      // with second value
      modelWithSecondValue.step = 3;
      expect(modelWithSecondValue.secondValue).toBe(9);

      modelWithSecondValue.step = 7;
      expect(modelWithSecondValue.secondValue).toBe(7);
    });

    test('should notify of changes', () => {
      expect(testModel.step).toBe(2);
      testModel.step = 3;
      expect(testModel.step).toBe(3);
      testModel.step = 1;
      expect(testModel.step).toBe(1);

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });

    test('should not notify, if minValue has not changed', () => {
      expect(testModel.step).toBe(2);
      testModel.step = 2;

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();
    });

    test('should not change step if it is locked', () => {
      expect(testModel.step).toBe(2);
      testModel.lockState(['step']);

      testModel.step = 5;
      expect(testModel.step).toBe(2);
      testModel.step = -5;
      expect(testModel.step).toBe(2);
    });
  });

  // describe('lockedValues', () => {
  //   test('should have only getter', () => {

  //   });
  // });

  describe('addObserver', () => {
    test('should added observer to this.observers', () => {
      expect(testModel).toHaveProperty('observers');

      const entries = Object.entries(testModel);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.has(observer)).toBeTruthy();
        }
      });
    });
  });

  describe('removeObserver', () => {
    test('should removed observer', () => {
      expect(testModel).toHaveProperty('observers');
      const entries = Object.entries(testModel);

      testModel.removeObserver(observer);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Observer> = entry[1];
          expect(observers.has(observer)).toBeFalsy();
        }
      });
    });
  });

  describe('updateState', () => {
    test('should update instance properties', () => {
      const newModelState: OptionsModel = {
        maxValue: 100,
        minValue: 50,
        step: 5,
        value: 0,
      };
      const newMaxValue: OptionsModel = {
        maxValue: 200,
      };

      testModel.updateState(newModelState);
      expect(testModel).toHaveProperty('_maxValue', 100);
      expect(testModel).toHaveProperty('_minValue', 50);
      expect(testModel).toHaveProperty('_step', 5);
      // value should be equal minValue
      expect(testModel).toHaveProperty('_value', 50);

      testModel.updateState(newMaxValue);
      expect(testModel.maxValue).toBe(200);

      testModel.updateState({ value: 199 });
      expect(testModel.value).toBe(200);

      testModel.updateState({ minValue: 0 });
      expect(testModel.minValue).toBe(0);

      // set wrong step
      testModel.updateState({ step: 0, value: -5, minValue: -10 });
      expect(testModel.value).toBe(-5);
      expect(testModel.step).toBe(5);
      expect(testModel.minValue).toBe(-10);

      // add second value
      expect(testModel.secondValue).toBeUndefined();
      testModel.updateState({
        secondValue: 50,
      });
      expect(testModel.secondValue).toBe(50);
    });

    test('should notify of changes only once', () => {
      testModel.addObserver(observer);
      testModel.addObserver(anotherObserver);
      testModel.updateState({
        maxValue: 100,
        minValue: 0,
        step: 25,
        value: 40,
      });

      expect(updateFunc).toHaveBeenCalledTimes(1);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(1);

      // with second value
      testModel.updateState({
        secondValue: 55,
      });

      expect(updateFunc).toHaveBeenCalledTimes(2);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(2);
    });
  });

  describe('lockState', () => {
    test('should adds selected values into lockValues', () => {
      testModel.lockState(['minValue', 'maxValue']);
      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('maxValue')).toBeTruthy();
      expect(testModel.lockedValues.has('step')).toBeFalsy();
    });

    test('should adds all values into lockValues, if lockState argument is "all"', () => {
      testModel.lockState('all');
      expect(testModel.lockedValues.has('maxValue')).toBeTruthy();
      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('value')).toBeTruthy();
      expect(testModel.lockedValues.has('step')).toBeTruthy();
      expect(testModel.lockedValues.has('secondValue')).toBeTruthy();
    });
  });
});
