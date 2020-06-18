import $ from 'jquery';
import './view.css';
import SliderScale from '../scale/scale';
import SliderBar from '../bar/bar';
import SliderRunner from '../runner/runner';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: View.Options;
  private renderData?: View.RenderData;
  private $view?: JQuery;
  private runner?: Runner;
  private secondRunner?: Runner;
  private bar: Bar;
  private scale: Scale;
  private observers: Set<View.Observer>;
  private isRendered: boolean;

  constructor(container: HTMLElement, options: View.Options) {
    this.$container = $(container);
    this.viewOptions = options;
    this.observers = new Set();
    this.$view = this.createView();

    this.isRendered = false;
  }

  private createView(): JQuery {
    const { viewOptions } = this;
    const $view: JQuery = $('<div>', {
      class: 'js-slider__container slider__container',
    });

    $view.data('options', viewOptions);

    if (viewOptions.bar) {
      this.bar = new SliderBar({ $viewContainer: $view });
    }

    if (viewOptions.scale) {
      this.scale = new SliderScale({ $viewContainer: $view });
    }

    if (viewOptions.runner) {
      this.runner = new SliderRunner({
        $viewContainer: this.$view,
        isSecond: false,
      });
    }

    if (viewOptions.range && viewOptions.runner) {
      this.secondRunner = new SliderRunner({
        $viewContainer: this.$view,
        isSecond: true,
      });
    }

    return $view;
  }

  render(renderData: View.RenderData): void {
    this.renderData = renderData;

    if (this.viewOptions.bar) {
      this.bar.update({
        data: renderData.percentage,
        options: this.viewOptions,
      });
    }
    if (this.viewOptions.scale) {
      this.scale.update({
        data: renderData,
        options: this.viewOptions,
      });
    }
    if (this.viewOptions.runner) {
      this.runner.update(renderData, this.viewOptions);
    }
    if (this.viewOptions.range && this.secondRunner) {
      this.secondRunner.update(renderData, this.viewOptions);
    }

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
    this.$view.data('options', state);

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
    this.$view.bind('startChanging.myMVPSlider', this.startChangingHandler.bind(this));
    this.$view.bind('changeValue.myMVPSlider', this.changeValueHandler.bind(this));
    this.$view.bind('finish.myMVPSlider', this.finishEventHandler.bind(this));
  }

  private startChangingHandler(): void {
    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };

    this.notify(startAction);
  }

  private changeValueHandler(event: JQuery.Event, value: number, isSecond: boolean): void {
    const currentValue = this.renderData.value;
    let changeAction: {event: string; value: [number, number] | number};
    if (isSecond && Array.isArray(currentValue)) {
      changeAction = { event: 'change', value: [currentValue[0], value] };
    } else if (Array.isArray(currentValue)) {
      changeAction = { event: 'change', value: [value, currentValue[1]] };
    } else {
      changeAction = { event: 'change', value };
    }
    this.notify(changeAction);
  }

  private finishEventHandler(event: JQuery.Event, value: number, isSecond: boolean): void {
    const currentValue = this.renderData.value;
    let finishAction: {event: string; value: [number, number] | number};
    if (isSecond && Array.isArray(currentValue)) {
      finishAction = { event: 'finish', value: [currentValue[0], value] };
    } else if (Array.isArray(currentValue)) {
      finishAction = { event: 'finish', value: [value, currentValue[1]] };
    } else {
      finishAction = { event: 'finish', value };
    }
    this.notify(finishAction);
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

  static createSliderContainer(options: View.Options): JQuery {
    const $view: JQuery = $('<div>', {
      class: 'js-slider__container slider__container',
    });

    $view.data('options', options);

    return $view;
  }
}

export default SliderView;
