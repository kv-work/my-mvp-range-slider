import $ from 'jquery';
import './scale.css';

class SliderScale implements Scale {
  private $container: JQuery;
  private $scale: JQuery;
  private observer: View.SubViewObserver;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$container = options.$viewContainer;
    this.observer = options.observer;
    this.isRendered = false;
  }

  public render(renderData: View.RenderData, options: Scale.RenderOptions): void {
    const { data, percentageData } = renderData;
    this.$scale = SliderScale.createScale(options);

    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const percentage = percentageData[idx];
      const $elem = SliderScale.createElement(content, percentage, options);
      this.$scale.append($elem);
    });

    if (this.isRendered) {
      this.$container.find('.js-slider__scale').replaceWith(this.$scale);
    } else {
      this.attachEventHandlers();
      this.$container.append(this.$scale);
      this.isRendered = true;
    }
  }

  public destroy(): void {
    this.$container.find('.js-slider__scale').off('click');
    this.$scale.remove();
    this.isRendered = false;
  }

  private attachEventHandlers(): void {
    this.$scale.on('click', this.clickEventListener.bind(this));
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

  static createScale(options: Scale.RenderOptions): JQuery {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale slider__scale',
    });

    const scaleOptions = $.extend({
      isHorizontal: true,
      scaleStep: 1,
      displayScaleValue: true,
      displayMin: true,
      displayMax: true,
    }, options);

    $scaleContainer.data('options', scaleOptions);

    if (scaleOptions.isHorizontal) {
      $scaleContainer.addClass('slider__scale_horizontal');
    }

    return $scaleContainer;
  }

  static createElement(content: string, percentage: number, options: Scale.RenderOptions): JQuery {
    const $elem = $('<span>', { class: 'scale__element' });
    $elem.html(content);
    if (options.isHorizontal) {
      $elem.css('left', percentage);
    } else {
      $elem.css('top', percentage);
    }
    $elem.data('value', percentage);

    if (options.isHorizontal) {
      $elem.addClass('scale__element_horizontal');
    }

    return $elem;
  }
}

export default SliderScale;
