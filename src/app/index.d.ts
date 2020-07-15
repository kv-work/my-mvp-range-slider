declare interface App {
  update(options: App.Option): void;
  getAllData(): App.Option;
  getModelData(): Model.Options;
  getViewData(): View.Options;
  getPresenterData(): Presenter.Data;
  reset(): void;
  destroy(): void;
}

declare namespace App {
  interface Option {
    // model
    maxValue?: number;
    minValue?: number;
    step?: number;
    value?: number;
    secondValue?: number;

    // view
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
    runner?: boolean;
    bar?: boolean;
    scale?: boolean;
    scaleStep?: number;
    displayScaleStrips?: boolean;
    displayScaleValue?: boolean;
    displayValue?: boolean;
    displayMin?: boolean;
    displayMax?: boolean;
    prefix?: string;
    postfix?: string;

    // presenter
    dataValues?: Stringable[];

    // callbacks
    onStart?: CallableFunction;
    onChange?: CallableFunction;
    onFinish?: CallableFunction;
    onUpdate?: CallableFunction;
  }

  interface Stringable {
    toString(): string;
  }
}
