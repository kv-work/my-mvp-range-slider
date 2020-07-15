import $ from 'jquery';
import './scale.css';

class SliderScale implements Scale {
  private $view: JQuery;
  private $scale: JQuery;
  private $scaleStripes: JQuery;
  private isRendered: boolean;

  constructor(options: Scale.Options) {
    this.$view = options.$viewContainer;
    this.$scale = SliderScale.createScale();
    this.$scaleStripes = SliderScale.createStrips();
    this.isRendered = false;
  }

  public update(opts: Scale.UpdateOptions): void {
    const currentData = this.$scale.data('options');
    const { data: newData, options } = opts;
    const defaultOptions: Scale.RenderOptions = {
      isHorizontal: true,
      scaleStep: 1,
      displayScaleStrips: true,
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

    if (scaleOptions.displayScaleStrips && this.$scale.find('.scale__strips').length === 0) {
      this.$scale.append(this.$scaleStripes);
    }

    if (!scaleOptions.displayScaleStrips && this.$scale.find('.scale__strips').length !== 0) {
      this.$scale.find('.slider__scale_strips').remove();
    }

    if (!this.isRendered) {
      this.$view.append(this.$scale);
      this.attachEventHandlers();
      this.isRendered = true;
    }

    const scaleStripsStep: number = (1 / (newData.data.length - 1)) * 100;

    this.$scaleStripes.css({
      'background-image': `linear-gradient(to right, #000 0%, #000 ${1}px, transparent ${1}px, transparent 100%)`,
      'background-size': `${scaleStripsStep}% 50%`,
    });
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
    const $startEvent = $.Event('startChanging.myMVPSlider');
    this.$view.trigger($startEvent);

    let clickCoord: number;
    let selectedVal: number;
    const elem: HTMLElement = event.currentTarget;
    const elemMetrics: DOMRect = elem.getBoundingClientRect();
    const options: Scale.RenderOptions = $(elem).data('options');

    if (options.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    const data: View.RenderData = $(elem).data('data');
    const currentData = data.percentage;
    let isSecond = false;

    if (Array.isArray(currentData)) {
      const average = (currentData[1] + currentData[0]) / 2;
      isSecond = selectedVal > average;
    }

    const eventData = [selectedVal, isSecond];

    const $changeEvent = $.Event('changeValue.myMVPSlider');
    this.$view.trigger($changeEvent, eventData);

    const $finishEvent = $.Event('finish.myMVPSlider');
    this.$view.trigger($finishEvent, eventData);
  }

  static createScale(): JQuery {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale slider__scale',
    });

    return $scaleContainer;
  }

  static createElement(content: string, value: number, options: Scale.RenderOptions): JQuery {
    const $elem = $('<div>', { class: 'scale__element' });
    const $content = $('<div>', { class: 'scale__content' });
    $content.html(content);

    $elem.data('value', value);
    $content.data('value', value);

    if (options.isHorizontal) {
      $elem.addClass('scale__element_horizontal');
    }

    $elem.append($content);

    return $elem;
  }

  static createStrips(): JQuery {
    const $scaleStrips = $('<div>', {
      class: 'scale__strips',
    });

    return $scaleStrips;
  }
}

export default SliderScale;
