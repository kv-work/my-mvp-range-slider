/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';

class SliderScale implements Scale {
  private $container: JQuery;
  private $scale: JQuery;
  private options: Scale.RenderOptions;
  private observer: Scale.Observer;

  constructor(options: Scale.Options) {
    this.$container = options.$viewContainer;
    this.observer = options.observer;

    this.options = $.extend({
      scaleStep: 1,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
    }, options.renderOptions);

    this.createScale();
  }

  public render(data: App.Stringable[]): void {}

  public destroy(): void {}

  private createScale(): void {
    const $scaleContainer = $('<div>', {
      class: 'slider__scale',
    });

    this.$scale = $scaleContainer;
  }
}

export default SliderScale;
