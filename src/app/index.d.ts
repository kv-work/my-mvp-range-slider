declare interface App {
  update(options: App.Option): void;
  getAllData(): App.Option;
  getModelData(): Model.Options;
  getViewData(): View.Options;
  getPresenterData(): Presenter.Data;
  lockValues(values: string[] | 'all'): void;
  unlockValues(values: string[] | 'all'): void;
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
    lockedValues?: string[] | 'all';
    unlockValues?: string[] | 'all';

    // view
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
    runner?: boolean;
    bar?: boolean;
    scale?: boolean;
    displayScaleValue?: boolean;
    numOfScaleVal?: number;
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
