/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';
import './scale.css';

class SliderScale implements Scale {
  private $container: JQuery;
  private $scale: JQuery;
  private observer: Scale.Observer;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$container = options.$viewContainer;
    this.observer = options.observer;
    this.isRendered = false;

    this.createScale();
  }

  public render(renderData: View.RenderData, options: Scale.RenderOptions): void {
    if (this.isRendered) {
      this.$scale.empty();
      this.isRendered = false;
    }
    const { data, percentageData } = renderData;
    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const percentage = percentageData[idx];
      const $elem = this.createElement(content, percentage, options);
      this.$scale.append($elem);
    });

    if (options.isHorizontal && !this.$scale.hasClass('slider__scale_horizontal')) {
      this.$scale.removeClass('slider__scale');
      this.$scale.addClass('slider__scale_horizontal');
    }

    if (!options.isHorizontal && !this.$scale.hasClass('slider__scale')) {
      this.$scale.removeClass('slider__scale_horizontal');
      this.$scale.addClass('slider__scale');
    }

    this.attachEventHandlers();
    this.$container.append(this.$scale);
    this.isRendered = true;
  }

  public destroy(): void {
    this.detachEventHandlers();
    this.$scale.remove();
    this.isRendered = false;
  }

  private createScale(): void {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale',
    });

    this.$scale = $scaleContainer;
  }

  private createElement(content: string, percentage: number, options: Scale.RenderOptions): JQuery {
    const $elem = $('<span>', { class: 'scale__element' });
    $elem.html(content);
    if (options.isHorizontal) {
      $elem.css('left', percentage);
    } else {
      $elem.css('top', percentage);
    }
    $elem.data('value', percentage);

    if (options.isHorizontal && !$elem.hasClass('scale__element_horizontal')) {
      $elem.addClass('scale__element_horizontal');
    }

    if (!options.isHorizontal && $elem.hasClass('scale__element_horizontal')) {
      $elem.removeClass('scale__element_horizontal');
    }

    return $elem;
  }

  private attachEventHandlers(): void {
    this.$scale.on('click', this.clickEventListener.bind(this));
  }

  private detachEventHandlers(): void {
    this.$scale.off('click', this.clickEventListener.bind(this));
  }

  private clickEventListener(event: JQuery.ClickEvent): void {
    const elem: HTMLElement = event.target;
    let value: number;
    if (elem.classList.contains('scale__element')) {
      value = $(elem).data('value');

      this.observer.change(value);
      this.observer.finish(value);
    }
  }
}

export default SliderScale;
