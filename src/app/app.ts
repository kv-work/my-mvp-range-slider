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

  setUserData(data: App.Stringable[]): void {
    if (data.length > 1) {
      this.presenter.setUserData(data);
    } else {
      this.reset();
    }
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
    return this.presenter.getPresenterData();
  }

  lockValues(values: string[] | 'all'): void {
    this.presenter.update({ lockedValues: values });
  }

  unlockValues(values: string[] | 'all'): void {
    this.presenter.update({ unlockValues: values });
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
