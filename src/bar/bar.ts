import $ from 'jquery';
import './bar.css';

class SliderBar implements Bar {
  private $view: JQuery;
  private $bar: JQuery;
  private $range: JQuery;
  private isRendered: boolean;

  constructor(options: Bar.Options) {
    this.$view = options.$viewContainer;
    this.$bar = SliderBar.createBar();
    this.isRendered = false;
  }

  update(opts: Bar.UpdateOptions): void {
    const currentData = this.$bar.data('options');
    const { options, data } = opts;
    const defaultOptions: Bar.RenderOptions = {
      isHorizontal: true,
      range: true,
      dragInterval: false,
    };
    const newData = {
      ...defaultOptions,
      ...currentData,
      ...options,
    };

    this.$bar.data('options', newData);
    this.$bar.data('data', data);

    if (!newData.isHorizontal && this.$bar.hasClass('slider__bar_horizontal')) {
      this.$bar.removeClass('slider__bar_horizontal');
    } else if (newData.isHorizontal && !this.$bar.hasClass('slider__bar_horizontal')) {
      this.$bar.addClass('slider__bar_horizontal');
    }

    if (newData.range) {
      this.createRangeElement();
    } else if (this.$range) {
      this.destroyRangeElement();
    }

    if (!this.isRendered) {
      this.$view.append(this.$bar);
      this.isRendered = true;
      this.attachEventHandlers();
    }
  }

  destroy(): void {
    this.$bar.off('click');
    this.$bar.remove();
    this.isRendered = false;
  }

  private attachEventHandlers(): void {
    this.$bar.on('click', this.clickHandler.bind(this));
  }

  private clickHandler(event: JQuery.ClickEvent): void {
    const $startEvent = $.Event('myMVPSlider.startChanging');
    this.$view.trigger($startEvent);

    let clickCoord: number;
    let selectedVal: number;
    const elem: HTMLElement = event.currentTarget;
    const elemMetrics: DOMRect = elem.getBoundingClientRect();
    const options: Bar.RenderOptions = $(elem).data('options');
    if (options.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    const currentData = $(elem).data('data');
    let isSecond = false;

    if (Array.isArray(currentData)) {
      const average = (currentData[1] + currentData[0]) / 2;
      isSecond = selectedVal > average;
    }

    const eventData = [selectedVal, isSecond];

    const $changeEvent = $.Event('myMVPSlider.changeValue');
    this.$view.trigger($changeEvent, eventData);

    const $finishEvent = $.Event('myMVPSlider.finish');
    this.$view.trigger($finishEvent, eventData);
  }

  private createRangeElement(): void {
    const { options, data } = this.$bar.data();

    if (!this.$range) {
      this.$range = $('<div>', { class: 'slider__range' });
      this.$bar.append(this.$range);
    }

    if (options.isHorizontal) {
      if (Array.isArray(data) && options.range) {
        const [value, secondValue] = data;
        this.$range.css({
          left: `calc(0.75rem + ${value}%)`,
          width: `calc(${secondValue - value}% - 1.5rem)`,
        });
      } else if (options.range) {
        this.$range.css({
          width: `calc(0.75rem + ${data}%)`,
          'border-top-left-radius': '0.75rem',
          'border-bottom-left-radius': '0.75rem',
        });
      }
    } else if (Array.isArray(data) && options.range) {
      const [value, secondValue] = data;
      this.$range.css({
        top: `calc(0.75rem + ${value}%)`,
        height: `${secondValue - value}%`,
      });
    } else if (options.range) {
      this.$range.css({
        height: `${data}%`,
      });
    }
  }

  private destroyRangeElement(): void {
    this.$range.remove();
  }

  static createBar(): JQuery {
    const $bar = $('<div>', {
      class: 'js-slider__bar slider__bar',
    });

    return $bar;
  }
}

export default SliderBar;
