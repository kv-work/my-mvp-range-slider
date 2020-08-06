import './bar.css';

class SliderBar implements Bar {
  private $view: JQuery;
  private $barContainer: JQuery;
  private $bar: JQuery;
  private $range: JQuery;
  private isRendered: boolean;

  constructor(options: Bar.Options) {
    this.$view = options.$viewContainer;
    this.$barContainer = options.$barContainer;
    this.$bar = SliderBar.createBar();
    this.isRendered = false;
  }

  update(opts: Bar.UpdateOptions): void {
    const currentOptions = this.$bar.data('options');
    const { options, data } = opts;
    const defaultOptions: Bar.RenderOptions = {
      isHorizontal: true,
      range: true,
      dragInterval: false,
    };
    const newOptions = {
      ...defaultOptions,
      ...currentOptions,
      ...options,
    };

    this.$bar.data('options', newOptions);
    this.$bar.data('data', data);

    if (!newOptions.isHorizontal && this.$bar.hasClass('slider__bar_horizontal')) {
      this.$bar.removeClass('slider__bar_horizontal');
    } else if (newOptions.isHorizontal && !this.$bar.hasClass('slider__bar_horizontal')) {
      this.$bar.addClass('slider__bar_horizontal');
    }

    if (newOptions.range) {
      this.createRangeElement();
    }
    if (!newOptions.range && this.$range) {
      this.destroyRangeElement();
    }

    if (!this.isRendered) {
      this.$barContainer.append(this.$bar);
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
    const $startEvent = $.Event('startChanging.myMVPSlider');
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

    const $changeEvent = $.Event('changeValue.myMVPSlider');
    this.$view.trigger($changeEvent, eventData);

    const $finishEvent = $.Event('finish.myMVPSlider');
    this.$view.trigger($finishEvent, eventData);
  }

  private createRangeElement(): void {
    const { options, data } = this.$bar.data();

    if (!this.$range) {
      this.$range = $('<div>', { class: 'slider__range' });
      this.$range.data('have-handler', false);
      this.$bar.append(this.$range);
    }

    if (options.isHorizontal) {
      this.$range.css('top', '');
      this.$range.css('height', '');
      if (Array.isArray(data)) {
        const [value, secondValue] = data;

        this.$range.css({
          left: `${value}%`,
          width: `${secondValue - value}%`,
          'border-radius': '0.75rem',
        });
      } else {
        this.$range.css({
          left: 0,
          width: `${data}%`,
          'border-top-left-radius': '0.75rem',
          'border-bottom-left-radius': '0.75rem',
        });
      }
    } else if (Array.isArray(data)) {
      this.$range.css('left', '');
      this.$range.css('width', '');
      const [value, secondValue] = data;
      this.$range.css({
        top: `${value}%`,
        height: `${secondValue - value}%`,
        'border-radius': '0.75rem',
      });
    } else {
      this.$range.css('width', '');
      this.$range.css({
        height: `${data}%`,
        'border-top-left-radius': '0.75rem',
        'border-top-right-radius': '0.75rem',
      });
    }

    const haveHandler = this.$range.data('have-handler');
    const isDragable = options.dragInterval && Array.isArray(data);

    if (isDragable && !haveHandler) {
      this.$range.css({ cursor: 'grab' });
      this.$range.on('mousedown.bar', this.dragStartHandler.bind(this));
      this.$range.data('have-handler', true);
      this.$range[0].onclick = (e: Event): void => {
        e.stopPropagation();
      };
      this.$range.on('dragstart.bar', false);
    }

    if (!isDragable && haveHandler) {
      this.$range.css({ cursor: 'default' });
      this.$range.off('mousedown.bar');
      this.$range.data('have-handler', false);
      this.$range[0].onclick = null;
      this.$range.off('dragstart.bar');
    }
  }

  private dragStartHandler(event: JQuery.MouseDownEvent): void {
    this.$range.css({ cursor: 'grabbing' });
    let startCoord: number;
    const viewMetrics: DOMRect = this.$view[0].getBoundingClientRect();
    if (this.$bar.data('options').isHorizontal) {
      startCoord = ((event.clientX - viewMetrics.x) / viewMetrics.width) * 100;
    } else {
      startCoord = ((event.clientY - viewMetrics.y) / viewMetrics.height) * 100;
    }
    const $startEvent = $.Event('startChanging.myMVPSlider');
    const isDragStarted = true;
    this.$view.trigger($startEvent, [isDragStarted]);
    const dragHandler = this.makeDragHandler(startCoord);
    this.$view.on('mousemove.bar', dragHandler);
    document.onmouseup = (): void => {
      this.$view.off('mousemove.bar', dragHandler);
      this.$range.css({ cursor: 'grab' });

      const $dropEvent = $.Event('dropRange.myMVPSlider');
      this.$view.trigger($dropEvent);

      document.onmouseup = null;
    };
  }

  private makeDragHandler(start: number): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const dragHandler = (event: JQuery.MouseMoveEvent): void => {
      let newCoord: number;
      const viewMetrics: DOMRect = this.$view[0].getBoundingClientRect();

      if (this.$bar.data('options').isHorizontal) {
        newCoord = ((event.clientX - viewMetrics.x) / viewMetrics.width) * 100;
      } else {
        newCoord = ((event.clientY - viewMetrics.y) / viewMetrics.height) * 100;
      }

      const dragDistance = newCoord - start;
      const $dragRangeEvent = $.Event('dragRange.myMVPSlider');
      this.$view.trigger($dragRangeEvent, [dragDistance]);
    };

    return dragHandler;
  }

  private destroyRangeElement(): void {
    this.$range.remove();
    this.$range = null;
  }

  static createBar(): JQuery {
    const $bar = $('<div>', {
      class: 'js-slider__bar slider__bar',
    });

    return $bar;
  }
}

export default SliderBar;
