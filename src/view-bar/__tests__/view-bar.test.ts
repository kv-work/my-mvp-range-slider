import ViewBar from '../view-bar';
import { Observer } from '../view-bar';


const $ = require('jquery');

describe('ViewBar', () => {

  document.body.innerHTML = `<div id="container"></div>`;

  const testNode = document.getElementById('container');

  let testBar: ViewBar,
      observer: Observer,
      anotherObserver: Observer,
      entries: Array<any>,
      keys: Set<string>,
      elOffsetWidth: number,
      elOffsetLeft: number,
      sliderVal: number;

  let updateFunc: jest.Mock,
        anotherUpdateFunc: jest.Mock;

  beforeEach( () => {
    testBar = new ViewBar(testNode);
    sliderVal = 42;
    updateFunc = jest.fn( x => x + 1);
    anotherUpdateFunc = jest.fn( x => x + 2);
    observer = {
      update: updateFunc
    };
    
    anotherObserver = {
      update: anotherUpdateFunc
    };

    elOffsetWidth = 200;
    elOffsetLeft = 10;

    Object.defineProperties(HTMLElement.prototype, {
      'offsetLeft': { 'value': elOffsetLeft, 'configurable': true },
      'offsetWidth': { 'value': elOffsetWidth, 'configurable': true }
    })

    entries = Object.entries(testBar);
    keys = new Set(Object.keys(testBar));
  } )

  test('constructor should return object with some props', () => {
    expect(testNode).not.toBeUndefined()

    entries.forEach( (entry: [String, any]) => {
      if (entry[0] === '$container') {
        expect($(testNode)).toEqual(entry[1])
      }
    } )

    expect(keys.has('$container')).toBeTruthy();
    expect(keys.has('$bar')).toBeTruthy();
    expect(keys.has('observers')).toBeTruthy();
  })

  test('render should append div.slider__bar to container only once', () => {
    testBar.render(sliderVal);
    expect(() => testBar.render(sliderVal)).toThrowError(/^View is already rendered!$/);
    expect($('.slider__bar').length).toBe(1)
  })

  test('addObserver should added observer to this.observers', () => {
    expect(testBar).toHaveProperty('observers');
    testBar.addObserver(observer);

    entries = Object.entries(testBar)
    entries.forEach( (entry: [String, any]) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy()
      }
    });
  })

  test('removeObserver should removed observer', () => {
    expect(testBar).toHaveProperty('observers');
    entries = Object.entries(testBar)

    //Add observer
    testBar.addObserver(observer);
    entries.forEach( (entry: [String, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeTruthy()
      }
    });

    //Remove observer
    testBar.removeObserver(observer);
    entries.forEach( (entry: [String, any], index: number) => {
      if (entry[0] === 'observers') {
        expect(entry[1].has(observer)).toBeFalsy()
      }
    });
  })

  test('attachEventListeners added eventListener to bar, which calls notify func', () => {
    testBar.render(sliderVal);
    testBar.addObserver(observer);
    testBar.addObserver(anotherObserver);

    const eventClientX: number = 70;

    const clickEvent = $.Event('click', {
      clientX: eventClientX
    });

    $('.slider__bar').trigger(clickEvent);

    const expectedResult: number = Math.floor( (70 - 10) / 200 * 100 );
    
    expect(updateFunc).toHaveBeenCalled();
    expect(updateFunc.mock.calls[0][0]).toBe(expectedResult);
    expect(anotherUpdateFunc).toHaveBeenCalled();
    expect(anotherUpdateFunc.mock.calls[0][0]).toBe(expectedResult);
  })
})