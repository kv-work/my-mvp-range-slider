import SliderModel from '../model/model';
import SliderPresenter from '../presenter/presenter';
import SliderView from '../view/view';

export default class SliderApp implements App {
  private options: App.Option;
  private initOptions: App.Option;
  private node: HTMLElement;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: App.Option, node: HTMLElement) {
    this.initOptions = options;
    this.node = node;

    this.createModel();
    this.createView();
    this.createPresenter();
  }

  update(options: App.Option): void {
    this.options = {
      ...this.initOptions,
      ...this.options,
      ...options,
    };
    this.presenter.update(options);
  }

  getAllData(): App.Option {
    return this.presenter.getAllData();
  }

  getModelData(): Model.Options {
    return this.presenter.getModelData();
  }

  getViewData(): View.Options {
    return this.presenter.getViewData();
  }

  getPresenterData(): Presenter.Data {
    return this.presenter.getPresenterData();
  }

  reset(): void {
    this.options = this.initOptions;
    this.update(this.initOptions);
  }

  destroy(): void {
    this.view.destroy();
  }

  private createModel(): void {
    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    } = this.initOptions;

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
    } = this.initOptions;

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
      displayScaleValue,
      displayValue,
      numOfScaleVal,
      displayMin,
      displayMax,
      prefix,
      postfix,
    } = this.initOptions;

    this.view = new SliderView(this.node, {
      isHorizontal,
      range,
      dragInterval,
      runner,
      bar,
      scale,
      displayScaleValue,
      displayValue,
      numOfScaleVal,
      displayMin,
      displayMax,
      prefix,
      postfix,
    });
  }
}
