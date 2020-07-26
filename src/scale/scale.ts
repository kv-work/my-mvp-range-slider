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
      displayScaleValue: true,
      displayMin: true,
      displayMax: true,
      numOfScaleVal: 3,
    };

    const scaleOptions: Scale.RenderOptions = {
      ...defaultOptions,
      ...currentData,
      ...options,
    };

    this.$scale.data('data', newData);
    this.$scale.data('options', scaleOptions);

    const {
      isHorizontal,
      displayMin,
      displayMax,
      displayScaleValue,
    } = scaleOptions;

    if (isHorizontal && !this.$scale.hasClass('slider__scale_horizontal')) {
      this.$scale.addClass('slider__scale_horizontal');
    }

    if (!isHorizontal && this.$scale.hasClass('slider__scale_horizontal')) {
      this.$scale.removeClass('slider__scale_horizontal');
    }

    if (!this.isRendered) {
      this.$view.append(this.$scale);
      this.attachEventHandlers();
      this.isRendered = true;
    }

    const { data, percentageData } = newData;
    this.$scale.empty();

    // append min
    if (displayMin) {
      const content = data[0].toString();
      const value = percentageData[0];
      const $elem = SliderScale.createElement(content, value, scaleOptions);
      this.$scale.append($elem);
      SliderScale.positionElem($elem, scaleOptions);
    }

    // append values
    if (displayScaleValue && scaleOptions.numOfScaleVal !== undefined) {
      const total = data.length;
      const num = SliderScale.normalizeNumOfScaleVal(scaleOptions.numOfScaleVal, total);

      if (num > 0) {
        const scaleStep = Math.floor(total / (num + 1));
        for (let i = 1; i <= num; i += 1) {
          const idx = i * scaleStep;
          const content = data[idx].toString();
          const value = percentageData[idx];
          const $elem = SliderScale.createElement(content, value, scaleOptions);
          this.$scale.append($elem);
          SliderScale.positionElem($elem, scaleOptions);
        }
      }
    }

    // append max
    if (displayMax) {
      const idx = data.length - 1;
      const content = data[idx].toString();
      const value = percentageData[idx];
      const $elem = SliderScale.createElement(content, value, scaleOptions);
      this.$scale.append($elem);
      SliderScale.positionElem($elem, scaleOptions);
    }

    let maxVal = 0;

    this.$scale.find('.scale__element').each(function compareWithMaxVal() {
      if (isHorizontal) {
        const h = this.getBoundingClientRect().height;
        maxVal = (maxVal > h) ? maxVal : h;
      } else {
        const w = this.getBoundingClientRect().width;
        maxVal = (maxVal > w) ? maxVal : w;
      }
    });

    if (isHorizontal) {
      this.$scale.css({
        height: `${maxVal}px`,
        width: '100%',
      });
    } else {
      this.$scale.css({
        width: `${maxVal}px`,
        height: '100%',
      });
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
    let selectedVal: number;
    if (elem.classList.contains('scale__element')) {
      selectedVal = $(elem).data('percentage');

      const $startEvent = $.Event('startChanging.myMVPSlider');
      this.$view.trigger($startEvent);

      const currentData = this.$scale.data('data').percentage;
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
  }

  static createScale(): JQuery {
    const $scaleContainer = $('<div>', {
      class: 'js-slider__scale slider__scale',
    });

    return $scaleContainer;
  }

  static createElement(content: string, value: number, options: Scale.RenderOptions): JQuery {
    const $elem = $('<span>', { class: 'scale__element' });
    $elem.html(content);

    $elem.data('percentage', value);

    if (options.isHorizontal) {
      $elem.addClass('scale__element_horizontal');
    }

    return $elem;
  }

  static normalizeNumOfScaleVal(num: number, total: number): number {
    let resultNum: number = num < (total - 2) ? num : (total - 2);

    if (resultNum < 0) {
      resultNum = 0;
    }

    if (resultNum > 10) {
      resultNum = 10;
    }

    return resultNum;
  }

  static positionElem($elem: JQuery, options: Scale.RenderOptions): void {
    const value = $elem.data('percentage');
    const elemMetrics: DOMRect = $elem[0].getBoundingClientRect();

    if (options.isHorizontal) {
      switch (value) {
        case 0:
          $elem.css({
            left: 'calc(0% - 0.75rem)',
          });
          break;
        case 100:
          $elem.css({
            right: 'calc(0% - 0.75rem)',
            'align-items': 'flex-end',
          });
          break;
        default:
          $elem.css({
            left: `calc(${value}% - ${elemMetrics.width / 2}px)`,
            'align-items': 'center',
          });
          break;
      }
    } else {
      $elem.css({
        'padding-left': '0.8rem',
        top: `calc(${value}% - ${elemMetrics.height / 2}px)`,
      });
    }
  }
}

export default SliderScale;
