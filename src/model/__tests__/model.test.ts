import SliderModel from '../model';

describe('model', () => {
  const initOptions: Model.InitOptions = {
    maxValue: 10,
    minValue: 0,
    step: 1,
    value: 3,
    lockedValues: [],
  };

  const optionsWithSecondValue: Model.InitOptions = {
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
    testModel.lockedValues.clear();
  });

  describe('constructor', () => {
    test('should set instance properties', () => {
      expect(testModel).toBeInstanceOf(SliderModel);
      // expect(testModel.maxValue).toBe(10);
      // expect(testModel.minValue).toBe(0);
      // expect(testModel.step).toBe(2);
      // expect(testModel.secondValue).toBeUndefined();

      // With second value
      expect(modelWithSecondValue).toBeInstanceOf(SliderModel);
      // expect(modelWithSecondValue.secondValue).toBe(8);
    });

    test('should create lockedValues', () => {
      expect(testModel).toHaveProperty('lockedValues');
      expect(testModel.lockedValues.size).toBe(0);

      const options: Model.InitOptions = {
        ...initOptions,
        lockedValues: ['maxValue', 'minValue', 'step'],
      };

      const model = new SliderModel(options);

      expect(model.lockedValues.has('maxValue')).toBeTruthy();
      expect(model.lockedValues.has('minValue')).toBeTruthy();
      expect(model.lockedValues.has('step')).toBeTruthy();
    });

    test('should create instance with default values if constructor get wrong options', () => {
      // let newModel = new SliderModel({});

      // expect(newModel).toBeInstanceOf(SliderModel);
      // expect(newModel.maxValue).toBe(10);
      // expect(newModel.minValue).toBe(0);
      // expect(newModel.step).toBe(1);
      // expect(newModel.secondValue).toBeUndefined();

      // newModel = new SliderModel({
      //   maxValue: 0,
      //   step: 0,
      // });

      // expect(newModel).toBeInstanceOf(SliderModel);
      // expect(newModel.maxValue).toBe(10);
      // expect(newModel.minValue).toBe(0);
      // expect(newModel.step).toBe(1);
      // expect(newModel.secondValue).toBeUndefined();
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

      const options: Model.InitOptions = {
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
      const newMaxValue: Model.Options = {
        maxValue: 200,
      };

      testModel.updateState(newModelState);
      expect(testModel).toHaveProperty('maxValue', 100);
      expect(testModel).toHaveProperty('minValue', 50);
      expect(testModel).toHaveProperty('step', 5);
      // value should be equal minValue
      expect(testModel).toHaveProperty('value', 50);

      testModel.updateState(newMaxValue);
      expect(testModel).toHaveProperty('maxValue', 200);

      testModel.updateState({ value: 199 });
      expect(testModel).toHaveProperty('value', 200);

      testModel.updateState({ minValue: 0 });
      expect(testModel).toHaveProperty('minValue', 0);

      // set wrong step
      testModel.updateState({ step: 0, value: -5, minValue: -10 });
      expect(testModel).toHaveProperty('value', -5);
      expect(testModel).toHaveProperty('step', 5);
      expect(testModel).toHaveProperty('minValue', -10);

      // add second value

      expect(testModel).toHaveProperty('secondValue', undefined);
      testModel.updateState({
        secondValue: 50,
      });
      expect(testModel).toHaveProperty('secondValue', 50);

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
