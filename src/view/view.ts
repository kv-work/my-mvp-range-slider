/* eslint-disable class-methods-use-this */
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
  private renderData?: ViewRenderData;
  private $view?: JQuery;
  private $bar?: JQuery;
  private $runner?: JQuery;
  private $scale?: JQuery;
  private $secondRunner?: JQuery;
  private observers: Set<Observer>;

  constructor(container: HTMLElement, options: ViewData) {
    this.$container = $(container);
    this.viewOptions = options;
    this.observers = new Set();

    if (options.bar) this.$bar = this.createBar();
    if (options.runner) this.$runner = this.createRunner();
    if (options.scale) this.$scale = this.createScale();
    if (options.range && options.scale) this.$secondRunner = this.createSecondRunner();
  }

  render(renderData: ViewRenderData): void {
    this.renderData = renderData;

    if (!this.$view) {
      this.$view = this.createSliderContainer();

      this.$container.append(this.$view);
    }
  }

  update(viewData: ViewData): void {
    const state = {
      ...this.viewOptions,
      ...this.validateData(viewData),
    };

    this.viewOptions = state;

    if (this.renderData) {
      this.render(this.renderData);
    }
  }

  addObserver(observer: Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Observer): void {
    this.observers.delete(observer);
  }

  getData(): ViewData {
    return this.viewOptions;
  }

  private createBar(): JQuery {
    let classList = 'js-slider__bar';
    if (this.viewOptions.isHorizontal) {
      classList += ' slider__bar_horizontal';
    }

    const $bar = $('<div>', {
      class: classList,
    });

    return $bar;
  }

  private createRunner(): JQuery {
    const $runner = $('<div>', {
      class: 'js-slider__runner',
    });

    return $runner;
  }

  private createScale(): JQuery {
    let classList = 'js-slider__scale';
    if (this.viewOptions.isHorizontal) {
      classList += ' slider__scale_horizontal';
    }

    const $scale = $('<div>', {
      class: classList,
    });

    return $scale;
  }

  private createSecondRunner(): JQuery {
    const $secondRunner = $('<div>', {
      class: 'js-slider__second_runner',
    });

    return $secondRunner;
  }

  private createSliderContainer(): JQuery {
    const { viewOptions } = this;
    const $view: JQuery = $('<div>', {
      class: 'js-slider__container',
    });

    if (viewOptions.bar) {
      $view.append(this.$bar);
      this.attachEventHandlers(this.$bar);
    }
    if (viewOptions.runner) {
      $view.append(this.$runner);
      this.attachEventHandlers(this.$runner);
    }
    if (viewOptions.scale) $view.append(this.$scale);
    if (this.$secondRunner) $view.append(this.$secondRunner);

    return $view;
  }

  private notify(action: {event: string; value: [number, number] | number}): void {
    switch (action.event) {
      case 'start':
        this.observers.forEach((observer) => {
          observer.start(action.value);
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

  private attachEventHandlers($elem: JQuery): void {
    $elem.on('mousedown', this.dragStartHandler.bind(this));
    $elem.on('dragstart', false);
  }

  private dragStartHandler(event: JQuery.MouseDownEvent): void {
    let clickCoord: number;
    let selectedVal: number;
    const element: HTMLElement = this.$view[0];
    const elemMetrics: DOMRect = element.getBoundingClientRect();
    if (this.viewOptions.isHorizontal) {
      clickCoord = event.clientX - elemMetrics.x;
      selectedVal = (clickCoord / elemMetrics.width) * 100;
    } else {
      clickCoord = event.clientY - elemMetrics.y;
      selectedVal = (clickCoord / elemMetrics.height) * 100;
    }

    const startAction: {event: string; value: [number, number] | number} = { event: 'start', value: selectedVal };
    this.notify(startAction);

    const makeMouseMoveHandler = (): JQuery.EventHandler<HTMLElement, JQuery.Event> => {
      let moveCoord: number;

      return (e: JQuery.MouseMoveEvent): void => {
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
          this.$container.unbind('mousemove', false);

          const finishAction: {event: string; value: [number, number] | number} = { event: 'finish', value: selectedVal };
          this.notify(finishAction);

          document.onmouseup = null;
        };
      };
    };

    this.$container.bind('mousemove', makeMouseMoveHandler());
  }

  private validateData(data: ViewData): ViewData {
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

    const resultData: ViewData = validData.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
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
