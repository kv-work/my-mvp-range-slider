import SliderModel from '../model';

describe('model', () => {
  const testOptions: Model.Options = {
    maxValue: 10,
    minValue: 0,
    value: 3,
    step: 2,
  };

  const optionsWithSecondValue: Model.Options = {
    secondValue: 8,
    ...testOptions,
  };

  let testModel: SliderModel;
  let modelWithSecondValue: SliderModel;
  let observer: Model.Observer;
  let anotherObserver: Model.Observer;

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

    test('should create lockedValues', () => {
      expect(testModel).toHaveProperty('lockedValues');
      expect(testModel.lockedValues.size).toBe(0);

      const options: Model.Options = {
        ...testOptions,
        lockedValues: ['maxValue', 'minValue', 'step'],
      };

      const model = new SliderModel(options);

      expect(model.lockedValues.has('maxValue')).toBeTruthy();
      expect(model.lockedValues.has('minValue')).toBeTruthy();
      expect(model.lockedValues.has('step')).toBeTruthy();
    });

    test('should create instance with default values if constructor get wrong options', () => {
      let newModel = new SliderModel({});

      expect(newModel).toBeInstanceOf(SliderModel);
      expect(newModel.maxValue).toBe(10);
      expect(newModel.minValue).toBe(0);
      expect(newModel.step).toBe(1);
      expect(newModel.secondValue).toBeUndefined();

      newModel = new SliderModel({
        maxValue: 0,
        step: 0,
      });

      expect(newModel).toBeInstanceOf(SliderModel);
      expect(newModel.maxValue).toBe(10);
      expect(newModel.minValue).toBe(0);
      expect(newModel.step).toBe(1);
      expect(newModel.secondValue).toBeUndefined();
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

      const options: Model.Options = {
        ...testOptions,
        lockedValues: ['maxValue', 'minValue', 'step'],
      };

      const model = new SliderModel(options);
      const modelState = model.getState();

      expect(modelState.lockedValues).toEqual(['maxValue', 'minValue', 'step']);
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

      testModel.updateState({
        maxValue: 10,
        minValue: 0,
        step: 4.5,
      });
      testModel.value = 10;
      expect(testModel.value).toEqual(10);
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

      testModel.updateState({ value: 2 });

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();

      testModel.updateState({ value: 9999 });
      expect(testModel.value).toBe(10);
      updateFunc.mockClear();
      testModel.updateState({ value: 9999 });
      testModel.updateState({ value: 100 });
      testModel.value = 9999;
      expect(testModel.value).toBe(10);
      expect(updateFunc).not.toBeCalled();
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
      expect(testModel.secondValue).not.toBeDefined();
      testModel.secondValue = 20;
      expect(testModel).toHaveProperty('_secondValue', 20);
      testModel.secondValue = null;
      expect(testModel).toHaveProperty('_secondValue', 20);
      testModel.secondValue = NaN;
      expect(testModel).toHaveProperty('_secondValue', 20);
    });

    test('can be undefined', () => {
      testModel.maxValue = 25;
      testModel.step = 1;
      testModel.secondValue = 20;
      expect(testModel).toHaveProperty('_secondValue', 20);
      testModel.value = 24;
      expect(testModel.value).toBe(20);
      testModel.secondValue = undefined;
      expect(testModel.secondValue).not.toBeDefined();
      testModel.value = 24;
      expect(testModel.value).toBe(24);
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

      modelWithSecondValue.updateState({ secondValue: 8 });

      expect(updateFunc).not.toBeCalled();
      expect(anotherUpdateFunc).not.toBeCalled();

      modelWithSecondValue.secondValue = 10;
      expect(modelWithSecondValue.secondValue).toBe(10);
      updateFunc.mockClear();
      modelWithSecondValue.secondValue = 10;
      expect(updateFunc).not.toBeCalled();
      modelWithSecondValue.secondValue = 100;
      modelWithSecondValue.updateState({ secondValue: 10000 });
      expect(updateFunc).not.toBeCalled();

      modelWithSecondValue.secondValue = 0;
      expect(modelWithSecondValue.secondValue).toBe(2);
      updateFunc.mockClear();
      modelWithSecondValue.secondValue = 2;
      modelWithSecondValue.updateState({ secondValue: 0 });
      modelWithSecondValue.updateState({ secondValue: -10 });
      expect(updateFunc).not.toBeCalled();
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
      testModel.updateState({ maxValue: 10 });

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

      testModel.updateState({
        minValue: 0,
        value: 4,
        secondValue: 4,
      });
      updateFunc.mockClear();
      anotherUpdateFunc.mockClear();
      testModel.minValue = 4;
      expect(updateFunc).toHaveBeenCalledTimes(1);
      expect(anotherUpdateFunc).toHaveBeenCalledTimes(1);
    });

    test('should not notify, if minValue has not changed', () => {
      expect(testModel.maxValue).toBe(10);
      expect(testModel.minValue).toBe(0);
      testModel.minValue = 0;
      testModel.minValue = 100;
      testModel.updateState({ minValue: 0 });

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
      testModel.updateState({ step: 2 });

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

    test('can be floating point number', () => {
      testModel.updateState({
        maxValue: 2,
        minValue: 0,
        value: 0.5,
        step: 0.1,
      });

      testModel.secondValue = 1.95;

      expect(testModel.getState().value).toBe(0.5);
      testModel.value = 0.56;
      expect(testModel.value).toBe(0.6);
      expect(testModel.secondValue).toBe(1.9);

      const newStep = 0.01 + 0.02;
      testModel.step = newStep;

      expect(testModel.value).toBe(0.6);
      expect(testModel.secondValue).toBe(1.89);
    });
  });

  describe('addObserver', () => {
    test('should added observer to this.observers', () => {
      expect(testModel).toHaveProperty('observers');

      const entries = Object.entries(testModel);
      entries.forEach((entry) => {
        if (entry[0] === 'observers') {
          const observers: Set<Model.Observer> = entry[1];
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
          const observers: Set<Model.Observer> = entry[1];
          expect(observers.has(observer)).toBeFalsy();
        }
      });
    });
  });

  describe('updateState', () => {
    test('should update instance properties', () => {
      const newModelState: Model.Options = {
        maxValue: 100,
        minValue: 50,
        step: 5,
        value: 0,
      };
      const newMaxValue: Model.Options = {
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

      testModel.updateState({
        maxValue: -10,
        minValue: -20,
        step: 2,
        value: -18,
        secondValue: -14,
      });

      expect(testModel.getState()).toEqual({
        maxValue: -10,
        minValue: -20,
        step: 2,
        value: -18,
        secondValue: -14,
        lockedValues: [],
      });
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

    test('should not notify, if state has not changed', () => {
      testModel.addObserver(observer);
      testModel.addObserver(anotherObserver);
      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 2,
        value: 2,
        lockedValues: [],
      });
      testModel.updateState({
        maxValue: 10,
        minValue: 0,
        step: 2,
        value: 2,
      });

      testModel.updateState({
        maxValue: -10,
        minValue: 0,
        step: 2,
        value: 2,
        lockedValues: [],
      });

      expect(updateFunc).not.toHaveBeenCalled();
      expect(anotherUpdateFunc).not.toHaveBeenCalled();
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

    test('should not lock values if argument is unknown', () => {
      testModel.lockState(['test']);

      expect(testModel.lockedValues.has('maxValue')).toBeFalsy();
      expect(testModel.lockedValues.has('minValue')).toBeFalsy();
      expect(testModel.lockedValues.has('value')).toBeFalsy();
      expect(testModel.lockedValues.has('step')).toBeFalsy();
      expect(testModel.lockedValues.has('secondValue')).toBeFalsy();
    });
  });

  describe('unlockState', () => {
    test('should removes selected values in lockValues', () => {
      testModel.lockState('all');
      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('maxValue')).toBeTruthy();
      expect(testModel.lockedValues.has('step')).toBeTruthy();

      testModel.unlockState(['maxValue', 'step', 'value']);

      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('maxValue')).toBeFalsy();
      expect(testModel.lockedValues.has('step')).toBeFalsy();
      expect(testModel.lockedValues.has('value')).toBeFalsy();

      testModel.unlockState(['minValue', 'secondValue']);

      expect(testModel.lockedValues.has('minValue')).toBeFalsy();
      expect(testModel.lockedValues.has('secondValue')).toBeFalsy();
    });

    test('should removes all values in lockValues, if lockState argument is "all"', () => {
      testModel.lockState('all');
      testModel.unlockState('all');

      expect(testModel.lockedValues.has('maxValue')).toBeFalsy();
      expect(testModel.lockedValues.has('minValue')).toBeFalsy();
      expect(testModel.lockedValues.has('value')).toBeFalsy();
      expect(testModel.lockedValues.has('step')).toBeFalsy();
      expect(testModel.lockedValues.has('secondValue')).toBeFalsy();
    });

    test('should not unlock values if argument is unknown', () => {
      testModel.unlockState(['test']);

      expect(testModel.lockedValues.has('maxValue')).toBeFalsy();
      expect(testModel.lockedValues.has('minValue')).toBeFalsy();
      expect(testModel.lockedValues.has('value')).toBeFalsy();
      expect(testModel.lockedValues.has('step')).toBeFalsy();
      expect(testModel.lockedValues.has('secondValue')).toBeFalsy();

      testModel.lockState('all');

      expect(testModel.lockedValues.has('maxValue')).toBeTruthy();
      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('value')).toBeTruthy();
      expect(testModel.lockedValues.has('step')).toBeTruthy();
      expect(testModel.lockedValues.has('secondValue')).toBeTruthy();

      testModel.unlockState(['test']);

      expect(testModel.lockedValues.has('maxValue')).toBeTruthy();
      expect(testModel.lockedValues.has('minValue')).toBeTruthy();
      expect(testModel.lockedValues.has('value')).toBeTruthy();
      expect(testModel.lockedValues.has('step')).toBeTruthy();
      expect(testModel.lockedValues.has('secondValue')).toBeTruthy();
    });
  });
});
