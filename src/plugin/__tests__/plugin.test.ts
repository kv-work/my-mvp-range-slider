import $ from 'jquery';
import '../plugin';

describe('myMVPSlider', () => {
  document.body.innerHTML = '<div class="js-container"></div>';

  const testNode = document.getElementsByClassName('js-container')[0];

  beforeEach(() => {
    $(testNode).myMVPSlider();
  });

  test('should render slider with default options', () => {
    expect($('.js-slider__bar').length).toBe(1);
    expect($('.js-slider__runner').length).toBe(1);
  });

  test('should support call chains');
  test('should define a namespace for working with the plugin');
  test('should have some methods');
  test('should save data in data attributes');
});
