declare interface Bar {
  render(data: number | [number, number], options: Bar.RenderOptions): void;
  destroy(): void;
}

declare namespace Bar {
  interface Options {
    $viewContainer: JQuery;
    observer: Bar.Observer;
    renderOptions? : Bar.RenderOptions;
  }

  interface Observer {
    start(): void;
    change(value: number): void;
    finish(value: number): void;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
  }
}
