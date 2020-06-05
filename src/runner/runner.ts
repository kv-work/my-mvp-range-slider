/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import $ from 'jquery';

class SliderRunner implements Runner {
  private $view: JQuery;
  private $runner: JQuery;
  private isRendered: boolean;

  constructor(options: Runner.InitOptions) {
    this.$view = options.$viewContainer;
    this.isRendered = false;
  }

  render(data: number, options: Runner.RenderOptions): void {
    this.$runner = SliderRunner.createRunner(data, options);

    if (options.isHorizontal) {
      this.$runner.css({ left: data });
    } else {
      this.$runner.css({ top: data });
    }

    if (this.isRendered) {
      this.$view.find('.js-slider__runner').replaceWith(this.$runner);
    } else {
      this.$view.append(this.$runner);
      this.isRendered = true;
    }
  }

  destroy(): void {}

  static createRunner(data: number, options: Runner.RenderOptions): JQuery {
    const $runner = $('<div>', {
      class: 'js-slider__runner slider__runner',
    });

    const runnerOptions = $.extend({
      isHorizontal: true,
      displayValue: false,
      prefix: '',
      postfix: '',
    }, options);

    $runner.data('options', runnerOptions);

    if (runnerOptions.isHorizontal) {
      $runner.addClass('slider__runner_horizontal');
    }

    return $runner;
  }
}

export default SliderRunner;
