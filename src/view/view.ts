import './view.css';
import SliderScale from '../scale/scale';
import SliderBar from '../bar/bar';
import SliderRunner from '../runner/runner';
import SliderValuesDisplay from '../values-display/values-display';

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
    this.$barContainer = $('<div>', { class: 'slider__bar_container' });
    this.$view.append(this.$barContainer);

    this.isRendered = false;
  }

  render(state: Model.State, userDataValues?: App.Stringable[]): void {
    this.renderData = this.createRenderData(state, userDataValues);

    if (this.viewOptions.isHorizontal && !this.$view.hasClass('slider__container_horizontal')) {
      this.$view.addClass('slider__container_horizontal');
      this.$barContainer.addClass('slider__bar_container_horizontal');
    }

    if (!this.viewOptions.isHorizontal && this.$view.hasClass('slider__container_horizontal')) {
      this.$view.removeClass('slider__container_horizontal');
      this.$barContainer.removeClass('slider__bar_container_horizontal');
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

    if (this.viewOptions.runner) {
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
    this.$view.on('startChanging.myMVPSlider', this.startChangingHandler.bind(this));
    this.$view.on('changeValue.myMVPSlider', this.changeValueHandler.bind(this));
    this.$view.on('finish.myMVPSlider', this.finishEventHandler.bind(this));

    this.$barContainer.on('dragstart', false);
  }

  private startChangingHandler(event: JQuery.Event, isDragStarted?: boolean): void {
    const startAction: {event: string; value?: [number, number] | number} = { event: 'start' };

    this.notify(startAction);

    if (this.renderData) {
      const startValue = this.renderData.percentage;

      if (isDragStarted && Array.isArray(startValue)) {
        const dragHandler = this.makeDragHandler(startValue);
        const dropHandler = this.makeDropHandler();
        this.$view.on('dragRange.myMVPSlider', dragHandler);
        this.$view.on('dropRange.myMVPSlider', dropHandler);
      }
    }
  }

  private makeDragHandler(start: [number, number]): (e: JQuery.Event, distance: number) => void {
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

  private makeDropHandler(): () => void {
    const dragHandler = (): void => {
      const finishAction: {event: string} = { event: 'finish' };
      this.notify(finishAction);

      this.$view.off('dragRange.myMVPSlider', false);
      this.$view.off('dropRange.myMVPSlider', false);
    };

    return dragHandler;
  }

  private changeValueHandler(event: JQuery.Event, value: number, isSecond: boolean): void {
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

  private finishEventHandler(): void {
    const finishAction: {event: string; value?: [number, number] | number} = { event: 'finish' };

    this.notify(finishAction);
  }

  private createRenderData(modelState: Model.State, userDataValues?: App.Stringable[]): View.RenderData {
    let value: [App.Stringable, App.Stringable] | App.Stringable;
    let percentage: [number, number] | number;
    const {
      value: from,
      secondValue: to,
    } = modelState;

    if (to !== undefined) {
      if (userDataValues && userDataValues.length > 0) {
        value = [userDataValues[from], userDataValues[to]];
      } else {
        value = [from, to];
      }
      percentage = [SliderView.convertValueToPercent(from, modelState), SliderView.convertValueToPercent(to, modelState)];
    } else {
      if (userDataValues && userDataValues.length > 0) {
        value = userDataValues[from];
      } else {
        value = from;
      }
      percentage = SliderView.convertValueToPercent(from, modelState);
    }

    const dataValues = this.createDataValues(modelState);
    const percentageData = SliderView.createPercentageData(dataValues, modelState);

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

    let resultNum: number = numOfScaleVal < total ? numOfScaleVal : total;

    if (resultNum <= 0) {
      resultNum = 0;
    }

    if (resultNum >= 10) {
      resultNum = 10;
    }

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

  static convertPercentToValue(percentage: [number, number] | number, modelState: Model.State): [number, number] | number {
    const { minValue, maxValue } = modelState;
    let value: number;
    let secondValue: number;
    let values: [number, number] | number;

    if (Array.isArray(percentage)) {
      const [firstPercent, secondPercent] = percentage;
      value = ((maxValue - minValue) / 100) * firstPercent + minValue;
      secondValue = ((maxValue - minValue) / 100) * secondPercent + minValue;
      values = [value, secondValue];
    } else {
      values = ((maxValue - minValue) / 100) * percentage + minValue;
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
