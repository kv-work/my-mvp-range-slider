import SliderModel from '../model';

describe.only('model', () => {
  const initOptions: Model.Options = {
    maxValue: 10,
    minValue: 0,
    step: 1,
    value: 3,
    lockedValues: [],
  };

  const optionsWithSecondValue: Model.Options = {
    secondValue: 8,
    ...initOptions,
  };

  let testModel: SliderModel;
  let modelWithSecondValue: SliderModel;
  let observer: Model.Observer;
  let anotherObserver: Model.Observer;

  let updateFunc: jest.Mock;
  let anotherUpdateFunc: jest.Mock;

  beforeEach(() => {
    testModel = new SliderModel(initOptions);
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
  });

  describe('constructor', () => {
    test('should set instance properties', () => {
      expect(testModel).toBeInstanceOf(SliderModel);
      expect(testModel).toHaveProperty('state');
      expect(testModel).toHaveProperty('observers');
      expect(testModel).toHaveProperty('lockedValues');
      expect(testModel).toHaveProperty('isUpdated', true);
    });

    test('should create lockedValues', () => {
      expect(testModel).toHaveProperty('lockedValues');

      const options: Model.Options = {
        ...initOptions,
        lockedValues: ['maxValue', 'minValue', 'step'],
      };

      const model = new SliderModel(options);
      const { lockedValues } = model.getState();

      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeTruthy();
    });

    test.only('should create instance with default values if constructor get wrong options', () => {
      let newModel = new SliderModel();

      expect(newModel).toBeInstanceOf(SliderModel);

      let state = newModel.getState();
      expect(state).toHaveProperty('maxValue', 10);
      expect(state).toHaveProperty('minValue', 0);
      expect(state).toHaveProperty('step', 1);
      expect(state).toHaveProperty('value', 0);
      expect(state).toHaveProperty('secondValue', null);

      newModel = new SliderModel({
        maxValue: -10,
        step: 0,
      });

      state = newModel.getState();

      expect(newModel).toBeInstanceOf(SliderModel);
      expect(state).toHaveProperty('maxValue', 10);
      expect(state).toHaveProperty('minValue', 0);
      expect(state).toHaveProperty('step', 1);
      expect(state).toHaveProperty('value', 0);

      newModel = new SliderModel({
        maxValue: -10,
        minValue: 5,
        step: 2,
        secondValue: -30,
        lockedValues: ['foo'],
      });

      expect(newModel).toHaveProperty('state', {
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 0,
        secondValue: null,
        lockedValues: [],
      });
    });
  });

  describe('getState', () => {
    test('should returns model state object', () => {
      expect(testModel.getState()).toBeInstanceOf(Object);

      const state = testModel.getState();
      expect(state).toHaveProperty('maxValue', 10);
      expect(state).toHaveProperty('minValue', 0);
      expect(state).toHaveProperty('step', 1);
      expect(state.secondValue).toBeNull();

      // With second value
      const stateWithSecondValue = modelWithSecondValue.getState();
      expect(stateWithSecondValue).toHaveProperty('secondValue', 8);

      const options: Model.Options = {
        ...initOptions,
        lockedValues: ['maxValue', 'minValue', 'step'],
      };

      const model = new SliderModel(options);
      const modelState = model.getState();

      expect(modelState.lockedValues).toEqual(['maxValue', 'minValue', 'step']);
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

      testModel.updateState(newModelState);
      const newState = testModel.getState();
      expect(newState).toHaveProperty('maxValue', 100);
      expect(newState).toHaveProperty('minValue', 50);
      expect(newState).toHaveProperty('step', 5);
      // value should be equal minValue
      expect(newState).toHaveProperty('value', 50);

      const newMaxValue: Model.Options = { maxValue: 200 };
      testModel.updateState(newMaxValue);
      expect(testModel.getState()).toHaveProperty('maxValue', 200);

      testModel.updateState({ value: 199 });
      expect(testModel.getState()).toHaveProperty('value', 200);

      testModel.updateState({ minValue: 0 });
      expect(testModel.getState()).toHaveProperty('minValue', 0);

      // add second value
      expect(testModel.getState()).toHaveProperty('secondValue', null);
      testModel.updateState({
        value: 25,
        secondValue: 50,
      });
      expect(testModel.getState()).toHaveProperty('value', 25);
      expect(testModel.getState()).toHaveProperty('secondValue', 50);

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

      // remove secondValue
      testModel.updateState({ secondValue: null });

      expect(testModel.getState()).toEqual({
        maxValue: -10,
        minValue: -20,
        step: 2,
        value: -18,
        secondValue: null,
        lockedValues: [],
      });
    });

    test('should not update locked values', () => {
      testModel.lockState('all');

      testModel.updateState({
        maxValue: 100,
        minValue: -100,
        step: 10,
        value: 50,
        secondValue: 70,
      });

      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        secondValue: null,
        lockedValues: ['maxValue', 'minValue', 'step', 'value', 'secondValue'],
      });
    });

    test('should set value and second value to multiple of the step, even if value or second value is locked', () => {
      testModel.updateState({ step: 1.5, value: 4 });
      expect(testModel.getState().value).toBe(4.5);

      testModel.updateState({ step: 5 });
      expect(testModel.getState().value).toBe(5);

      const newStep = 0.01 + 0.02;
      testModel.updateState({ step: newStep, value: 0.05 });
      expect(testModel.getState().value).toBe(0.06);

      // with second value
      testModel.updateState({ secondValue: 5.2 });
      expect(testModel.getState().secondValue).toBe(5.19);

      modelWithSecondValue.lockState(['value', 'secondValue']);
      modelWithSecondValue.updateState({ secondValue: 7, value: 4 });
      expect(modelWithSecondValue.getState().secondValue).toBe(8);
      expect(modelWithSecondValue.getState().value).toBe(3);
      modelWithSecondValue.updateState({ step: 5 });
      expect(modelWithSecondValue.getState().secondValue).toBe(10);
      expect(modelWithSecondValue.getState().value).toBe(5);

      const newModel = new SliderModel({
        maxValue: 1,
        step: 0.00000001,
        secondValue: 0.000025,
        value: 0.00000277775668,
      });

      expect(newModel.getState()).toEqual({
        maxValue: 1,
        minValue: 0,
        step: 0.00000001,
        secondValue: 0.000025,
        value: 0.00000278,
        lockedValues: [],
      });
    });

    test('should not set value more then maxValue or second value if it defined', () => {
      testModel.updateState({ value: 1000 });
      expect(testModel.getState().value).toBe(10);

      testModel.updateState({
        step: 6,
        value: 9,
      });
      expect(testModel.getState().value).toBe(10);

      testModel.updateState({
        step: 11,
        value: 9,
      });
      expect(testModel.getState().value).toBe(10);

      // with secondValue
      expect(modelWithSecondValue.getState().secondValue).toBe(8);
      modelWithSecondValue.updateState({ value: 9 });
      expect(modelWithSecondValue.getState().secondValue).toBe(8);
      expect(modelWithSecondValue.getState().value).toBe(8);
    });

    test('should not set secondValue more then maxValue', () => {
      modelWithSecondValue.updateState({ secondValue: 1000 });
      expect(modelWithSecondValue.getState().secondValue).toBe(10);
    });

    test('should not set value less then minValue', () => {
      testModel.updateState({ value: -10 });
      expect(testModel.getState().value).toBe(0);

      // with secondValue
      modelWithSecondValue.updateState({ value: -10 });
      expect(modelWithSecondValue.getState().value).toBe(0);
      modelWithSecondValue.updateState({ secondValue: -10 });
      expect(modelWithSecondValue.getState().secondValue).toBe(0);
    });

    test('should not set secondValue less then value', () => {
      expect(modelWithSecondValue.getState().value).toBe(3);
      modelWithSecondValue.updateState({ secondValue: 1 });
      expect(modelWithSecondValue.getState().secondValue).toBe(3);
    });

    test('should change the values ​​of the first and second if the first is greater than the second', () => {
      const newModel = new SliderModel({
        maxValue: 100,
        step: 5,
        value: 75,
        secondValue: 25,
      });

      expect(newModel.getState()).toEqual({
        maxValue: 100,
        minValue: 0,
        step: 5,
        value: 25,
        secondValue: 75,
        lockedValues: [],
      });

      newModel.updateState({ value: 95, secondValue: 5 });
      expect(newModel.getState().value).toBe(5);
      expect(newModel.getState().secondValue).toBe(95);
    });

    test('should lock values ​​if the argument object has a lockedValues property', () => {
      testModel.updateState({ lockedValues: ['maxValue', 'value'] });

      const { lockedValues, value, maxValue } = testModel.getState();

      expect(lockedValues.includes('value')).toBeTruthy();
      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(value).toBe(3);
      expect(maxValue).toBe(10);

      testModel.updateState({ maxValue: 20, value: 5 });
      expect(testModel.getState().value).toBe(3);
      expect(testModel.getState().maxValue).toBe(10);
    });

    test('should unlock values ​​if the argument object has a unlockValues property', () => {
      testModel.updateState({ lockedValues: ['maxValue', 'value'] });

      const { lockedValues, value, maxValue } = testModel.getState();

      expect(lockedValues.includes('value')).toBeTruthy();
      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(value).toBe(3);
      expect(maxValue).toBe(10);

      testModel.updateState({ maxValue: 20, value: 5, unlockValues: 'all' });
      expect(testModel.getState().value).toBe(5);
      expect(testModel.getState().maxValue).toBe(20);
      expect(testModel.getState().lockedValues).toEqual([]);
    });

    test('should not update state if new maxValue <= new minValue', () => {
      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      testModel.updateState({
        maxValue: 0,
        minValue: 10,
      });

      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });
    });

    test('should not update state if new step <= 0', () => {
      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      testModel.updateState({ step: 0 });

      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });
    });

    test('should not update state if new value or secondValue is not valid', () => {
      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      testModel.updateState({ value: Infinity });

      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      modelWithSecondValue.updateState({ secondValue: Infinity });
      expect(modelWithSecondValue.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        secondValue: 8,
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
      expect(testModel.getState()).toEqual({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      testModel.updateState({
        maxValue: 10,
        minValue: 0,
        step: 1,
        value: 3,
      });

      testModel.updateState({
        maxValue: -10,
        minValue: 0,
        step: 1,
        value: 3,
        lockedValues: [],
      });

      expect(updateFunc).not.toHaveBeenCalled();
      expect(anotherUpdateFunc).not.toHaveBeenCalled();
    });
  });

  describe('lockState', () => {
    test('should adds selected values into lockValues', () => {
      testModel.lockState(['minValue', 'maxValue']);

      const { lockedValues } = testModel.getState();

      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeFalsy();
    });

    test('should adds all values into lockValues, if lockState argument is "all"', () => {
      testModel.lockState('all');

      const { lockedValues } = testModel.getState();

      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('value')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeTruthy();
      expect(lockedValues.includes('secondValue')).toBeTruthy();
    });

    test('should not lock values if argument is unknown', () => {
      testModel.lockState(['test']);

      const { lockedValues } = testModel.getState();

      expect(lockedValues.includes('maxValue')).toBeFalsy();
      expect(lockedValues.includes('minValue')).toBeFalsy();
      expect(lockedValues.includes('value')).toBeFalsy();
      expect(lockedValues.includes('step')).toBeFalsy();
      expect(lockedValues.includes('secondValue')).toBeFalsy();
    });
  });

  describe('unlockState', () => {
    test('should removes selected values in lockValues', () => {
      testModel.lockState('all');

      let { lockedValues } = testModel.getState();

      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeTruthy();

      testModel.unlockState(['maxValue', 'step', 'value']);

      lockedValues = testModel.getState().lockedValues;

      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('maxValue')).toBeFalsy();
      expect(lockedValues.includes('step')).toBeFalsy();
      expect(lockedValues.includes('value')).toBeFalsy();

      testModel.unlockState(['minValue', 'secondValue']);

      lockedValues = testModel.getState().lockedValues;

      expect(lockedValues.includes('minValue')).toBeFalsy();
      expect(lockedValues.includes('secondValue')).toBeFalsy();
    });

    test('should removes all values in lockValues, if lockState argument is "all"', () => {
      testModel.lockState('all');
      testModel.unlockState('all');

      const { lockedValues } = testModel.getState();

      expect(lockedValues.includes('maxValue')).toBeFalsy();
      expect(lockedValues.includes('minValue')).toBeFalsy();
      expect(lockedValues.includes('value')).toBeFalsy();
      expect(lockedValues.includes('step')).toBeFalsy();
      expect(lockedValues.includes('secondValue')).toBeFalsy();
    });

    test('should not unlock values if argument is unknown', () => {
      testModel.unlockState(['test']);

      let { lockedValues } = testModel.getState();

      expect(lockedValues.includes('maxValue')).toBeFalsy();
      expect(lockedValues.includes('minValue')).toBeFalsy();
      expect(lockedValues.includes('value')).toBeFalsy();
      expect(lockedValues.includes('step')).toBeFalsy();
      expect(lockedValues.includes('secondValue')).toBeFalsy();

      testModel.lockState('all');

      lockedValues = testModel.getState().lockedValues;

      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('value')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeTruthy();
      expect(lockedValues.includes('secondValue')).toBeTruthy();

      testModel.unlockState(['test']);

      expect(lockedValues.includes('maxValue')).toBeTruthy();
      expect(lockedValues.includes('minValue')).toBeTruthy();
      expect(lockedValues.includes('value')).toBeTruthy();
      expect(lockedValues.includes('step')).toBeTruthy();
      expect(lockedValues.includes('secondValue')).toBeTruthy();
    });
  });
});
