declare interface Presenter {
  update(options: App.Option): void;
  getAllData(): App.Option;
  getModelData(): Model.Options;
  getViewData(): View.Options;
  getPresenterData(): Presenter.Data;
}

declare namespace Presenter {
  interface Options {
    model: Model;
    view: View;
    dataValues?: App.Stringable[];
    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  }

  interface Data {
    dataValues: App.Stringable[];
    renderData: App.Stringable[];
  }
}
