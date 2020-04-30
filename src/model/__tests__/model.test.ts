import { OptionsModel, Observer } from '../model';
import Model from '../model';

describe('model', () => {
  const testOptions: OptionsModel = {
    maxCount: 10,
    minCount: 0,
    startCount: 3,
    step: 2
  };

  let testModel: Model,
      observer: Observer,
      anotherObserver: Observer;

  let updateFunc: jest.Mock,
      anotherUpdateFunc: jest.Mock;

  beforeEach( () => {
    testModel = new Model(testOptions);
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

    //incCount()
    testModel.incCount()
    expect(updateFunc).toHaveBeenCalledTimes(1);
    testModel.incCount()
    testModel.incCount()
    expect(updateFunc).toHaveBeenCalledTimes(3);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(3);

    //decCount()
    testModel.decCount()
    expect(updateFunc).toHaveBeenCalledTimes(4);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(4);

    //setCount()
    testModel.setCount(8)
    expect(updateFunc).toHaveBeenCalledTimes(5);
    expect(anotherUpdateFunc).toHaveBeenCalledTimes(5);
  })

  test('if the count does NOT CHANGES, the model should not notify observers', () => {
    testModel.addObserver(observer);
    const currCount = testModel.count;

    //setCount()
    testModel.setCount(currCount);
    expect(updateFunc).not.toHaveBeenCalled()
  })
})