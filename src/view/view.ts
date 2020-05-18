/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/semi */
import $ from 'jquery';
import {
  View,
  ViewData,
  ViewRenderData,
  Observer,
} from '../types';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: ViewData;
  private $bar?: JQuery;
  private $runner?: JQuery;
  private $scale?: JQuery;
  private $secondRunner?: JQuery;

  constructor(container: HTMLElement, options: ViewData) {
    this.$container = $(container);
    this.viewOptions = options;

    if (options.bar) this.$bar = this.createBar();
    if (options.runner) this.$runner = this.createRunner();
    if (options.scale) this.$scale = this.createScale();
    if (options.range && options.scale) this.$secondRunner = this.createSecondRunner();
  }

  render(renderData: ViewRenderData): void {}

  update(viewData: ViewData): void {}

  addObserver(observer: Observer): void {}

  removeObserver(observer: Observer): void {}

  getData(): ViewData {
    return
  }

  private createBar(): JQuery {
    const $bar = $('<div>', {
      class: 'js-slider__bar',
    });

    return $bar
  }

  private createRunner(): JQuery {
    const $runner = $('<div>', {
      class: 'js-slider__runner',
    });

    return $runner
  }

  private createScale(): JQuery {
    const $scale = $('<div>', {
      class: 'js-slider__scale',
    });

    return $scale
  }

  private createSecondRunner(): JQuery {
    const $secondRunner = $('<div>', {
      class: 'js-slider__second_runner',
    });

    return $secondRunner
  }
}

export default SliderView;
