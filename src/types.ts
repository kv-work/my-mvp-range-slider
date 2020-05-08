interface Observer {
  update(value?: number): void;
}

interface Presenter {
  renderView(view: View, renderData: ViewData): void;
  unmountView(view: View): void;
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
};
