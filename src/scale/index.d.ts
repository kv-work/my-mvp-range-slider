declare interface Scale {
  render(data: View.RenderData, options: Scale.RenderOptions): void;
  destroy(): void;
}

declare namespace Scale {
  interface Options {
    $viewContainer: JQuery;
    observer: Scale.Observer;
  }

  interface Observer {
    start(value: number): void;
    change(value: number): void;
    finish(value: number): void;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    scaleStep?: number;
    displayScaleValue?: boolean;
    displayMin?: boolean;
    displayMax?: boolean;
  }
}
