interface ApplicationOption {
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

interface Observer {
  update?(): void;
  start?(values: [number, number] | number): void;
  change?(values: [number, number] | number): void;
  finish?(values: [number, number] | number): void;
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
  update(options: ApplicationOption): void;
  getAllData(): ApplicationOption;
  getModelData(): OptionsModel;
  getViewData(): ViewData;
  getPresenterData(): PresenterData;
}

interface PresenterData {
  dataValues: Stringable[];
  renderData: Stringable[];
}

interface OptionsModel {
  maxValue?: number;
  minValue?: number;
  step?: number;
  value?: number;
  secondValue?: number;
}

interface Model {
  getState(): OptionsModel;
  updateState(state: OptionsModel): void;
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  lockState(props: string[] | 'all'): void;
  unlockState(props: string[] | 'all'): void;
}

interface ViewData {
  isHorizontal?: boolean;
  range?: boolean;
  dragInterval?: boolean;
  runner?: boolean;
  bar?: boolean;
  scale?: boolean;
  scaleStep?: number;
  displayScaleValue?: boolean;
  displayValue?: boolean;
  displayMin?: boolean;
  displayMax?: boolean;
  prefix?: string;
  postfix?: string;
}

interface View {
  render(renderData: ViewRenderData): void;
  update(viewData: ViewData): void;
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  getData(): ViewData;
}

interface ViewRenderData {
  data?: Stringable[];
  value?: number;
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
  ApplicationOption,
  Stringable,
  PresenterData,
  ViewRenderData,
};
