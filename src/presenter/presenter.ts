import Model from "../model/model";
import { OptionsModel, Observer, ViewData, View } from '../types';


export default class Presenter {
  private views: Set<View>
  private model: Model
  private viewObserver: Observer
  private modelObserver: Observer

  constructor(model: Model, ...views: Array<View>) {
    this.model = model;
    this.views = new Set(views)

    this.viewObserver = {
      update: (value: number) => {}
    }

    this.modelObserver = {
      update: () => {}
    }
  }

  private getModelData(): void {}

  private sentModelObserver(model: Model, observer: Observer): void {}

  private sentViewObserver(view: View, observer: Observer): void {}

  private updateView(view: View, updateData: ViewData): void {}

  public renderView(view: View, renderData: ViewData): void {}

  public updateModel(model: Model, updateData: OptionsModel): void {}
}