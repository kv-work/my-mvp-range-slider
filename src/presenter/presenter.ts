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
} from '../types';

export default class SliderPresenter implements Presenter {
  private view: View;
  private model: Model;
  private viewObserver: Observer;
  private modelObserver: Observer;
  private dataValues: Stringable[] | undefined;

  constructor(options: OptionsPresenter) {
    this.model = options.model;
    this.view = options.view;

    if (options.dataValues !== undefined) {
      this.dataValues = options.dataValues;
    } else {
      this.dataValues = this.createDataValues();
    }

    this.subscribeToModel();
    this.subscribeToView();
    this.renderView();
  }

  public update(options: ApplicationOption): void {}

  public getAllData(): ApplicationOption {
    const data = {
      ...this.getModelData(),
      ...this.getViewData(),
      dataValues: this.getPresenterData(),
    }
    return data
  }

  public getModelData(): OptionsModel {
    return this.model.getState();
  }

  public getViewData(): ViewData {
    return this.view.getData()
  }

  public getPresenterData(): Stringable[] {
    return this.dataValues;
  }

  private createDataValues(): number[] {
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
    this.view.render(this.dataValues);
  }

  private updateView(viewData: ViewData): void {}

  private updateViewValue(dataValues: Stringable[]): void {}

  private updateModel(updateData: OptionsModel): void {}
}
