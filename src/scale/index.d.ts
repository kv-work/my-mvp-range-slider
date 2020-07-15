declare interface Scale {
  update(options: Scale.UpdateOptions): void;
  destroy(): void;
}

declare namespace Scale {
  interface Options {
    $viewContainer: JQuery;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    scaleStep?: number;
    displayScaleStrips?: boolean;
    displayScaleValue?: boolean;
    displayMin?: boolean;
    displayMax?: boolean;
    range?: boolean;
  }

  interface UpdateOptions {
    options: Scale.RenderOptions;
    data: View.RenderData;
  }
}
