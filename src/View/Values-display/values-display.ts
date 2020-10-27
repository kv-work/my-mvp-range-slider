import './values-display.css';

export default class SliderValuesDisplay implements ValuesDisplay {
  private $view: JQuery;
  private $displayContainer: JQuery;
  private $firstValDisplay?: JQuery;
  private $secondValDisplay?: JQuery;
  private isRendered: boolean;

  constructor(options: ValuesDisplay.InitOptions) {
    this.$view = options.$viewContainer;
    this.$displayContainer = SliderValuesDisplay.createValuesDisplayContainer();
    this.isRendered = false;
  }

  update(opts: ValuesDisplay.UpdateOptions): void {
    const { data, options } = opts;
    const currentOpts: ValuesDisplay.RenderOptions = this.$displayContainer.data('options');
    const defaultOpts: ValuesDisplay.RenderOptions = {
      isHorizontal: true,
      prefix: '',
      postfix: '',
    };

    const newOpts: ValuesDisplay.RenderOptions = {
      ...defaultOpts,
      ...currentOpts,
      ...options,
    };

    this.$displayContainer.data({ options: newOpts, data: data.value });

    if (newOpts.isHorizontal && !this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.addClass('slider__display_container_horizontal');
    }
    if (!newOpts.isHorizontal && this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.removeClass('slider__display_container_horizontal');
    }

    if (!this.isRendered) {
      this.$view.prepend(this.$displayContainer);
      this.isRendered = true;
    }

    this.updateValueDisplay({ data, options: newOpts });
    this.attachEventHandlers();
  }

  destroy(): void {
    this.$displayContainer.remove();
    if (this.$firstValDisplay) {
      this.$firstValDisplay.remove();
      this.$firstValDisplay = undefined;
    }
    if (this.$secondValDisplay) {
      this.$secondValDisplay.remove();
      this.$secondValDisplay = undefined;
    }
    this.isRendered = false;
  }

  private updateValueDisplay(updateData: ValuesDisplay.UpdateOptions): void {
    const currentOpts: ValuesDisplay.RenderOptions = this.$displayContainer.data('options');
    const { data: renderData, options = currentOpts } = updateData;
    const { value, percentage } = renderData;
    const { isHorizontal } = options;

    let from: number;

    let firstData: App.Stringable;
    let secondData: App.Stringable;

    // creating firstValDisplay
    if (!this.$firstValDisplay) {
      this.$firstValDisplay = SliderValuesDisplay.createValueDisplay();
      this.$firstValDisplay.data({ isSecond: false });
      this.$displayContainer.append(this.$firstValDisplay);
    }

    // add/remove _horizontal modifier for firstValDisplay
    if (isHorizontal && !this.$firstValDisplay.hasClass('slider__display_value_horizontal')) {
      this.$firstValDisplay.addClass('slider__display_value_horizontal');
    }
    if (!options.isHorizontal && this.$firstValDisplay.hasClass('slider__display_value_horizontal')) {
      this.$firstValDisplay.removeClass('slider__display_value_horizontal');
    }

    if (Array.isArray(value)) {
      [firstData, secondData] = value;

      // create secondValDisplay
      if (!this.$secondValDisplay) {
        this.$secondValDisplay = SliderValuesDisplay.createValueDisplay();
        this.$secondValDisplay.data({ isSecond: true });
        this.$displayContainer.append(this.$secondValDisplay);
      }

      // add/remove _horizontal modifier for secondValDisplay
      if (options.isHorizontal && !this.$secondValDisplay.hasClass('slider__display_value_horizontal')) {
        this.$secondValDisplay.addClass('slider__display_value_horizontal');
      }
      if (!options.isHorizontal && this.$secondValDisplay.hasClass('slider__display_value_horizontal')) {
        this.$secondValDisplay.removeClass('slider__display_value_horizontal');
      }

      this.$secondValDisplay.data('data', secondData);
      this.$secondValDisplay.data('options', options);

      // add html for secondValDisplay
      let secondHtml = `${options.prefix}`;
      secondHtml += secondData.toString();
      if (options.postfix !== '') {
        secondHtml += options.postfix;
      }
      this.$secondValDisplay.html(secondHtml);

      this.$firstValDisplay.data('data', firstData);
      this.$firstValDisplay.data('options', options);
    } else {
      firstData = value;
      this.$firstValDisplay.data('data', firstData);
      this.$firstValDisplay.data('options', options);

      if (this.$secondValDisplay) {
        this.$secondValDisplay.remove();
        this.$secondValDisplay = undefined;
      }
    }

    if (Array.isArray(percentage)) {
      [from] = percentage;
    } else {
      from = percentage;
    }

    let firstHtml = `${options.prefix}`;
    firstHtml += firstData.toString();
    if (options.postfix !== '') {
      firstHtml += options.postfix;
    }
    this.$firstValDisplay.html(firstHtml);

    const firstMetrics = this.$firstValDisplay[0].getBoundingClientRect();

    let firstPos: string;
    let secondPos: string;

    if (isHorizontal) {
      firstPos = `calc(${from}% - ${firstMetrics.width / 2}px)`;

      this.$firstValDisplay.css({
        top: '',
        left: firstPos,
      });

      const { x: firstX, width: firstWidth } = this.$firstValDisplay[0].getBoundingClientRect();

      const { x: containerX, width: containerWidth } = this.$view[0].getBoundingClientRect();

      if (firstX < containerX) {
        this.$firstValDisplay.css({ left: 'calc(0% - 0.75rem)' });
      }
      if ((firstX + firstWidth) > (containerX + containerWidth)) {
        this.$firstValDisplay.css({
          left: `calc(${containerWidth - firstWidth}px - 0.75rem)`,
        });
      }

      if (this.$secondValDisplay && Array.isArray(percentage)) {
        const secondMetrics = this.$secondValDisplay[0].getBoundingClientRect();
        secondPos = `calc(${percentage[1]}% - ${secondMetrics.width / 2}px)`;
        this.$secondValDisplay.css({
          top: '',
          left: secondPos,
        });

        const { x, width } = this.$secondValDisplay[0].getBoundingClientRect();

        if ((x + width) > (containerX + containerWidth)) {
          this.$secondValDisplay.css({
            left: `calc(${containerWidth - width}px - 0.75rem)`,
          });
        }
      }
    } else {
      firstPos = `calc(${from}% - ${firstMetrics.height / 2}px)`;
      this.$firstValDisplay.css({
        left: '',
        top: firstPos,
      });

      const { y: firstY, height: firstHeight } = this.$firstValDisplay[0].getBoundingClientRect();

      const { y: containerY, height: containerHeight } = this.$view[0].getBoundingClientRect();

      if (firstY < containerY) {
        this.$firstValDisplay.css({ top: 'calc(0% - 0.75rem)' });
      }
      if ((firstY + firstHeight) > (containerY + containerHeight)) {
        this.$firstValDisplay.css({
          top: `calc(${containerHeight - firstHeight}px - 0.75rem)`,
        });
      }


      if (this.$secondValDisplay && Array.isArray(percentage)) {
        const secondMetrics = this.$secondValDisplay[0].getBoundingClientRect();
        secondPos = `calc(${percentage[1]}% - ${secondMetrics.height / 2}px)`;
        this.$secondValDisplay.css({
          left: '',
          top: secondPos,
        });

        const { y, height } = this.$secondValDisplay[0].getBoundingClientRect();

        if ((y + height) > (containerY + containerHeight)) {
          this.$secondValDisplay.css({
            top: `calc(${containerHeight - height}px - 0.75rem)`,
          });
        }
      }
    }
  }

  private attachEventHandlers(): void {
    if (this.$firstValDisplay) {
      this.$firstValDisplay.on('mousedown', this.dragStartHandler.bind(this));
      this.$firstValDisplay.on('dragstart', false);
    }

    if (this.$secondValDisplay) {
      this.$secondValDisplay.on('mousedown', this.dragStartHandler.bind(this));
      this.$secondValDisplay.on('dragstart', false);
    }
  }

  private dragStartHandler(event: JQuery.MouseDownEvent): void {
    const $startEvent = $.Event('startChanging.myMVPSlider');
    this.$view.trigger($startEvent);
    const $valDisplay = $(event.currentTarget);
    const isSecond = $valDisplay.data('isSecond');

    const mouseMoveHandler = this.makeHandler(isSecond);
    this.$view.on('mousemove', mouseMoveHandler);
    document.onmouseup = (): void => {
      this.$view.off('mousemove');

      const $finishEvent = $.Event('finish.myMVPSlider');
      this.$view.trigger($finishEvent);

      document.onmouseup = null;
    };
  }

  private makeHandler(isSecond: boolean): (e: JQuery.MouseMoveEvent) => void {
    let moveCoord: number;
    let selectedVal: number;
    const container = this.$displayContainer[0];
    const elemMetrics = container.getBoundingClientRect();
    const { isHorizontal } = this.$displayContainer.data('options');

    const mouseMoveHandler = (e: JQuery.MouseMoveEvent): void => {
      if (isHorizontal) {
        moveCoord = e.clientX - elemMetrics.x;
        selectedVal = (moveCoord / elemMetrics.width) * 100;
      } else {
        moveCoord = e.clientY - elemMetrics.y;
        selectedVal = (moveCoord / elemMetrics.height) * 100;
      }

      const $changeEvent = $.Event('changeValue.myMVPSlider');
      this.$view.trigger($changeEvent, [selectedVal, isSecond]);
    };

    return mouseMoveHandler;
  }

  static createValuesDisplayContainer(): JQuery {
    const $displayContainer = $('<div>', {
      class: 'js-slider__display_container slider__display_container',
    });

    return $displayContainer;
  }

  static createValueDisplay(): JQuery {
    const $valueDisplay = $('<div>', { class: 'slider__display_value' });

    return $valueDisplay;
  }
}
