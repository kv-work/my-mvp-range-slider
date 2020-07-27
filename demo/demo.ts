import './demo.css';

class Demo {
  private $container: JQuery;
  private slider: App;
  private $configPanel: JQuery;
  private settings: App.Option;
  // model config
  private $maxValInput: JQuery;
  private $minValInput: JQuery;
  private $stepInput: JQuery;
  private $valInput: JQuery;
  private $secondValInput: JQuery;
  // presenter config
  private $lockMaxValCheck: JQuery;
  private $lockMinValCheck: JQuery;
  private $lockStepCheck: JQuery;
  private $lockValCheck: JQuery;
  private $lockSecondValCheck: JQuery;
  private $lockAllCheck: JQuery;
  // view config
  private $orientationRadio: JQuery;
  private $rangeCheck: JQuery;
  private $dragIntervalCheck: JQuery;
  private $barCheck: JQuery;
  private $runnerCheck: JQuery;
  private $scaleCheck: JQuery;
  private $displayValCheck: JQuery;
  private $displayScaleValCheck: JQuery;
  private $numScaleValRange: JQuery;
  private $displayMaxValCheck: JQuery;
  private $displayMinValCheck: JQuery;
  private $prefixInput: JQuery;
  private $postfixInput: JQuery;

  constructor($container: JQuery, options?: App.Option) {
    this.$container = $container;

    if (options) {
      this.slider = this.$container.find('.js-slider').myMVPSlider(options).data('myMVPSlider');
    } else {
      this.slider = this.$container.find('.js-slider').myMVPSlider().data('myMVPSlider');
    }

    this.settings = this.$container.find('.js-slider').data('init-options');

    this.$configPanel = this.$container.find('.js-congig_panel');
    this.$maxValInput = this.$configPanel.find('.input_max_val');

    this.setConfig(this.settings);
  }

  private setConfig(settings: App.Option): void {
    const { $maxValInput } = this;

    $maxValInput.val(settings.maxValue);
  }

  private attachEventHandlers(): void {
    const { $configPanel, slider } = this;
  }
}

$('.js-demo_slider').each(function setDemo(): void {
  const demo = new Demo($(this));
});
