/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';
import './scale.css';

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
      isHorizontal: true,
      scaleStep: 1,
      displayScaleValue: true,
      displayMin: true,
      displayMax: true,
    }, options.renderOptions);

    this.createScale();
  }

  public render(renderData: View.RenderData, options?: Scale.RenderOptions): void {
    if (this.isRendered) {
      this.$scale.empty();
      this.isRendered = false;
    }
    const { data, percentageData } = renderData;
    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const percentage = percentageData[idx];
      const $elem = this.createScaleElement(content, percentage);
      this.$scale.append($elem);
    });

    this.isRendered = true;
    this.$container.append(this.$scale);
  }

  public destroy(): void {}

  private createScale(): void {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale slider__scale scale',
    });

    this.$scale = $scaleContainer;
  }

  private createScaleElement(content: string, percentage: number): JQuery {
    const $elem = $('<span>', { class: 'scale__element' });
    $elem.html(content);
    if (this.options.isHorizontal) {
      $elem.css('left', percentage);
    } else {
      $elem.css('top', percentage);
    }
    return $elem;
  }
}

export default SliderScale;
