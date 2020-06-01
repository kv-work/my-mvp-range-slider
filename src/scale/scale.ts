/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';

class SliderScale implements Scale {
  private $container: JQuery;
  private $scale: JQuery;
  private options: Scale.RenderOptions;
  private observer: Scale.Observer;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$container = options.$viewContainer;
    this.observer = options.observer;
    this.isRendered = false;

    this.options = $.extend({
      scaleStep: 1,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
    }, options.renderOptions);

    this.createScale();
  }

  public render(data: App.Stringable[]): void {
    if (this.isRendered) {
      this.$scale.empty();
      this.isRendered = false;
    }
    data.forEach((elem: App.Stringable) => {
      const content = elem.toString();
      const $elem = SliderScale.createScaleElement(content);
      this.$scale.append($elem);
    });

    this.isRendered = true;
    this.$container.append(this.$scale);
  }

  public destroy(): void {}

  private createScale(): void {
    const $scaleContainer = $('<div>', {
      class: 'slider__scale scale',
    });

    this.$scale = $scaleContainer;
  }

  static createScaleElement(content: string): JQuery {
    const $elem = $('<span>', { class: 'scale__element' });
    $elem.html(content);
    return $elem;
  }
}

export default SliderScale;
