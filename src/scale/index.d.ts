declare interface Scale {
  render(data: View.RenderData, options: Scale.RenderOptions): void;
  destroy(): void;
}

declare namespace Scale {
  interface Options {
    $viewContainer: JQuery;
    observer: View.SubViewObserver;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    scaleStep?: number;
    displayScaleValue?: boolean;
    displayMin?: boolean;
    displayMax?: boolean;
  }
}
