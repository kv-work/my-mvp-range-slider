import $ from 'jquery';

class SliderBar implements Bar {
  private $container: JQuery;
  private $bar: JQuery;
  private options: Bar.RenderOptions;
  private observer: Bar.Observer;
  private isRendered: boolean;

  constructor(options: Bar.Options) {
    this.$container = options.$viewContainer;
    this.isRendered = false;

    this.options = $.extend({
      isHorizontal: true,
      range: true,
      dragInterval: true,
    }, options.renderOptions);

    this.createBar();
  }

  public render(data: number | [number, number]): void {
    let direction: string;
    const color = '#53B6A8';
    if (this.options.isHorizontal) {
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

    this.attachEventHandlers();
    this.$container.append(this.$bar);
  }

  public destroy(): void {
    this.$bar.remove();
  }

  private createBar(): void {
    let classList = 'js-slider__bar slider__bar';
    if (this.options.isHorizontal) {
      classList += ' slider__bar_horizontal';
    } else {
      classList += ' slider__bar_vertical';
    }

    this.$bar = $('<div>', {
      class: classList,
    });
  }

  private attachEventHandlers(): void {
    this.$bar.on('click', this.clickHandler.bind(this));
  }

  private clickHandler(event: JQuery.ClickEvent): void {
    let clickCoord: number;
    let selectedVal: number;
    const elem: HTMLElement = event.currentTarget;
    const elemMetrics: DOMRect = elem.getBoundingClientRect();
    if (this.options.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };
    this.observer.notify(startAction);

    const changeAction: {event: string; value: [number, number] | number} = { event: 'change', value: selectedVal };
    this.observer.notify(changeAction);

    const finishAction: {event: string; value: [number, number] | number} = { event: 'finish', value: selectedVal };
    this.observer.notify(finishAction);
  }
}

export default SliderBar;
