import SliderModel from '../model/model';

class SliderPresenter implements Presenter {
  private view: View;
  private model: Model;
  private viewObserver: View.Observer;
  private modelObserver: Model.Observer;
  private dataValues: App.Stringable[];
  private renderData: App.Stringable[];
  private isChanging: boolean;
  private callbacks: {
    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  };

  constructor(options: Presenter.Options) {
    this.model = options.model;
    this.view = options.view;

    if (options.dataValues !== undefined && options.dataValues.length) {
      this.updateDataValues(options.dataValues);
    } else {
      this.dataValues = [];
    }

    this.renderData = this.createDataValues();

    this.callbacks = {
      onStart: options.onStart,
      onChange: options.onChange,
      onFinish: options.onFinish,
      onUpdate: options.onUpdate,
    };

    this.isChanging = false;

    this.subscribeToModel();
    this.subscribeToView();
    this.renderView();
  }

  update(options: App.Option): void {
    const modelOptions: Model.Options = {
      maxValue: options.maxValue,
      minValue: options.minValue,
      step: options.step,
      value: options.value,
    };

    if (Object.prototype.hasOwnProperty.call(options, 'secondValue')) {
      modelOptions.secondValue = options.secondValue;
    }

    const viewOptions: View.Options = {
      isHorizontal: options.isHorizontal,
      range: options.range,
      dragInterval: options.dragInterval,
      runner: options.runner,
      bar: options.bar,
      scale: options.scale,
      scaleStep: options.scaleStep,
      displayScaleValue: options.displayScaleValue,
      displayValue: options.displayValue,
      displayMin: options.displayMin,
      displayMax: options.displayMax,
      prefix: options.prefix,
      postfix: options.postfix,
    };

    if (!SliderPresenter.isEmpty(viewOptions)) {
      this.view.update(viewOptions);
    }

    if (!SliderPresenter.isEmpty(modelOptions) || Object.prototype.hasOwnProperty.call(options, 'secondValue')) {
      this.model.updateState(modelOptions);
    }

    this.callbacks.onUpdate();
  }

  getAllData(): App.Option {
    const data = {
      ...this.getModelData(),
      ...this.getViewData(),
      ...this.getPresenterData(),
    };
    return data;
  }

  getModelData(): Model.Options {
    return this.model.getState();
  }

  getViewData(): View.Options {
    return this.view.getData();
  }

  getPresenterData(): Presenter.Data {
    return {
      dataValues: this.dataValues,
      renderData: this.renderData,
    };
  }

  setUserData(data: App.Stringable[] | Model.Options): void {
    if (Array.isArray(data) && data.length > 0) {
      this.updateDataValues(data);
      this.renderData = this.createDataValues();
    } else if (!Array.isArray(data) && SliderModel.validateInitOptions(data)) {
      this.dataValues = [];
      this.model.unlockState(['maxValue', 'minValue', 'step']);

      if (Object.prototype.hasOwnProperty.call(data, 'lockedValues')) {
        this.model.lockState(data.lockedValues);
      }

      this.model.updateState(data);
    }
  }

  private createDataValues(data?: Model.Options): App.Stringable[] {
    if (this.dataValues.length > 0) {
      return this.dataValues;
    }

    const {
      minValue: min,
      maxValue: max,
      step,
    } = data || this.model.getState();

    const values: number[] = [];

    for (let i: number = min; i <= max; i += step) {
      values.push(i);
    }

    if (values[values.length - 1] < max) {
      values.push(max);
    }

    return values;
  }

  private subscribeToModel(): void {
    this.modelObserver = {
      update: (): void => {
        const updatedModelState = this.getModelData();
        this.renderData = this.createDataValues(updatedModelState);
        if (this.isChanging) {
          this.callbacks.onChange(updatedModelState);
        }
        this.renderView();
      },
    };
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    this.viewObserver = {
      start: (): void => {
        this.callbacks.onStart(this.getModelData());
      },
      change: (values: [number, number] | number): void => {
        this.isChanging = true;
        const convertedValues = this.convertPercentToValue(values);
        if (Array.isArray(convertedValues)) {
          const [newValue, newSecondValue] = convertedValues;
          this.model.updateState({ value: newValue, secondValue: newSecondValue });
        } else {
          this.model.updateState({ value: convertedValues });
        }
      },
      finish: (values: [number, number] | number): void => {
        const convertedValues = this.convertPercentToValue(values);
        this.isChanging = false;
        if (Array.isArray(convertedValues)) {
          const [newValue, newSecondValue] = convertedValues;
          this.model.updateState({ value: newValue, secondValue: newSecondValue });
        } else {
          this.model.updateState({ value: convertedValues });
        }

        this.callbacks.onFinish(this.getModelData());
      },
    };
    this.view.addObserver(this.viewObserver);
  }

  private renderView(): void {
    let values: [number, number];
    const currentValue = this.getModelData().value;
    if (this.getViewData().range) {
      const { secondValue } = this.getModelData();
      values = [currentValue, secondValue];
    }
    const value = values || currentValue;
    const percentage: [number, number] | number = this.convertValueToPercent(value);
    const percentageData = this.createPercentageData();
    const viewRenderData: View.RenderData = {
      data: this.renderData,
      percentageData,
      value,
      percentage,
    };
    this.view.render(viewRenderData);
  }

  private updateDataValues(values: App.Stringable[]): void {
    this.dataValues = values;
    this.model.updateState({
      maxValue: values.length - 1,
      minValue: 0,
      step: 1,
    });
    this.model.lockState(['maxValue', 'minValue', 'step']);
  }

  private convertPercentToValue(percentage: [number, number] | number): [number, number] | number {
    const { minValue, maxValue } = this.getModelData();
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

  private convertValueToPercent(values: [number, number] | number): number | [number, number] {
    const { minValue, maxValue } = this.getModelData();
    let firstPercentage: number;
    let secondPercentage: number;
    let percentage: [number, number] | number;

    if (Array.isArray(values)) {
      const [firstValue, secondValue] = values;
      firstPercentage = ((firstValue - minValue) / (maxValue - minValue)) * 100;
      secondPercentage = ((secondValue - minValue) / (maxValue - minValue)) * 100;
      percentage = [firstPercentage, secondPercentage];
    } else {
      percentage = ((values - minValue) / (maxValue - minValue)) * 100;
    }

    return percentage;
  }

  private createPercentageData(): number[] {
    const {
      minValue: min,
      maxValue: max,
      step,
    } = this.model.getState();

    const values: number[] = [];

    for (let i: number = min; i <= max; i += step) {
      values.push(i);
    }

    if (values[values.length - 1] < max) {
      values.push(max);
    }

    const percentageData = values.map((val): number => {
      const percentage = ((val - min) / (max - min)) * 100;
      return +percentage.toFixed(10);
    });

    return percentageData;
  }

  static isEmpty(object: {}): boolean {
    const entries = Object.entries(object);
    let isEmpty = true;

    entries.forEach((entry) => {
      if (entry[1] !== undefined) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }
}

export default SliderPresenter;
