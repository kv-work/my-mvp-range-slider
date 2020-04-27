import ViewBar from '../view-bar';

const $ = require('jquery');

describe('ViewBar', () => {

  document.body.innerHTML = `<div id="container"></div>`;
  const testNode = document.getElementById('container');
  let testBar: ViewBar;

  beforeEach( () => {
    testBar = new ViewBar(testNode);
  } )

  test('constructor should return object', () => {
    expect(testNode).not.toBeUndefined()
    
    const entries: Array<any> = Object.entries(testBar);

    entries.forEach( (entry: [String, any]) => {
      if (entry[0] === '$container') {
        expect($(testNode)).toEqual(entry[1])
      }
    } )
  })
})