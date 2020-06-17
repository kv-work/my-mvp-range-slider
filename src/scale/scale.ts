import $ from 'jquery';
import './scale.css';

class SliderScale implements Scale {
  private $view: JQuery;
  private $scale: JQuery;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$view = options.$viewContainer;
    this.isRendered = false;
  }

  public update(opts: Scale.UpdateOptions): void {
    const { data, percentageData } = opts.data;
    this.$scale = SliderScale.createScale(opts.options);
    this.$scale.data('data', data);

    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const percentage = percentageData[idx];
      const $elem = SliderScale.createElement(content, percentage, opts.options);
      this.$scale.append($elem);
    });

    this.attachEventHandlers();

    if (this.isRendered) {
      this.$view.find('.js-slider__scale').replaceWith(this.$scale);
    } else {
      this.$view.append(this.$scale);
      this.isRendered = true;
    }
  }

  public destroy(): void {
    this.$view.find('.js-slider__scale').off('click');
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

      const $startEvent = $.Event('myMVPSlider.startChanging');
      this.$view.trigger($startEvent);

      const currentData = this.$scale.data('data');
      let isSecond = false;

      if (Array.isArray(currentData)) {
        const average = (currentData[1] + currentData[0]) / 2;
        isSecond = value > average;
      }

      const eventData = [value, isSecond];

      const $changeEvent = $.Event('myMVPSlider.changeValue');
      this.$view.trigger($changeEvent, eventData);

      const $finishEvent = $.Event('myMVPSlider.finish');
      this.$view.trigger($finishEvent, eventData);
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
      $elem.css('left', `${percentage}%`);
    } else {
      $elem.css('top', `${percentage}%`);
    }
    $elem.data('value', percentage);

    if (options.isHorizontal) {
      $elem.addClass('scale__element_horizontal');
    }

    return $elem;
  }
}

export default SliderScale;
