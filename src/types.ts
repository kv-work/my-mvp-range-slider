interface ApplicationOption {
  // model
  maxValue: number;
  minValue: number;
  step: number;
  value: number;
  secondValue: number;

  // view
  orientation: 'horizontal' | 'vertical';
  range: boolean;
  dragInterval: boolean;
  runner: boolean;
  bar: boolean;
  scale: boolean;
  scaleStep: number;
  displayScaleValue: boolean;
  displayValue: boolean;
  displayMin: boolean;
  displayMax: boolean;
  prefix: string;
  postfix: string;

  // presenter
  dataValues: Stringable[];

  // callbacks
  onStart: CallableFunction;
  onChange: CallableFunction;
  onFinish: CallableFunction;
  onUpdate: CallableFunction;
}

interface Observer {
  update(value?: number): void;
}

interface OptionsPresenter {
  model: Model;
  view: View;
  dataValues?: Stringable[];
  onStart: CallableFunction;
  onChange: CallableFunction;
  onFinish: CallableFunction;
  onUpdate: CallableFunction;
}

interface Presenter {
  updateView(renderData: ViewData): void;
  unmountView(): void;
  updateModel(updateData: OptionsModel): void;
}

interface OptionsModel {
  maxValue?: number;
  minValue?: number;
  step?: number;
  value?: number;
  secondValue?: number;
}

interface Model {
  value: number;
  maxValue: number;
  minValue: number;
  step: number;
  getState(): OptionsModel;
  updateState(state: OptionsModel): void;
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
}

interface ViewData {
  value: number;
  step: number;
  interval: [number, number];
}

interface View {
  render(viewData: ViewData): void;
  update(viewData: ViewData): void;
  unmount(): void;
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
}

interface Stringable {
  toString(): string;
}

export {
  OptionsModel,
  Model,
  Observer,
  ViewData,
  View,
  Presenter,
  OptionsPresenter,
};
