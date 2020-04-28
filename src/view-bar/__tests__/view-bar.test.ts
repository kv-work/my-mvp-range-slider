import ViewBar from '../view-bar';
import { Observer } from '../view-bar';


const $ = require('jquery');

describe('ViewBar', () => {

  document.body.innerHTML = `<div id="container"></div>`;
  const testNode = document.getElementById('container');
  let testBar: ViewBar,
      observer: Observer,
      anotherObserver: Observer,
      entries: Array<any>;

  const updateFunc = jest.fn( x => x + 1),
        anotherUpdateFunc = jest.fn( x => x + 2);

  beforeEach( () => {
    testBar = new ViewBar(testNode);
    observer = {
      update: updateFunc
    };
    
    anotherObserver = {
      update: anotherUpdateFunc
    };

    entries = Object.entries(testBar);
  } )

  test('constructor should return object', () => {
    expect(testNode).not.toBeUndefined()

    entries.forEach( (entry: [String, any]) => {
      if (entry[0] === '$container') {
        expect($(testNode)).toEqual(entry[1])
      }
    } )
  })

  test('constructor should append div.slider__bar to container', () => {
    expect($('.slider__bar').length).not.toBe(0)
  })

  test('addObserver should added observer to this.observers', () => {
    expect(testBar).toHaveProperty('observers');
    testBar.addObserver(observer);

    entries = Object.entries(testBar)
    entries.forEach( (entry: [String, any], index: number) => {
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
    testBar.addObserver(observer);
    testBar.addObserver(anotherObserver);

    $('.slider__bar').click();
    
    expect(updateFunc).toHaveBeenCalled()
    expect(anotherUpdateFunc).toHaveBeenCalled()
  })
})