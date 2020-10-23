declare interface Presenter {
  update(options: App.Option): void;
  getPresenterData(): Presenter.Data;
  setUserData(data: App.Stringable[]): void;
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
  }
}
