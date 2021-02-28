import SliderModel from '../Model/model';
import SliderPresenter from '../Presenter/presenter';
import SliderView from '../View/view';

export default class SliderApp implements App {
  private initOptions: App.Option;
  private node: HTMLElement;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: App.Option, node: HTMLElement) {
    this.initOptions = options;
    this.node = node;

    this.model = new SliderModel(options);
    this.view = new SliderView(this.node, options);
    this.presenter = SliderApp.initPresenter(this.model, this.view, options);
  }

  update(options: App.Option): void {
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
    this.presenter.update(this.initOptions);
  }

  destroy(): void {
    this.view.destroy();
  }

  static initPresenter(model: Model, view: View, options: App.Option): Presenter {
    const {
      dataValues,
      onStart = (): void => {},
      onChange = (): void => {},
      onFinish = (): void => {},
      onUpdate = (): void => {},
    } = options;

    const presenter = new SliderPresenter({
      model,
      view,
      dataValues,
      onStart,
      onChange,
      onFinish,
      onUpdate,
    });

    return presenter;
  }
}
