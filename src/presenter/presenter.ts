import {
  OptionsModel,
  Observer,
  ViewData,
  View,
  Presenter,
  Model,
  OptionsPresenter,
} from '../types';


export default class SliderPresenter implements Presenter {
  private view: View;
  private model: Model;
  private viewObserver: Observer;
  private modelObserver: Observer;

  constructor(options: OptionsPresenter) {
    this.model = options.model;
    this.view = options.view;

    this.viewObserver = {
      update: (value: number): void => {},
    };

    this.modelObserver = {
      update: (): void => {},
    };

    this.sentModelObserver();
    this.sentViewObserver();
  }

  private getModelData(): OptionsModel {
    return this.model.getState();
  }

  private sentModelObserver(): void {
    this.model.addObserver(this.modelObserver);
  }

  private sentViewObserver(): void {
    this.view.addObserver(this.viewObserver);
  }

  public updateView(renderData: ViewData): void {}

  public unmountView(): void {}

  public updateModel(updateData: OptionsModel): void {}
}
