/* eslint-disable class-methods-use-this */
import $ from 'jquery';
import './view.css';
import SliderScale from '../scale/scale';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: View.Options;
  private renderData?: View.RenderData;
  private $view?: JQuery;
  private $bar?: JQuery;
  private $runner?: JQuery;
  private scale: Scale;
  private $secondRunner?: JQuery;
  private observers: Set<View.Observer>;
  private scaleObserver: Scale.Observer;
  private isRendered: boolean;

  constructor(container: HTMLElement, options: View.Options) {
    this.$container = $(container);
    this.viewOptions = options;
    this.observers = new Set();

    this.$view = this.createSliderContainer();
    if (this.viewOptions.scale) {
      this.createScaleObserver();
      this.scale = new SliderScale({
        $viewContainer: this.$view,
        observer: this.scaleObserver,
      });
    }

    if (options.bar) this.$bar = this.createBar();
    if (options.runner) this.$runner = this.createRunner();

    if (options.range) this.$secondRunner = this.createSecondRunner();

    this.isRendered = false;
  }

  render(renderData: View.RenderData): void {
    if (this.isRendered) {
      this.$container.empty();
      this.isRendered = false;
    }

    this.renderData = renderData;

    if (this.viewOptions.bar) {
      this.renderBar();
      this.$view.append(this.$bar);
    }
    if (this.viewOptions.runner) {
      this.renderRunner();
      this.$view.append(this.$runner);
    }
    if (this.viewOptions.range) {
      this.$view.append(this.$secondRunner);
    }

    if (this.viewOptions.scale) this.scale.render(renderData, this.viewOptions);

    this.attachEventHandlers();
    this.$container.append(this.$view);

    this.isRendered = true;
  }

  update(viewData: View.Options): void {
    const state = {
      ...this.viewOptions,
      ...this.validateData(viewData),
    };

    this.viewOptions = state;

    if (this.renderData) {
      this.render(this.renderData);
    }
  }

  addObserver(observer: View.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: View.Observer): void {
    this.observers.delete(observer);
  }

  getData(): View.Options {
    return this.viewOptions;
  }

  private createBar(): JQuery {
    let classList = 'js-slider__bar slider__bar';
    if (this.viewOptions.isHorizontal) {
      classList += ' slider__bar_horizontal';
    } else {
      classList += ' slider__bar_vertical';
    }

    const $bar = $('<div>', {
      class: classList,
    });

    return $bar;
  }

  private renderBar(): void {
    let direction: string;
    const color = '#53B6A8';
    if (this.viewOptions.isHorizontal) {
      direction = 'to right';
    } else {
      direction = 'to bottom';
    }

    if (Array.isArray(this.renderData.percentage)) {
      const [value, secondValue] = this.renderData.percentage;
      this.$bar.css({
        background: `linear-gradient(${direction}, #E5E5E5 ${value}%, ${color} ${value}%, ${color} ${secondValue}%, #E5E5E5 ${secondValue}%)`,
      });
    } else {
      this.$bar.css({
        background: `linear-gradient(${direction}, ${color} ${this.renderData.percentage}%, #E5E5E5 ${this.renderData.percentage}%)`,
      });
    }
  }

  private createRunner(): JQuery {
    const $runner = $('<div>', {
      class: 'js-slider__runner slider__runner',
    });

    return $runner;
  }

  private renderRunner(): void {
    let position: number;
    const runnerMetrics: DOMRect = this.$runner[0].getBoundingClientRect();
    const viewMetrics: DOMRect = this.$view[0].getBoundingClientRect();
    if (Array.isArray(this.renderData.percentage)) {
      const [percentage] = this.renderData.percentage;
      position = viewMetrics.width * (percentage / 100) - runnerMetrics.width / 2;
    } else {
      position = viewMetrics.width * (this.renderData.percentage / 100) - runnerMetrics.width / 2;
    }
    if (position <= 0) position = 0;
    if (this.viewOptions.isHorizontal) {
      if (position >= (viewMetrics.width - runnerMetrics.width)) {
        position = viewMetrics.width - runnerMetrics.width;
      }
      this.$runner.css('left', `${position}px`);
    } else {
      if (position >= (viewMetrics.height - runnerMetrics.width)) {
        position = viewMetrics.height - runnerMetrics.width;
      }
      this.$runner.css('top', `${position}px`);
    }
  }

  private createScaleObserver(): void {
    this.scaleObserver = {
      start(value: number): void {
        const action = { event: 'start', value };
        this.notify(action);
      },
      change(value: number): void {
        const action = { event: 'change', value };
        this.notify(action);
      },
      finish(value: number): void {
        const action = { event: 'finish', value };
        this.notify(action);
      },
    };
  }

  private createSecondRunner(): JQuery {
    const $secondRunner = $('<div>', {
      class: 'js-slider__second_runner',
    });

    return $secondRunner;
  }

  private createSliderContainer(): JQuery {
    const $view: JQuery = $('<div>', {
      class: 'js-slider__container slider__container',
    });

    return $view;
  }

  private notify(action: {event: string; value?: [number, number] | number}): void {
    switch (action.event) {
      case 'start':
        this.observers.forEach((observer) => {
          observer.start();
        });
        break;
      case 'change':
        this.observers.forEach((observer) => {
          observer.change(action.value);
        });
        break;
      case 'finish':
        this.observers.forEach((observer) => {
          observer.finish(action.value);
        });
        break;
      default:
        this.observers.forEach((observer) => {
          observer.update();
        });
        break;
    }
  }

  private attachEventHandlers(): void {
    if (this.$bar) {
      this.$bar.on('click', this.clickHandler.bind(this));
    }
    if (this.$runner) {
      this.$runner.on('mousedown', this.dragStartHandler.bind(this));
      this.$runner.on('dragstart', false);
    }
  }

  private clickHandler(event: JQuery.MouseDownEvent): void {
    let clickCoord: number;
    let selectedVal: number;
    const elem: HTMLElement = event.currentTarget;
    const elemMetrics: DOMRect = elem.getBoundingClientRect();
    if (this.viewOptions.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };
    this.notify(startAction);

    const changeAction: {event: string; value: [number, number] | number} = { event: 'change', value: selectedVal };
    this.notify(changeAction);

    const finishAction: {event: string; value: [number, number] | number} = { event: 'finish', value: selectedVal };
    this.notify(finishAction);
  }

  private dragStartHandler(): void {
    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };
    this.notify(startAction);
    // const runner = event.currentTarget;
    this.$runner.css('cursor', 'grabbing');

    const mouseMoveHandler = this.makeMouseMoveHandler();
    this.$container.on('mousemove', mouseMoveHandler);
  }

  private makeMouseMoveHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    let moveCoord: number;
    let selectedVal: number;
    const view: HTMLElement = this.$view[0];
    const elemMetrics: DOMRect = view.getBoundingClientRect();

    const mouseMoveHandler = (e: JQuery.MouseMoveEvent): void => {
      if (this.viewOptions.isHorizontal) {
        moveCoord = e.clientX - elemMetrics.x;
        selectedVal = (moveCoord / elemMetrics.width) * 100;
      } else {
        moveCoord = e.clientY - elemMetrics.y;
        selectedVal = (moveCoord / elemMetrics.height) * 100;
      }

      const changeAction: {event: string; value: [number, number] | number} = { event: 'change', value: selectedVal };
      this.notify(changeAction);

      document.onmouseup = (): void => {
        this.$container.off('mousemove', mouseMoveHandler);
        this.$runner.css('cursor', 'grab');

        const finishAction: {event: string; value: [number, number] | number} = { event: 'finish', value: selectedVal };
        this.notify(finishAction);

        document.onmouseup = null;
      };
    };

    return mouseMoveHandler;
  }

  private validateData(data: View.Options): View.Options {
    const dataEntries = Object.entries(data);
    const validData = dataEntries.map((entry): [string, unknown] => {
      const key: string = entry[0];
      switch (key) {
        case 'isHorizontal':
        case 'range':
        case 'dragInterval':
        case 'runner':
        case 'bar':
        case 'scale':
        case 'displayScaleValue':
        case 'displayValue':
        case 'displayMin':
        case 'displayMax':
          if (typeof entry[1] === 'boolean') {
            return entry;
          }
          break;
        case 'scaleStep':
          if (SliderView.isValidStep(entry[1])) {
            return entry;
          }
          break;
        case 'prefix':
        case 'postfix':
          if (typeof entry[1] === 'string') {
            return entry;
          }
          break;
        default:
          return entry;
      }
      return [key, this.viewOptions[key]];
    });

    const resultData: View.Options = validData.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    return resultData;
  }

  static isValidStep(value: string | boolean | number): boolean {
    if (typeof value === 'number') {
      return Number.isFinite(value) && (value > 0);
    }
    return false;
  }
}

export default SliderView;
