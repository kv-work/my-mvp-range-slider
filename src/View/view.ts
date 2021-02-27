import './view.css';
import SliderScale from './Scale/scale';
import SliderBar from './Bar/bar';
import SliderRunner from './Runner/runner';
import SliderValuesDisplay from './Values-display/values-display';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: View.Options;
  private renderData?: View.RenderData;
  private $view: JQuery;
  private $barContainer: JQuery;
  private runner?: Runner;
  private secondRunner?: Runner;
  private bar?: Bar;
  private scale?: Scale;
  private valueDisplay?: ValuesDisplay;
  private observers: Set<View.Observer>;
  private isRendered: boolean;

  constructor(container: HTMLElement, options: View.Options) {
    this.$container = $(container);
    this.viewOptions = options;
    this.observers = new Set();
    this.$view = this.createView();
    this.$barContainer = $('<div>', { class: 'js-slider__bar-container slider__bar-container' });
    this.$view.append(this.$barContainer);

    this.isRendered = false;
  }

  render(state: Model.State, userDataValues?: App.Stringable[]): void {
    this.renderData = this.createRenderData(state, userDataValues);

    if (this.viewOptions.isHorizontal && !this.$view.hasClass('slider__container_horizontal')) {
      this.$view.addClass('slider__container_horizontal');
      this.$barContainer.addClass('slider__bar-container_horizontal');
    }

    if (!this.viewOptions.isHorizontal && this.$view.hasClass('slider__container_horizontal')) {
      this.$view.removeClass('slider__container_horizontal');
      this.$barContainer.removeClass('slider__bar-container_horizontal');
    }

    if (!this.isRendered) {
      this.$container.append(this.$view);
      this.attachEventHandlers();
      this.isRendered = true;
    }

    this.updateValuesDisplay(this.renderData);
    this.updateScale(this.renderData);
    this.updateBar(this.renderData.percentage);
    this.updateRunners(this.renderData);
  }

  update(viewData: View.Options): void {
    const validData = SliderView.validateData(viewData);
    const state = $.extend({}, this.viewOptions, validData);

    this.viewOptions = state;
    this.$view.data('options', state);

    this.notify({ event: 'update' });
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
    if (this.bar) {
      this.bar.destroy();
      this.bar = undefined;
    }
    if (this.scale) {
      this.scale.destroy();
      this.scale = undefined;
    }
    if (this.runner) {
      this.runner.destroy();
      this.runner = undefined;
    }
    if (this.secondRunner) {
      this.secondRunner.destroy();
      this.secondRunner = undefined;
    }
    if (this.valueDisplay) {
      this.valueDisplay.destroy();
      this.valueDisplay = undefined;
    }

    this.$view.remove();
    this.isRendered = false;
  }

  private createView(): JQuery {
    const { viewOptions } = this;
    const $view = $('<div>', {
      class: 'js-slider__container slider__container',
    });

    $view.data('options', viewOptions);

    return $view;
  }

  private updateBar(percentage: number | [number, number]): void {
    if (this.viewOptions.hasBar) {
      this.bar = this.bar || new SliderBar({
        $viewContainer: this.$view,
        $barContainer: this.$barContainer,
      });

      this.bar.update({ data: percentage, options: this.viewOptions });
    } else {
      this.bar?.destroy();
    }
  }

  private updateScale(renderData: View.RenderData): void {
    if (this.viewOptions.hasScale) {
      this.scale = this.scale || new SliderScale({ $viewContainer: this.$view });

      this.scale.update({ data: renderData, options: this.viewOptions });
    } else {
      this.scale?.destroy();
    }
  }

  private updateValuesDisplay(renderData: View.RenderData): void {
    const updData: ValuesDisplay.UpdateOptions = {
      data: renderData,
      options: this.viewOptions,
    };
    if (this.viewOptions.displayValue && this.valueDisplay) {
      this.valueDisplay.update(updData);
    }
    if (this.viewOptions.displayValue && !this.valueDisplay) {
      this.valueDisplay = new SliderValuesDisplay({ $viewContainer: this.$view });
      this.valueDisplay.update(updData);
    }
    if (!this.viewOptions.displayValue && this.valueDisplay) {
      this.valueDisplay.destroy();
      this.valueDisplay = undefined;
    }
  }

  private updateRunners(renderData: View.RenderData): void {
    const updData: Runner.UpdateOptions = {
      data: renderData,
      options: this.viewOptions,
    };

    if (this.viewOptions.hasRunner) {
      if (Array.isArray(renderData.value)) {
        if (this.runner) {
          this.runner.update(updData);
        } else {
          this.runner = new SliderRunner({
            $viewContainer: this.$view,
            $barContainer: this.$barContainer,
            isSecond: false,
          });
          this.runner.update(updData);
        }
        if (this.secondRunner) {
          this.secondRunner.update(updData);
        } else {
          this.secondRunner = new SliderRunner({
            $viewContainer: this.$view,
            $barContainer: this.$barContainer,
            isSecond: true,
          });
          this.secondRunner.update(updData);
        }
      } else {
        if (this.runner) {
          this.runner.update(updData);
        } else {
          this.runner = new SliderRunner({
            $viewContainer: this.$view,
            $barContainer: this.$barContainer,
            isSecond: false,
          });
          this.runner.update(updData);
        }

        if (this.secondRunner) {
          this.secondRunner.destroy();
          this.secondRunner = undefined;
        }
      }
    } else {
      if (this.runner) {
        this.runner.destroy();
        this.runner = undefined;
      }
      if (this.secondRunner) {
        this.secondRunner.destroy();
        this.runner = undefined;
      }
    }
  }

  private notify(action: {event: string; value?: [number, number] | number}): void {
    if (this.observers.size > 0) {
      switch (action.event) {
        case 'start':
          this.observers.forEach((observer) => {
            observer.start();
          });
          break;
        case 'change':
          this.observers.forEach((observer) => {
            if (action.value !== undefined) {
              observer.change(action.value);
            }
          });
          break;
        case 'finish':
          this.observers.forEach((observer) => {
            observer.finish();
          });
          break;
        case 'update':
          this.observers.forEach((observer) => {
            observer.update();
          });
          break;
        default:
          break;
      }
    }
  }

  private attachEventHandlers(): void {
    this.$view.on('startChanging.myMVPSlider', this.handleViewStartChanging.bind(this));
    this.$view.on('changeValue.myMVPSlider', this.handleViewChangeValue.bind(this));
    this.$view.on('finish.myMVPSlider', this.handleViewFinish.bind(this));

    this.$barContainer.on('dragstart', false);
  }

  private handleViewStartChanging(event: JQuery.Event, isDragStarted?: boolean): void {
    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };

    this.notify(startAction);

    if (this.renderData) {
      const startValue = this.renderData.percentage;

      if (isDragStarted && Array.isArray(startValue)) {
        const handleViewDragRange = this.makeRangeDragHandler(startValue);
        const handleViewDropRange = this.makeRangeDropHandler();
        this.$view.on('dragRange.myMVPSlider', handleViewDragRange);
        this.$view.on('dropRange.myMVPSlider', handleViewDropRange);
      }
    }
  }

  private makeRangeDragHandler(start: [number, number]):
  (e: JQuery.Event, distance: number) => void {
    const dragHandler = (_: JQuery.Event, dragDistance: number): void => {
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

  private makeRangeDropHandler(): () => void {
    const dragHandler = (): void => {
      const finishAction: {event: string} = { event: 'finish' };
      this.notify(finishAction);

      this.$view.off('dragRange.myMVPSlider', false);
      this.$view.off('dropRange.myMVPSlider', false);
    };

    return dragHandler;
  }

  private handleViewChangeValue(event: JQuery.Event, value: number, isSecond: boolean): void {
    if (this.renderData) {
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
  }

  private handleViewFinish(): void {
    const finishAction: {event: string; value?: [number, number] | number} = { event: 'finish' };

    this.notify(finishAction);
  }

  private createRenderData(state: Model.State, userDataValues?: App.Stringable[]): View.RenderData {
    let value: [App.Stringable, App.Stringable] | App.Stringable;
    let percentage: [number, number] | number;
    const {
      value: from,
      secondValue: to,
    } = state;

    if (to !== undefined) {
      if (userDataValues && userDataValues.length > 0) {
        value = [userDataValues[from], userDataValues[to]];
      } else {
        value = [from, to];
      }
      const fromPercentage = SliderView.convertValueToPercent(from, state);
      const toPercentage = SliderView.convertValueToPercent(to, state);
      percentage = [fromPercentage, toPercentage];
    } else {
      if (userDataValues && userDataValues.length > 0) {
        value = userDataValues[from];
      } else {
        value = from;
      }
      percentage = SliderView.convertValueToPercent(from, state);
    }

    const dataValues = this.createDataValues(state);
    const percentageData = SliderView.createPercentageData(dataValues, state);

    let data: App.Stringable[];

    if (userDataValues && userDataValues.length) {
      data = dataValues.map((val) => userDataValues[val]);
    } else {
      data = dataValues;
    }

    const viewRenderData: View.RenderData = {
      data,
      percentageData,
      value,
      percentage,
    };

    return viewRenderData;
  }

  private createDataValues(data: Model.State): number[] {
    const {
      minValue: min,
      maxValue: max,
      step,
    } = data;

    const {
      displayMax = true,
      displayMin = true,
      numOfScaleVal = 10,
    } = this.viewOptions;

    const values: number[] = [];

    if (displayMin) {
      values.push(min);
    }

    let total: number;
    const num = (max - min) / step;

    if (num % 1 === 0) {
      total = num - 1;
    } else {
      total = Math.floor(num);
    }

    const resultNum = numOfScaleVal < total ? numOfScaleVal : total;

    if (resultNum === total) {
      for (let i = 1; i <= total; i += 1) {
        const elem = min + step * i;
        values.push(SliderView.fixVal(elem, step));
      }
    } else {
      const s = (max - min) / (resultNum + 1);
      for (let i = 1; i <= resultNum; i += 1) {
        const elem = min + s * i;
        let multipleElem: number;
        if ((elem - min) % step > step / 2) {
          multipleElem = elem - ((elem - min) % step) + step;
        } else {
          multipleElem = elem - ((elem - min) % step);
        }
        values.push(SliderView.fixVal(multipleElem, step));
      }
    }

    if (displayMax) {
      values.push(max);
    }

    return values;
  }

  static createPercentageData(data: number[], modelState: Model.State): number[] {
    const {
      minValue: min,
      maxValue: max,
      step,
    } = modelState;

    const baseValue = step / (max - min);

    const percentageData = data.map((val): number => {
      const percentage = ((val - min) / (max - min)) * 100;
      return SliderView.fixVal(percentage, baseValue);
    });

    return percentageData;
  }

  static convertValueToPercent(values: number, modelState: Model.State): number {
    const { minValue, maxValue, step } = modelState;
    const baseValue = step / (maxValue - minValue);
    const percentage = ((values - minValue) / (maxValue - minValue)) * 100;
    return SliderView.fixVal(percentage, baseValue);
  }

  static validateData(data: View.Options): View.Options {
    const dataEntries = Object.entries(data);
    const validDataEntries = dataEntries.map((entry): [string, unknown] => {
      const key: string = entry[0];
      switch (key) {
        case 'isHorizontal':
        case 'isRange':
        case 'isDragInterval':
        case 'hasRunner':
        case 'hasBar':
        case 'hasScale':
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
          break;
      }
      return [key, undefined];
    });

    const resultData = validDataEntries.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    return resultData;
  }

  static isValidNumOfValue(value: string | boolean | number): boolean {
    if (typeof value === 'number') {
      return Number.isFinite(value) && (value >= 0) && (value <= 10);
    }
    return false;
  }

  static fixVal(value: number, baseVal: number): number {
    if (!(baseVal % 1)) {
      return +value.toFixed(0);
    }

    if (baseVal.toString().includes('e')) {
      const base = +`${baseVal}`.split('e-')[1];
      return +value.toFixed(base);
    }

    const base = `${baseVal}`.split('.')[1].length;
    return +value.toFixed(base);
  }
}

export default SliderView;
