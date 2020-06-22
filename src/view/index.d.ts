declare interface View {
  render(renderData: View.RenderData): void;
  update(viewData: View.Options): void;
  addObserver(observer: View.Observer): void;
  removeObserver(observer: View.Observer): void;
  getData(): View.Options;
  destroy(): void;
}

declare namespace View {
  interface RenderData {
    data?: App.Stringable[];
    percentageData?: number[];
    value?: number | [number, number];
    percentage?: number | [number, number];
  }

  interface Options {
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

  interface Observer {
    update?(): void;
    start?(): void;
    change?(values: [number, number] | number): void;
    finish?(values: [number, number] | number): void;
  }

  interface SubViewObserver {
    start(): void;
    change(value: number): void;
    finish(value: number): void;
  }
}
