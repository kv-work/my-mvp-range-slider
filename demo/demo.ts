import './demo.css';
import Panel from './panel/panel';

$('.js-slider').myMVPSlider();

$('.js-demo_slider').each(function setDemo(): void {
  const demo = new Panel($(this));
});
