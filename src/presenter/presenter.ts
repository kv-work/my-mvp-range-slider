import {
  OptionsModel,
  Observer,
  ViewData,
  View,
  Presenter,
  Model,
  OptionsPresenter,
  ApplicationOption,
  Stringable,
  PresenterData,
  ViewRenderData,
} from '../types';

export default class SliderPresenter implements Presenter {
  private view: View;
  private model: Model;
  private viewObserver: Observer;
  private modelObserver: Observer;
  private dataValues: Stringable[];
  private renderData: Stringable[];
  private callbacks: {
    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  };

  constructor(options: OptionsPresenter) {
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

    this.subscribeToModel();
    this.subscribeToView();
    this.renderView();
  }

  public update(options: ApplicationOption): void {
    const modelOptions: OptionsModel = {
      maxValue: options.maxValue,
      minValue: options.minValue,
      step: options.step,
      value: options.value,
      secondValue: options.secondValue,
    };

    const viewOptions: ViewData = {
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

    if (!SliderPresenter.isEmpty(modelOptions)) {
      this.model.updateState(modelOptions);
    }

    if (!SliderPresenter.isEmpty(viewOptions)) {
      this.view.update(viewOptions);
    }

    if (options.dataValues !== undefined && options.dataValues.length) {
      this.updateDataValues(options.dataValues);
      this.renderData = this.createDataValues();
      this.renderView();
    }

    this.callbacks.onUpdate();
  }

  public getAllData(): ApplicationOption {
    const data = {
      ...this.getModelData(),
      ...this.getViewData(),
      ...this.getPresenterData(),
    };
    return data;
  }

  public getModelData(): OptionsModel {
    return this.model.getState();
  }

  public getViewData(): ViewData {
    return this.view.getData();
  }

  public getPresenterData(): PresenterData {
    return {
      dataValues: this.dataValues,
      renderData: this.renderData,
    };
  }

  private createDataValues(data?: OptionsModel): Stringable[] {
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
        let values: [number, number];
        if (updatedModelState.secondValue !== undefined) {
          values = [updatedModelState.value, updatedModelState.secondValue];
        }
        this.renderView({
          data: this.renderData,
          value: values || updatedModelState.value,
        });
      },
    };
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    this.viewObserver = {
      start: (): void => {
        this.callbacks.onStart();
      },
      change: (values: [number, number] | number): void => {
        const convertedValues = this.convertPercentToValue(values);
        if (Array.isArray(convertedValues)) {
          const [newValue, newSecondValue] = convertedValues;
          this.model.updateState({ value: newValue, secondValue: newSecondValue });
        } else {
          this.model.updateState({ value: convertedValues });
        }

        this.callbacks.onChange();
      },
      finish: (values: [number, number] | number): void => {
        const convertedValues = this.convertPercentToValue(values);
        if (Array.isArray(convertedValues)) {
          const [newValue, newSecondValue] = convertedValues;
          this.model.updateState({ value: newValue, secondValue: newSecondValue });
        } else {
          this.model.updateState({ value: convertedValues });
        }

        this.callbacks.onFinish();
      },
    };
    this.view.addObserver(this.viewObserver);
  }

  private renderView(data?: ViewRenderData): void {
    let percentage: [number, number] | number;
    if (data) {
      percentage = this.convertValueToPercent(data.value);
      this.view.render({ ...data, percentage });
    } else {
      let values: [number, number];
      const currentValue = this.getModelData().value;
      if (this.getViewData().range) {
        const { secondValue } = this.getModelData();
        values = [currentValue, secondValue];
      }
      const value = values || currentValue;
      percentage = this.convertValueToPercent(value);
      const viewRenderData: ViewRenderData = {
        data: this.renderData,
        value,
        percentage,
      };
      this.view.render(viewRenderData);
    }
  }

  private updateDataValues(values: Stringable[]): void {
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

  private convertValueToPercent(values: [number, number] | number): [number, number] | number {
    const { minValue, maxValue } = this.getModelData();
    let firstPercantage: number;
    let secondPercantage: number;
    let percentage: [number, number] | number;

    if (Array.isArray(values)) {
      const [firstValue, secondValue] = values;
      firstPercantage = ((firstValue - minValue) * 100) / (maxValue - minValue);
      secondPercantage = ((secondValue - minValue) * 100) / (maxValue - minValue);
      percentage = [firstPercantage, secondPercantage];
    } else {
      percentage = ((values - minValue) * 100) / (maxValue - minValue);
    }

    return percentage;
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
