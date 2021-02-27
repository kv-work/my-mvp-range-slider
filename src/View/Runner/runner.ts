import './runner.css';

class SliderRunner implements Runner {
  private $view: JQuery;
  private $barContainer: JQuery;
  private $runner: JQuery;
  private isRendered: boolean;
  private isSecond: boolean;

  constructor(options: Runner.InitOptions) {
    this.$barContainer = options.$barContainer;
    this.$view = options.$viewContainer;
    this.$runner = SliderRunner.createRunner();
    this.isRendered = false;
    this.isSecond = (options.isSecond === true);
  }

  update(opts: Runner.UpdateOptions): void {
    const { data, options } = opts;
    const currentData = this.$runner.data('options');
    const defaultOptions: Runner.RenderOptions = { isHorizontal: true };
    const runnerOptions = {
      ...defaultOptions,
      ...currentData,
      ...options,
    };

    if (runnerOptions.isHorizontal && !this.$runner.hasClass('slider__runner_horizontal')) {
      this.$runner.addClass('slider__runner_horizontal');
    }
    if (!runnerOptions.isHorizontal && this.$runner.hasClass('slider__runner_horizontal')) {
      this.$runner.removeClass('slider__runner_horizontal');
    }

    if (this.isSecond) {
      this.$runner.addClass('runner_second');
    } else {
      this.$runner.addClass('runner_first');
    }

    if (!this.isRendered) {
      this.$barContainer.append(this.$runner);
      this.attacheEventHandlers();
      this.isRendered = true;
    }

    const runnerMetrics: DOMRect = this.$runner[0].getBoundingClientRect();
    const runnerWidth = runnerMetrics.width;
    let value: App.Stringable;
    let percentage: string;

    if (Array.isArray(data.percentage)) {
      const [fromPercentage, toPercentage] = data.percentage;
      const fromPosition = `calc(${fromPercentage}% - ${runnerWidth / 2}px)`;
      const toPosition = `calc(${toPercentage}% - ${runnerWidth / 2}px)`;

      percentage = this.isSecond ? toPosition : fromPosition;
    } else {
      percentage = `calc(${data.percentage}% - ${runnerWidth / 2}px)`;
    }

    if (Array.isArray(data.value)) {
      const [from, to] = data.value;

      value = this.isSecond ? to : from;
    } else {
      value = data.value;
    }

    this.$runner.data('options', runnerOptions);
    this.$runner.data('value', value);

    if (options.isHorizontal) {
      this.$runner.css('top', '');
      this.$runner.css({ left: percentage });
    } else {
      this.$runner.css('left', '');
      this.$runner.css({ top: percentage });
    }
  }

  destroy(): void {
    this.$runner.off('mousedown');
    this.$runner.remove();
    this.isRendered = false;
  }

  private attacheEventHandlers(): void {
    this.$runner.on('mousedown', this.handleRunnerMouseDown.bind(this));
    this.$runner.on('dragstart', false);
  }

  private handleRunnerMouseDown(event: JQuery.MouseDownEvent): void {
    const $startEvent = $.Event('startChanging.myMVPSlider');
    this.$view.trigger($startEvent);
    const runner = event.currentTarget;
    const renderOptions = $(runner).data('options');

    const handleViewMouseMove = this.makeViewMouseMoveHandler(renderOptions);
    this.$view.on('mousemove', handleViewMouseMove);
    document.onmouseup = (): void => {
      this.$view.off('mousemove', handleViewMouseMove);

      const $finishEvent = $.Event('finish.myMVPSlider');
      this.$view.trigger($finishEvent);

      document.onmouseup = null;
    };
  }

  private makeViewMouseMoveHandler(opts: Runner.RenderOptions): (e: JQuery.MouseMoveEvent) => void {
    let moveCoord: number;
    let selectedVal: number;
    const bar = this.$barContainer[0];
    const elemMetrics = bar.getBoundingClientRect();

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
