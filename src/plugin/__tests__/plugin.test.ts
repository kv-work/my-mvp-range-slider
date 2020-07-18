import '../plugin';
import SliderApp from '../../app/app';

describe.skip('myMVPSlider', () => {
  document.body.innerHTML = `
    <div class="js-container"></div>
    <div class="js-container"></div>
  `;

  const testNodes = document.getElementsByClassName('js-container');

  beforeEach(() => {
    $(testNodes[0]).myMVPSlider();
  });

  test('should render slider with default options', () => {
    expect($('.js-slider__bar').length).toBe(1);
    expect($('.js-slider__runner').length).toBe(1);
  });

  test('should support call chains', () => {
    expect($(testNodes[1]).myMVPSlider().css({
      position: 'absolute',
      top: '50px',
    })).toBeInstanceOf($);
  });
  test('should save instance of Slider in data attr "myMVPSlider"', () => {
    const slider = $(testNodes[0]).data('myMVPSlider');
    expect(slider).toBeInstanceOf(SliderApp);
  });
  // test('should have some methods');
  // test('should save data in data attributes');
});
