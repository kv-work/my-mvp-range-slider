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

    this.renderData = this.createRenderData(state, userDataValues);

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
    if (this.viewOptions.displayValue) {
      this.valueDisplay = this.valueDisplay
      || new SliderValuesDisplay({ $viewContainer: this.$view });
      this.valueDisplay.update(updData);
    } else {
      this.valueDisplay?.destroy();
    }
  }

  private updateRunners(renderData: View.RenderData): void {
    if (!this.viewOptions.hasRunner) {
      if (this.runner) {
        this.runner.destroy();
        this.runner = undefined;
      }
      if (this.secondRunner) {
        this.secondRunner.destroy();
        this.runner = undefined;
      }

      return;
    }

    const updData: Runner.UpdateOptions = {
      data: renderData,
      options: this.viewOptions,
    };

    this.runner = this.runner || new SliderRunner({
      $viewContainer: this.$view,
      $barContainer: this.$barContainer,
      isSecond: false,
    });
    this.runner.update(updData);

    if (Array.isArray(renderData.value)) {
      this.secondRunner = this.secondRunner || new SliderRunner({
        $viewContainer: this.$view,
        $barContainer: this.$barContainer,
        isSecond: true,
      });
      this.secondRunner.update(updData);
    } else if (this.secondRunner) {
      this.secondRunner.destroy();
      this.secondRunner = undefined;
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
    const startAction = { event: 'start' };

    this.notify(startAction);

    const startValue = this.renderData?.percentage;

    if (isDragStarted && Array.isArray(startValue)) {
      const handleViewDragRange = this.makeRangeDragHandler(startValue);
      const handleViewDropRange = this.makeRangeDropHandler();
      this.$view.on('dragRange.myMVPSlider', handleViewDragRange);
      this.$view.on('dropRange.myMVPSlider', handleViewDropRange);
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
      const finishAction = { event: 'finish' };
      this.notify(finishAction);

      this.$view.off('dragRange.myMVPSlider', false);
      this.$view.off('dropRange.myMVPSlider', false);
    };

    return dragHandler;
  }

  private handleViewChangeValue(_: JQuery.Event, value: number, isSecond: boolean): void {
    if (this.renderData) {
      const currValue = this.renderData.percentage;
      let changeAction: {event: string; value: [number, number] | number};

      if (Array.isArray(currValue)) {
        const newVal: [number, number] = isSecond ? [currValue[0], value] : [value, currValue[1]];
        changeAction = { event: 'change', value: newVal };
      } else {
        changeAction = { event: 'change', value };
      }

      this.notify(changeAction);
    }
  }

  private handleViewFinish(): void {
    const finishAction = { event: 'finish' };

    this.notify(finishAction);
  }

  private createRenderData(state: Model.State, userDataValues?: App.Stringable[]): View.RenderData {
    let percentage: [number, number] | number;
    const {
      value: from,
      secondValue: to,
    } = state;

    const hasSecondVal = to !== null;

    if (hasSecondVal) {
      const fromPercentage = SliderView.convertValueToPercent(from, state);
      const toPercentage = SliderView.convertValueToPercent(Number(to), state);
      percentage = [fromPercentage, toPercentage];
    } else {
      percentage = SliderView.convertValueToPercent(from, state);
    }

    const dataValues = this.createDataValues(state);
    const percentageData = SliderView.createPercentageData(dataValues, state);

    let value: [App.Stringable, App.Stringable] | App.Stringable;
    let data: App.Stringable[];

    if (userDataValues && userDataValues.length) {
      value = hasSecondVal
        ? [userDataValues[from], userDataValues[Number(to)]]
        : userDataValues[from];
      data = dataValues.map((val) => userDataValues[val]);
    } else {
      value = hasSecondVal ? [from, to] : from;
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

    const num = (max - min) / step;
    const total = (num % 1 === 0) ? num - 1 : Math.floor(num);

    if (numOfScaleVal >= total) {
      for (let i = 1; i <= total; i += 1) {
        const elem = min + step * i;
        values.push(SliderView.fixVal(elem, step));
      }
    } else {
      const s = (max - min) / (numOfScaleVal + 1);
      for (let i = 1; i <= numOfScaleVal; i += 1) {
        const elem = min + s * i;
        const multipleElem = ((elem - min) % step > step / 2)
          ? elem - ((elem - min) % step) + step
          : elem - ((elem - min) % step);

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
    const validDataEntries = dataEntries.filter((entry): boolean => {
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
          return (typeof entry[1] === 'boolean');
        case 'numOfScaleVal':
          return (SliderView.isValidNumOfValue(entry[1]));
        case 'prefix':
        case 'postfix':
          return (typeof entry[1] === 'string');
        default:
          return false;
      }
    });

    const resultData = validDataEntries.reduce((result, [key, value]) => (
      {
        ...result,
        [key]: value,
      }), {});

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
      return Number(value.toFixed(0));
    }

    const baseString = baseVal.toString();
    if (baseString.includes('e')) {
      const base = Number(baseString.split('e-')[1]);
      const fixBase = base > 20 ? 20 : base;
      return Number(value.toFixed(fixBase));
    }

    const base = baseString.split('.')[1].length;
    const fixBase = base > 20 ? 20 : base;
    return Number(value.toFixed(fixBase));
  }
}

export default SliderView;
