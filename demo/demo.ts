import './demo.css';

$('.js-slider').myMVPSlider();


class Demo {
  private $container: JQuery;
  private slider: App;
  private $configPanel: JQuery;

  constructor($container: JQuery, options?: App.Option) {
    this.$container = $container;

    if (options) {
      this.slider = this.$container.find('.js-slider').myMVPSlider(options).data('myMVPSlider');
    } else {
      this.slider = this.$container.find('.js-slider').myMVPSlider().data('myMVPSlider');
    }

    this.$configPanel = this.$container.find('.js-congig_panel');
  }

  private attachEventHandlers() {
    
  }
}
