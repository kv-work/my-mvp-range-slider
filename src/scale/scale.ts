import $ from 'jquery';
import './scale.css';

class SliderScale implements Scale {
  private $view: JQuery;
  private $scale: JQuery;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$view = options.$viewContainer;
    this.$scale = SliderScale.createScale();
    this.isRendered = false;
  }

  public update(opts: Scale.UpdateOptions): void {
    const currentData = this.$scale.data('options');
    const { data: newData, options } = opts;
    const defaultOptions: Scale.RenderOptions = {
      isHorizontal: true,
      scaleStep: 1,
      displayScaleValue: true,
      displayMin: true,
      displayMax: true,
    };

    const scaleOptions = {
      ...defaultOptions,
      ...currentData,
      ...options,
    };

    this.$scale.data('data', newData);
    this.$scale.data('options', scaleOptions);

    if (scaleOptions.isHorizontal && !this.$scale.hasClass('slider__scale_horizontal')) {
      this.$scale.addClass('slider__scale_horizontal');
    }

    if (!scaleOptions.isHorizontal && this.$scale.hasClass('slider__scale_horizontal')) {
      this.$scale.removeClass('slider__scale_horizontal');
    }

    const { data, percentageData } = newData;
    this.$scale.empty();
    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const percentage = percentageData[idx];
      const $elem = SliderScale.createElement(content, percentage, scaleOptions);
      this.$scale.append($elem);
    });

    if (!this.isRendered) {
      this.$view.append(this.$scale);
      this.attachEventHandlers();
      this.isRendered = true;
    }
  }

  public destroy(): void {
    this.$scale.off('click');
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

  static createScale(): JQuery {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale slider__scale',
    });

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
