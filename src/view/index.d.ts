declare interface View {
  render(state: Model.State, userDataValues?: App.Stringable[]): void;
  update(viewData: View.Options): void;
  addObserver(observer: View.Observer): void;
  removeObserver(observer: View.Observer): void;
  getData(): View.Options;
  destroy(): void;
}

declare namespace View {
  interface RenderData {
    data: App.Stringable[];
    percentageData: number[];
    value: App.Stringable | [App.Stringable, App.Stringable];
    percentage: number | [number, number];
  }

  interface Options {
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
    runner?: boolean;
    bar?: boolean;
    scale?: boolean;
    displayScaleValue?: boolean;
    displayValue?: boolean;
    numOfScaleVal?: number;
    displayMin?: boolean;
    displayMax?: boolean;
    prefix?: string;
    postfix?: string;
  }

  interface Observer {
    update(): void;
    start(): void;
    change(values: [number, number] | number): void;
    finish(): void;
  }
}
