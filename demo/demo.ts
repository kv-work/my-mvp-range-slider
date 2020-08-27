import './demo.css';
import Panel from './panel/panel';

$('.js-slider').each(function addPlugin(): void {
  const $elem = $(this);

  if ($elem.hasClass('slider_default')) {
    $elem.myMVPSlider();
  } else {
    const opts: App.Option = {
      maxValue: +(Math.random() * 100000).toFixed(),
      minValue: -1 * (+(Math.random() * 100000).toFixed()),
      step: +(Math.random() * 100).toFixed(2),
      value: Math.random() * 100000 - 123,
      isHorizontal: true,
      scale: true,
      numOfScaleVal: +(Math.random() * 10).toFixed(),
    };

    $elem.myMVPSlider(opts);
  }
});

$('.js-demo_slider').each(function setDemo(): void {
  const demo = new Panel($(this));
});
