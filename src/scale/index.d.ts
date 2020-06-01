declare interface Scale {
  render(data: App.Stringable[], options?: Scale.Options): void;
  destroy(): void;
}

declare namespace Scale {
  interface Options {
    $viewContainer: JQuery;
    observer: Scale.Observer;
    renderOptions? : Scale.RenderOptions;
  }

  interface Observer {
    update(value: number): void;
  }

  interface RenderOptions {
    scaleStep?: number;
    displayScaleValue?: boolean;
    displayValue?: boolean;
    displayMin?: boolean;
    displayMax?: boolean;
  }
}
