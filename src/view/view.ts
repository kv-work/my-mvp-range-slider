import './view.css';
import SliderScale from '../scale/scale';
import SliderBar from '../bar/bar';
import SliderRunner from '../runner/runner';
import SliderValuesDisplay from '../values-display/values-display';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: View.Options;
  private renderData?: View.RenderData;
  private $view?: JQuery;
  private $barContainer: JQuery;
  private runner?: Runner;
  private secondRunner?: Runner;
  private bar?: Bar;
  private scale?: Scale;
  private valueDisplay: ValuesDisplay;
  private observers: Set<View.Observer>;
  private isRendered: boolean;

  constructor(container: HTMLElement, options: View.Options) {
    this.$container = $(container);
    this.viewOptions = options;
    this.observers = new Set();
    this.$view = this.createView();
    this.$barContainer = $('<div>', { class: 'slider__bar_container' });
    this.$view.append(this.$barContainer);

    this.isRendered = false;
  }

  render(renderData: View.RenderData): void {
    this.renderData = renderData;

    if (this.viewOptions.isHorizontal && !this.$view.hasClass('slider__container_horizontal')) {
      this.$view.addClass('slider__container_horizontal');
      this.$barContainer.addClass('slider__bar_container_horizontal');
    }

    if (!this.viewOptions.isHorizontal && this.$view.hasClass('slider__container_horizontal')) {
      this.$view.removeClass('slider__container_horizontal');
      this.$barContainer.removeClass('slider__bar_container_horizontal');
    }

    if (!this.isRendered) {
      this.attachEventHandlers();
      this.$container.append(this.$view);
      this.isRendered = true;
    }

    this.updateValuesDisplay(renderData);
    this.updateScale(renderData);
    this.updateBar(renderData.percentage);
    this.updateRunners(renderData);
  }

  update(viewData: View.Options): void {
    const state = {
      ...this.viewOptions,
      ...this.validateData(viewData),
    };

    this.viewOptions = state;
    this.$view.data('options', state);
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

  destroy(): void {
    if (this.bar) this.bar.destroy();
    if (this.scale) this.scale.destroy();
    if (this.runner) this.runner.destroy();
    if (this.secondRunner) this.secondRunner.destroy();
    if (this.valueDisplay) this.valueDisplay.destroy();

    this.$view.remove();
    this.isRendered = false;
  }

  private createView(): JQuery {
    const { viewOptions } = this;
    const $view: JQuery = $('<div>', {
      class: 'js-slider__container slider__container',
    });

    $view.data('options', viewOptions);

    return $view;
  }

  private updateBar(percentage: number | [number, number]): void {
    if (this.viewOptions.bar && this.bar) {
      this.bar.update({
        data: percentage,
        options: this.viewOptions,
      });
    }
    if (this.viewOptions.bar && !this.bar) {
      this.bar = new SliderBar({
        $viewContainer: this.$view,
        $barContainer: this.$barContainer,
      });
      this.bar.update({
        data: percentage,
        options: this.viewOptions,
      });
    }
    if (!this.viewOptions.bar && this.bar) {
      this.bar.destroy();
    }
  }

  private updateScale(renderData: View.RenderData): void {
    if (this.viewOptions.scale && this.scale) {
      this.scale.update({
        data: renderData,
        options: this.viewOptions,
      });
    }
    if (this.viewOptions.scale && !this.scale) {
      this.scale = new SliderScale({ $viewContainer: this.$view });
      this.scale.update({
        data: renderData,
        options: this.viewOptions,
      });
    }
    if (!this.viewOptions.scale && this.scale) {
      this.scale.destroy();
    }
  }

  private updateValuesDisplay(renderData: View.RenderData): void {
    if (this.viewOptions.displayValue && this.valueDisplay) {
      this.valueDisplay.update(renderData, this.viewOptions);
    }
    if (this.viewOptions.displayValue && !this.valueDisplay) {
      this.valueDisplay = new SliderValuesDisplay({ $viewContainer: this.$view });
      this.valueDisplay.update(renderData, this.viewOptions);
    }
    if (!this.viewOptions.displayValue && this.valueDisplay) {
      this.valueDisplay.destroy();
      this.valueDisplay = null;
    }
  }

  private updateRunners(renderData: View.RenderData): void {
    if (this.viewOptions.runner) {
      if (Array.isArray(renderData.value)) {
        if (this.runner) {
          this.runner.update(renderData, this.viewOptions);
        } else {
          this.runner = new SliderRunner({
            $viewContainer: this.$view,
            $barContainer: this.$barContainer,
            isSecond: false,
          });
          this.runner.update(renderData, this.viewOptions);
        }
        if (this.secondRunner) {
          this.secondRunner.update(renderData, this.viewOptions);
        } else {
          this.secondRunner = new SliderRunner({
            $viewContainer: this.$view,
            $barContainer: this.$barContainer,
            isSecond: true,
          });
          this.secondRunner.update(renderData, this.viewOptions);
        }
      } else if (this.runner) {
        this.runner.update(renderData, this.viewOptions);
      } else {
        this.runner = new SliderRunner({
          $viewContainer: this.$view,
          $barContainer: this.$barContainer,
          isSecond: false,
        });
        this.runner.update(renderData, this.viewOptions);
      }
    } else {
      if (this.runner) {
        this.runner.destroy();
      }
      if (this.secondRunner) {
        this.secondRunner.destroy();
      }
    }
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
          observer.finish();
        });
        break;
      default:
        break;
    }
  }

  private attachEventHandlers(): void {
    this.$view.bind('startChanging.myMVPSlider', this.startChangingHandler.bind(this));
    this.$view.bind('changeValue.myMVPSlider', this.changeValueHandler.bind(this));
    this.$view.bind('finish.myMVPSlider', this.finishEventHandler.bind(this));
  }

  private startChangingHandler(event: JQuery.Event, isDragStarted?: boolean): void {
    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };

    this.notify(startAction);

    const startValue = this.renderData.percentage;

    if (isDragStarted && Array.isArray(startValue)) {
      const dragHandler = this.makeDragHandler(startValue);
      const dropHandler = this.makeDropHandler();
      this.$view.bind('dragRange.myMVPSlider', dragHandler);
      this.$view.bind('dropRange.myMVPSlider', dropHandler);
    }
  }

  private makeDragHandler(start: [number, number]): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const dragHandler = (event: JQuery.Event, dragDistance: number): void => {
      const valuesDiff = start[1] - start[0];
      let newVal = start[0] + dragDistance;
      let newSecondVal = start[1] + dragDistance;

      if (newVal < 0) {
        newVal = 0;
        newSecondVal = newVal + valuesDiff;
      }

      if (newSecondVal > 100) {
        newSecondVal = 100;
        newVal = newSecondVal - valuesDiff;
      }

      const changeAction: {event: string; value: [number, number]} = { event: 'change', value: [newVal, newSecondVal] };
      this.notify(changeAction);
    };

    return dragHandler;
  }

  private makeDropHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const dragHandler = (): void => {
      const finishAction: {event: string} = { event: 'finish' };
      this.notify(finishAction);

      this.$view.unbind('dragRange.myMVPSlider', false);
      this.$view.unbind('dropRange.myMVPSlider', false);
    };

    return dragHandler;
  }

  private changeValueHandler(event: JQuery.Event, value: number, isSecond: boolean): void {
    const currentValue = this.renderData.percentage;
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

  private finishEventHandler(): void {
    const finishAction: {event: string; value?: [number, number] | number} = { event: 'finish' };

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
        case 'numOfScaleVal':
          if (SliderView.isValidNumOfValue(entry[1])) {
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
          return undefined;
      }
      return [key, this.viewOptions[key]];
    });

    const resultData: View.Options = validData.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
    return resultData;
  }

  static isValidNumOfValue(value: string | boolean | number): boolean {
    if (typeof value === 'number') {
      return Number.isFinite(value) && (value >= 0) && (value <= 10);
    }
    return false;
  }
}

export default SliderView;
