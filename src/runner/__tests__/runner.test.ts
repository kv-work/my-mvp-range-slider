import $ from 'jquery';
import SliderRunner from '../runner';

describe('SliderRunner', () => {
  document.body.innerHTML = `
    <div id="view_container_horizontal"></div>
    <div id="view_container"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');

  const horizontalOptions: Runner.RenderOptions = {
    isHorizontal: true,
    displayValue: true,
    prefix: '+',
    postfix: '$',
  };
  const verticalOptions: Runner.RenderOptions = {
    ...horizontalOptions,
    isHorizontal: false,
  };

  const testOptions: Runner.InitOptions = {
    $viewContainer: $horizontalView,
    renderOptions: horizontalOptions,
  };
  const testOptionsVertical: Runner.InitOptions = {
    $viewContainer: $verticalView,
    renderOptions: verticalOptions,
  };

  let testRunner: SliderRunner;
  let vertRunner: SliderRunner;

  beforeEach(() => {
    testRunner = new SliderRunner(testOptions);
    vertRunner = new SliderRunner(testOptionsVertical);
  });
});
