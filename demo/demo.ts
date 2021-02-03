import './demo.css';
import Panel from './Panel/panel';

$('.js-slider').each(function addPlugin(): void {
  const $elem = $(this);

  if ($elem.hasClass('slider_default')) {
    $elem.myMVPSlider();
  } else {
    const opts: App.Option = {
      maxValue: Number((Math.random() * 100000).toFixed()),
      minValue: Number((Math.random() * 100000).toFixed()) * (-1),
      step: Number((Math.random() * 100).toFixed(2)),
      value: Math.random() * 100000 - 123,
      isHorizontal: true,
      scale: true,
      numOfScaleVal: Number((Math.random() * 10).toFixed()),
    };

    $elem.myMVPSlider(opts);
  }
});

$('.js-demo-slider').each(function setDemo(): void {
  const demo = new Panel($(this));
});
