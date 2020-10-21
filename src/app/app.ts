import SliderModel from '../Model/model';
import SliderPresenter from '../Presenter/presenter';
import SliderView from '../View/view';

export default class SliderApp implements App {
  private options: App.Option;
  private initOptions: App.Option;
  private node: HTMLElement;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: App.Option, node: HTMLElement) {
    this.initOptions = options;
    this.options = options;
    this.node = node;

    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
      dataValues,
      onStart = (): void => {},
      onChange = (): void => {},
      onFinish = (): void => {},
      onUpdate = (): void => {},
    } = options;

    this.model = new SliderModel({
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    });


    this.view = new SliderView(this.node, options);

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

  getModelData(): Model.State {
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
    this.presenter.update(this.initOptions);
  }

  destroy(): void {
    this.view.destroy();
  }
}
