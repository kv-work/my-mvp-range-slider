import $ from 'jquery';

class SliderBar implements Bar {
  private $view: JQuery;
  private $bar: JQuery;
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

    if (this.$bar.find('.slider__range').length === 0 && newData.range) {
      const $range = $('<div>', { class: 'slider__range' });
      this.$bar.append($range);
    } else if (this.$bar.find('.slider__range').length !== 0 && !newData.range) {
      this.$bar.find('.slider__range').remove();
    }

    let direction: string;
    const color = '#53B6A8';
    if (newData.isHorizontal) {
      direction = 'to right';
    } else {
      direction = 'to bottom';
    }

    if (Array.isArray(data)) {
      const [value, secondValue] = data;
      this.$bar.css({
        background: `linear-gradient(${direction}, #E5E5E5 ${value}%, ${color} ${value}%, ${color} ${secondValue}%, #E5E5E5 ${secondValue}%)`,
      });
    } else {
      this.$bar.css({
        background: `linear-gradient(${direction}, ${color} ${data}%, #E5E5E5 ${data}%)`,
      });
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

    const $changeEvent = $.Event('myMVPSlider.changeValue');
    this.$view.trigger($changeEvent, [selectedVal]);

    const $finishEvent = $.Event('myMVPSlider.finish');
    this.$view.trigger($finishEvent, [selectedVal]);
  }

  static createBar(): JQuery {
    const $bar = $('<div>', {
      class: 'js-slider__bar slider__bar',
    });

    return $bar;
  }
}

export default SliderBar;
