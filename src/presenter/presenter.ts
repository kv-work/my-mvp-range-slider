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

    this.viewObserver = {
      update: (value: number): void => {},
    };

    this.modelObserver = {
      update: (): void => {},
    };

    this.subscribeToModel();
    this.subscribeToView();
  }

  public update(options: ApplicationOption): void {}

  public getAllData(): ApplicationOption {
    return
  }

  public getModelData(): OptionsModel {
    return this.model.getState();
  }

  public getViewData(): ViewData {
    return
  }

  public getPresenterData(): OptionsPresenter {
    return
  }

  private subscribeToModel(): void {
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    this.view.addObserver(this.viewObserver);
  }

  private updateView(renderData: ViewData): void {}

  private updateModel(updateData: OptionsModel): void {}
}
