import {
  OptionsModel,
  Observer,
  ViewData,
  View,
  Presenter,
  Model,
} from '../types';


export default class SliderPresenter implements Presenter {
  private views: Set<View>;
  private model: Model;
  private viewObserver: Observer;
  private modelObserver: Observer;

  constructor(model: Model, ...views: Array<View>) {
    this.model = model;
    this.views = new Set(views);

    this.viewObserver = {
      update: (value: number): void => {},
    };

    this.modelObserver = {
      update: (): void => {},
    };

    this.sentModelObserver();
    this.views.forEach((view: View) => {
      SliderPresenter.sentViewObserver(view, this.viewObserver);
    });
  }

  private getModelData(): OptionsModel {
    return this.model.getState();
  }

  private sentModelObserver(): void {
    this.model.addObserver(this.modelObserver);
  }

  static sentViewObserver(view: View, observer: Observer): void {
    view.addObserver(observer);
  }

  private updateView(view: View, updateData: ViewData): void {}

  public renderView(view: View, renderData: ViewData): void {}

  public unmountView(view: View): void {}

  public updateModel(updateData: OptionsModel): void {}
}
