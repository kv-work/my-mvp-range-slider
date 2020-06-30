import $ from 'jquery';
import './runner.css';

class SliderRunner implements Runner {
  private $view: JQuery;
  private $runner: JQuery;
  private isRendered: boolean;
  private isSecond: boolean;

  constructor(options: Runner.InitOptions) {
    this.$view = options.$viewContainer;
    this.$runner = SliderRunner.createRunner();
    this.isRendered = false;
    this.isSecond = (options.isSecond === true);
  }

  update(data: View.RenderData, options: Runner.RenderOptions): void {
    const currentData = this.$runner.data('options');
    const defaultOptions: Runner.RenderOptions = {
      isHorizontal: true,
      displayValue: false,
      prefix: '',
      postfix: '',
    };
    const runnerOptions = {
      ...defaultOptions,
      ...currentData,
      ...options,
    };

    const runnerMetrics: DOMRect = this.$runner[0].getBoundingClientRect();
    const runnerWidth = runnerMetrics.width;
    let value: number;
    let percentage: string;
    if (Array.isArray(data.percentage) && Array.isArray(data.value)) {
      const [from, to] = data.value;
      const [fromPercentage, toPercentage] = data.percentage;
      let fromPosition: string;
      let toPosition: string;

      switch (fromPercentage) {
        case 0:
          fromPosition = `${fromPercentage}%`;
          break;
        case 100:
          fromPosition = `calc(100% - ${runnerWidth}px)`;
          break;
        default:
          fromPosition = `calc(${fromPercentage}% - ${runnerWidth / 2}px)`;
          break;
      }

      switch (toPercentage) {
        case 0:
          toPosition = `${toPercentage}%`;
          break;
        case 100:
          toPosition = `calc(100% - ${runnerWidth}px)`;
          break;
        default:
          toPosition = `calc(${toPercentage}%)`;
          break;
      }

      value = this.isSecond ? to : from;
      percentage = this.isSecond ? toPosition : fromPosition;
    }

    if (!Array.isArray(data.percentage) && !Array.isArray(data.value)) {
      value = data.value;
      percentage = `${data.percentage}%`;
    }

    this.$runner.data('options', runnerOptions);
    this.$runner.data('value', value);

    if (runnerOptions.isHorizontal && !this.$runner.hasClass('slider__runner_horizontal')) {
      this.$runner.addClass('slider__runner_horizontal');
    }
    if (!runnerOptions.isHorizontal && this.$runner.hasClass('slider__runner_horizontal')) {
      this.$runner.removeClass('slider__runner_horizontal');
    }

    if (options.isHorizontal) {
      this.$runner.css({ left: percentage });
    } else {
      this.$runner.css({ top: percentage });
    }

    if (this.isSecond) {
      this.$runner.addClass('runner_second');
    } else {
      this.$runner.addClass('runner_first');
    }

    if (!this.isRendered) {
      this.$view.append(this.$runner);
      this.attacheEventHandlers();
      this.isRendered = true;
    }
  }

  destroy(): void {
    this.$runner.off('mousedown.runner');
    this.$view.off('mousemove.runner');
    this.$runner.remove();
    this.isRendered = false;
  }

  private attacheEventHandlers(): void {
    this.$runner.on('mousedown.runner', this.dragStartHandler.bind(this));
    this.$runner.on('dragstart', false);
  }

  private dragStartHandler(event: JQuery.MouseDownEvent): void {
    const $startEvent = $.Event('startChanging.myMVPSlider');
    this.$view.trigger($startEvent);
    const runner = event.currentTarget;
    const renderOptions = $(runner).data('options');
    this.$runner.css('cursor', 'grabbing');

    const mouseMoveHandler = this.makeHandler(renderOptions);
    this.$view.on('mousemove.runner', mouseMoveHandler);
    document.onmouseup = (): void => {
      this.$view.off('mousemove.runner', mouseMoveHandler);
      this.$runner.css('cursor', 'grab');

      const $finishEvent = $.Event('finish.myMVPSlider');
      this.$view.trigger($finishEvent);

      document.onmouseup = null;
    };
  }

  private makeHandler(opts: Runner.RenderOptions): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    let moveCoord: number;
    let selectedVal: number;
    const view: HTMLElement = this.$view[0];
    const elemMetrics: DOMRect = view.getBoundingClientRect();

    const mouseMoveHandler = (e: JQuery.MouseMoveEvent): void => {
      if (opts.isHorizontal) {
        moveCoord = e.clientX - elemMetrics.x;
        selectedVal = (moveCoord / elemMetrics.width) * 100;
      } else {
        moveCoord = e.clientY - elemMetrics.y;
        selectedVal = (moveCoord / elemMetrics.height) * 100;
      }

      const $changeEvent = $.Event('changeValue.myMVPSlider');
      this.$view.trigger($changeEvent, [selectedVal, this.isSecond]);
    };

    return mouseMoveHandler;
  }

  static createRunner(): JQuery {
    const $runner = $('<div>', {
      class: 'js-slider__runner slider__runner',
    });

    return $runner;
  }
}

export default SliderRunner;
