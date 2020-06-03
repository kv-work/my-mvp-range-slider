import $ from 'jquery';

class SliderBar implements Bar {
  private $container: JQuery;
  private $bar: JQuery;
  private options: Bar.RenderOptions;
  private observer: Bar.Observer;
  private isRendered: boolean;

  constructor(options: Bar.Options) {
    this.$container = options.$viewContainer;
    this.observer = options.observer;
    this.isRendered = false;
  }

  public render(data: number | [number, number], options: Bar.RenderOptions): void {
    this.$bar = SliderBar.createBar(options);

    let direction: string;
    const color = '#53B6A8';
    if (options.isHorizontal) {
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

    if (this.isRendered) {
      this.$container.find('.js-slider__bar').replaceWith(this.$bar);
    } else {
      this.attachEventHandlers();
      this.$container.append(this.$bar);
      this.isRendered = true;
    }
  }

  public destroy(): void {
    this.$container.find('.js-slider__bar').off('click');
    this.$bar.remove();
    this.isRendered = false;
  }

  private attachEventHandlers(): void {
    this.$bar.on('click', this.clickHandler.bind(this));
  }

  private clickHandler(event: JQuery.ClickEvent): void {
    let clickCoord: number;
    let selectedVal: number;
    const elem: HTMLElement = event.currentTarget;
    const elemMetrics: DOMRect = elem.getBoundingClientRect();
    const options: Bar.RenderOptions = this.$bar.data('options');
    if (options.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    this.observer.start();
    this.observer.change(selectedVal);
    this.observer.finish(selectedVal);
  }

  static createBar(options: Bar.RenderOptions): JQuery {
    const $bar = $('<div>', {
      class: 'js-slider__bar slider__bar',
    });

    if (options.isHorizontal) {
      $bar.addClass(' slider__bar_horizontal');
    }

    const barOptions: Bar.RenderOptions = $.extend({
      isHorizontal: true,
      range: true,
      dragInterval: false,
    }, options);
    $bar.data('options', barOptions);

    return $bar;
  }
}

export default SliderBar;
