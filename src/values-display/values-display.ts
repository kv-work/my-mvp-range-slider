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
        this.$secondValDisplay = undefined;
      }
    }

    this.$displayContainer.data({ options: newOpts, data: data.value });

    if (options.isHorizontal && !this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.addClass('slider__display_container_horizontal');
    }
    if (!options.isHorizontal && this.$displayContainer.hasClass('slider__display_container_horizontal')) {
      this.$displayContainer.removeClass('slider__display_container_horizontal');
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
    let firstIdx: number;
    let secondIdx: number;

    if (Array.isArray(percentage)) {
      const [from, to] = percentage;

      firstIdx = percentageData.indexOf(from);
      const firstData = data[firstIdx].toString();
      this.$firstValDisplay.data('data', firstData);
      this.$firstValDisplay.data('options', options);

      secondIdx = percentageData.indexOf(to);
      const secondData = data[secondIdx].toString();
      this.$secondValDisplay.data('data', secondData);
      this.$secondValDisplay.data('options', options);

      let firstHtml = options.prefix;
      let secondHtml = options.prefix;

      firstHtml += firstData;
      secondHtml += secondData;
      if (options.postfix !== '') {
        firstHtml += options.postfix;
        secondHtml += options.postfix;
      }
      this.$firstValDisplay.html(firstHtml);
      this.$secondValDisplay.html(secondHtml);

      const firstMetrics = this.$firstValDisplay[0].getBoundingClientRect();
      const secondMetrics = this.$secondValDisplay[0].getBoundingClientRect();
      let firstPos: string;
      let secondPos: string;

      switch (from) {
        case 0:
          if (options.isHorizontal) {
            this.$firstValDisplay.css({ left: '0%' });
          } else {
            this.$firstValDisplay.css({ top: '0%' });
          }
          break;
        default:
          if (options.isHorizontal) {
            firstPos = `calc(${from}% - ${firstMetrics.width / 2}px)`;
            this.$firstValDisplay.css({ left: firstPos });
          } else {
            firstPos = `calc(${from}% - ${firstMetrics.height / 2}px)`;
            this.$firstValDisplay.css({ top: firstPos });
          }
          break;
      }

      switch (to) {
        case 100:
          if (options.isHorizontal) {
            secondPos = `calc(${to}% - ${secondMetrics.width}px)`;
            this.$secondValDisplay.css({ left: secondPos });
          } else {
            this.$secondValDisplay.css({ down: '0%' });
          }
          break;
        default:
          if (options.isHorizontal) {
            secondPos = `calc(${to}% - ${secondMetrics.width / 2}px)`;
            this.$secondValDisplay.css({ left: secondPos });
          } else {
            secondPos = `calc(${to}% - ${secondMetrics.height / 2}px)`;
            this.$secondValDisplay.css({ top: secondPos });
          }
          break;
      }
    } else {
      firstIdx = percentageData.indexOf(percentage);
      const firstData = data[firstIdx].toString();
      this.$firstValDisplay.data('data', firstData);
      this.$firstValDisplay.data('options', options);

      let firstHtml = options.prefix;
      firstHtml += firstData;
      if (options.postfix !== '') firstHtml += options.postfix;
      this.$firstValDisplay.html(firstHtml);

      const firstMetrics: DOMRect = this.$firstValDisplay[0].getBoundingClientRect();
      let firstPos: string;

      if (options.isHorizontal) {
        this.$firstValDisplay.css('right', '');
        this.$firstValDisplay.css('top', '');
        switch (percentage) {
          case 0:
            this.$firstValDisplay.css({ left: '0%' });
            break;
          case 100:
            firstPos = `calc(${percentage}% - ${firstMetrics.width}px)`;
            this.$firstValDisplay.css({ left: firstPos });
            break;
          default:
            firstPos = `calc(${percentage}% - ${firstMetrics.width / 2}px)`;
            this.$firstValDisplay.css({ left: firstPos });
            break;
        }
      } else {
        this.$firstValDisplay.css('left', '');
        this.$firstValDisplay.css({ right: '1.3rem' });
        switch (percentage) {
          case 0:
            this.$firstValDisplay.css({ top: '0%' });
            break;
          case 100:
            this.$firstValDisplay.css('top', `calc(${percentage}% - ${firstMetrics.height}px)`);
            break;
          default:
            firstPos = `calc(${percentage}% - ${firstMetrics.height / 2}px)`;
            this.$firstValDisplay.css({ top: firstPos });
            break;
        }
      }
    }
  }

  static createValuesDisplayContainer(): JQuery {
    const $displayContainer = $('<div>', {
      class: 'slider__display_container',
    });

    return $displayContainer;
  }
}
