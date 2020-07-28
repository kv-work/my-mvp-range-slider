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

  update(data: View.RenderData, options: ValuesDisplay.UpdateOptions): void {
    const currentOpts: ValuesDisplay.UpdateOptions = this.$displayContainer.data('options');
    const defaultOpts: ValuesDisplay.UpdateOptions = {
      isHorizontal: true,
      prefix: '',
      postfix: '',
    };

    const newOpts: ValuesDisplay.UpdateOptions = {
      ...defaultOpts,
      ...currentOpts,
      ...options,
    };

    // update valueDisplay elements
    const { value, percentage } = data;
    if (Array.isArray(value) && Array.isArray(percentage)) {
      if (!this.$firstValDisplay) {
        this.$firstValDisplay = $('<div>', { class: 'slider__display_value' });
        this.$displayContainer.append(this.$firstValDisplay);
      }

      if (!this.$secondValDisplay) {
        this.$secondValDisplay = $('<div>', { class: 'slider__display_value' });
        this.$displayContainer.append(this.$secondValDisplay);
      }
    }

    if (!Array.isArray(value) && !Array.isArray(percentage)) {
      if (!this.$firstValDisplay) {
        this.$firstValDisplay = $('<div>', { class: 'slider__display_value' });
        this.$displayContainer.append(this.$firstValDisplay);
      }

      if (this.$secondValDisplay) {
        this.$secondValDisplay.remove();
        this.$secondValDisplay = null;
      }
    }

    this.$displayContainer.data({ options: newOpts, data: data.value });

    if (options.isHorizontal && !this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.addClass('slider__display_container_horizontal');
      this.$firstValDisplay.addClass('slider__display_value_horizontal');
      this.$secondValDisplay?.addClass('slider__display_value_horizontal');
    }
    if (!options.isHorizontal && this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.removeClass('slider__display_container_horizontal');
      this.$firstValDisplay.removeClass('slider__display_value_horizontal');
      this.$secondValDisplay?.removeClass('slider__display_value_horizontal');
    }

    if (!this.isRendered) {
      this.$view.prepend(this.$displayContainer);
      this.isRendered = true;
    }

    this.updateValueDisplay({ renderData: data, options: newOpts });
  }

  destroy(): void {
    this.$displayContainer.remove();
    if (this.$firstValDisplay) {
      this.$firstValDisplay.remove();
      this.$firstValDisplay = null;
    }
    if (this.$secondValDisplay) {
      this.$secondValDisplay.remove();
      this.$secondValDisplay = null;
    }
    this.isRendered = false;
  }

  private updateValueDisplay(updateData: ValuesDisplay.UpdateData): void {
    const { renderData, options } = updateData;
    const {
      data,
      percentage,
      percentageData,
    } = renderData;
    const { isHorizontal } = options;

    let from: number;
    let to: number;

    let secondIdx: number;
    let secondMetrics: DOMRect;

    if (Array.isArray(percentage)) {
      [from, to] = percentage;
      secondIdx = percentageData.indexOf(to);
      const secondData = data[secondIdx].toString();

      this.$secondValDisplay.data('data', secondData);
      this.$secondValDisplay.data('options', options);

      let secondHtml = options.prefix;
      secondHtml += secondData;
      if (options.postfix !== '') {
        secondHtml += options.postfix;
      }

      this.$secondValDisplay.html(secondHtml);
      secondMetrics = this.$secondValDisplay[0].getBoundingClientRect();
    } else {
      from = percentage;
    }

    const firstIdx = percentageData.indexOf(from);
    const firstData = data[firstIdx].toString();
    this.$firstValDisplay.data('data', firstData);
    this.$firstValDisplay.data('options', options);

    let firstHtml = options.prefix;
    firstHtml += firstData;
    if (options.postfix !== '') firstHtml += options.postfix;
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
      if ((firstX + firstWidth) > containerWidth) {
        this.$firstValDisplay.css({
          left: `calc(${containerWidth - firstWidth}px - 0.75rem)`,
        });
      }

      if (this.$secondValDisplay) {
        secondPos = `calc(${to}% - ${secondMetrics.width / 2}px)`;
        this.$secondValDisplay.css({
          top: '',
          left: secondPos,
        });

        const { x, width } = this.$secondValDisplay[0].getBoundingClientRect();

        if ((x + width) > containerWidth) {
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
      if ((firstY + firstHeight) > containerHeight) {
        this.$firstValDisplay.css({
          top: `calc(${containerHeight - firstHeight}px - 0.75rem)`,
        });
      }


      if (this.$secondValDisplay) {
        secondPos = `calc(${to}% - ${secondMetrics.height / 2}px)`;
        this.$secondValDisplay.css({
          left: '',
          top: secondPos,
        });

        const { y, height } = this.$secondValDisplay[0].getBoundingClientRect();

        if ((y + height) > containerHeight) {
          this.$secondValDisplay.css({
            top: `calc(${containerHeight - height}px - 0.75rem)`,
          });
        }
      }
    }
  }

  static createValuesDisplayContainer(): JQuery {
    const $displayContainer = $('<div>', {
      class: 'js-slider__display_container slider__display_container',
    });

    return $displayContainer;
  }
}
