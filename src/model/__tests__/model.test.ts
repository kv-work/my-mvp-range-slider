import { OptionsModel } from '../model';
import Model from '../model';

describe('model', () => {
  const testOptions: OptionsModel = {
    maxCount: 10,
    minCount: 0,
    startCount: 3,
    step: 2
  };
  let testModel: Model;

  beforeEach( () => {
    testModel = new Model(testOptions);
  } )

  test('create instanse of Model without options', () => {
    const optionlessModel: Model = new Model();

    expect(optionlessModel).toBeInstanceOf(Model);
    expect(optionlessModel.count).toBe(0);
    expect(optionlessModel).toHaveProperty('maxCount', 10);
    expect(optionlessModel).toHaveProperty('minCount', 0);
    expect(optionlessModel).toHaveProperty('step', 1);
  })


  test('incCount should adds step to the count', () => {
    testModel.incCount();
    expect(testModel.count).toBe(5);

    testModel.incCount();
    testModel.incCount();
    expect(testModel.count).toBe(9);
  })

  test('If, when calling the incCount func, the count is greater than the maxCount, then the count should be equel maxCount', () => {
    for (let i = 0; i < 5; i++) {
      testModel.incCount();
    }

    expect(testModel.count).toBe(10)

    testModel.incCount();
    expect(testModel.count).toBe(10)
  })

  test('decCount should subtract step from the count', () => {
    testModel.decCount();
    expect(testModel.count).toBe(1);
  })

  test('If, when calling the decCount func, the count is less than the minCount, then the count should be equel minCount', () => {
    testModel.decCount();
    testModel.decCount();
    expect(testModel.count).toBe(0);

    testModel.decCount();
    expect(testModel.count).toBe(0);
  })

  test('setCount should set the count', () => {
    testModel.setCount(7);
    expect(testModel.count).toBe(7);

    testModel.setCount(2);
    expect(testModel.count).toBe(2);
  })

  test('if the argument of the setCount func is greater than the maxCount, then the function call returns an error', () => {
    expect( () => {
      testModel.setCount(15)
    } ).toThrowError(/^Value greater then maximum value of slider$/);
  })

  test('if the argument of the setCount func is less than the minCount, then the function call returns an error', () => {
    expect( () => {
      testModel.setCount(-15)
    } ).toThrowError(/^Value less then minimum value of slider$/);
  })
})