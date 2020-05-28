/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-extra-semi */
import SliderModel from '../model/model';
import SliderPresenter from '../presenter/presenter';
import SliderView from '../view/view';

export default class SliderApp implements App {
  private options: App.Option;
  private node: HTMLElement;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: App.Option, node: HTMLElement) {
    this.options = options;
    this.node = node;

    this.createModel();
    this.createView();
    this.createPresenter();
  }

  public update(options: App.Option): void {};

  public getAllData(): App.Option {
    return;
  }

  public getModelData(): Model.Options {
    return;
  }

  public getViewData(): View.Options {
    return;
  }

  public getPresenterData(): Presenter.Data {
    return;
  }

  public reset(): void {}

  public destroy(): void {}

  private createModel(): void {
    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    } = this.options;

    this.model = new SliderModel({
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    });
  }

  private createPresenter(): void {
    const {
      dataValues,
      onStart,
      onChange,
      onFinish,
      onUpdate,
    } = this.options;

    this.presenter = new SliderPresenter({
      model: this.model,
      view: this.view,
      dataValues,
      onStart,
      onChange,
      onFinish,
      onUpdate,
    });
  }

  private createView(): void {
    const {
      isHorizontal,
      range,
      dragInterval,
      runner,
      bar,
      scale,
      scaleStep,
      displayScaleValue,
      displayValue,
      displayMin,
      displayMax,
      prefix,
      postfix,
    } = this.options;

    this.view = new SliderView(this.node, {
      isHorizontal,
      range,
      dragInterval,
      runner,
      bar,
      scale,
      scaleStep,
      displayScaleValue,
      displayValue,
      displayMin,
      displayMax,
      prefix,
      postfix,
    });
  }
}
