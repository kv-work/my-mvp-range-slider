/* eslint-disable no-useless-return */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
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

    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
    } else {
      this.dataValues = [];
    }

    this.renderData = this.createDataValues();

    this.callbacks = {
      onStart: options.onStart,
      onChange: options.onChange,
      onFinish: options.onFinish,
      onUpdate: options.onUpdate,
    }

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
      orientation: options.orientation,
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

    this.model.updateState(modelOptions);
    this.view.update(viewOptions);

    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
      this.renderData = this.createDataValues();
    }

    this.callbacks.onUpdate();
  }

  public getAllData(): ApplicationOption {
    const data = {
      ...this.getModelData(),
      ...this.getViewData(),
      ...this.getPresenterData(),
    }
    return data
  }

  public getModelData(): OptionsModel {
    return this.model.getState();
  }

  public getViewData(): ViewData {
    return this.view.getData()
  }

  public getPresenterData(): PresenterData {
    return {
      dataValues: this.dataValues,
      renderData: this.renderData,
    }
  }

  private createDataValues(): Stringable[] {
    if (this.dataValues.length > 0) {
      return this.dataValues;
    }

    const {
      minValue: min,
      maxValue: max,
      step,
    } = this.model.getState();

    const dataValues: number[] = [];

    for (let i: number = min; i <= max; i += step) {
      dataValues.push(i);
    }

    if (dataValues[-1] < max) {
      dataValues.push(max);
    }

    return dataValues;
  }

  private subscribeToModel(): void {
    // need to implement the observer update func
    this.modelObserver = {
      update: (): void => {
        const newModelData = this.getModelData();
      },
    };
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    // need to implement the observer update func
    this.viewObserver = {
      update: (value: number): void => {},
    };
    this.view.addObserver(this.viewObserver);
  }

  private renderView(): void {
    this.view.render(this.renderData);
  }

  private updateViewValue(dataValues: Stringable[]): void {}
}
