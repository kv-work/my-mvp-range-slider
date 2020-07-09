import $ from 'jquery';
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
      scaleStep: 1,
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

    if (!this.isRendered) {
      this.$view.append(this.$scale);
      this.attachEventHandlers();
      this.isRendered = true;
    }

    const { data, percentageData } = newData;
    this.$scale.empty();
    data.forEach((elem: App.Stringable, idx: number) => {
      const content = elem.toString();
      const value = percentageData[idx];
      const $elem = SliderScale.createElement(content, value, scaleOptions);
      this.$scale.append($elem);

      const $content = $elem.find('.scale__content');
      const $stria = $elem.find('.scale__stria');
      const elemMetrics: DOMRect = $elem[0].getBoundingClientRect();

      if (options.isHorizontal) {
        switch (value) {
          case 100:
            $elem.css({
              right: '0%',
              'align-items': 'flex-end',
            });
            break;
          case 0:
            $elem.css('left', `${value}%`);
            break;
          default:
            $elem.css({
              left: `calc(${value}% - ${elemMetrics.width / 2}px)`,
              'align-items': 'center',
            });
            break;
        }
      } else {
        switch (value) {
          case 100:
            $elem.css('bottom', '0%');
            break;
          default:
            $elem.css('top', `${value}%`);
            break;
        }
      }
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
    const elem: HTMLElement = event.target;
    let selectedVal: number;
    if (elem.classList.contains('scale__element') || elem.parentElement.classList.contains('scale__element')) {
      selectedVal = $(elem).data('value');

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
    const $elem = $('<div>', { class: 'scale__element' });
    const $stria = $('<div>', {
      class: 'scale__stria',
    });
    const $content = $('<div>', { class: 'scale__content' });
    $content.html(content);

    $elem.data('value', value);
    $stria.data('value', value);
    $content.data('value', value);

    if (options.isHorizontal) {
      $elem.addClass('scale__element_horizontal');
    }

    $elem
      .append($stria)
      .append($content);

    return $elem;
  }
}

export default SliderScale;
