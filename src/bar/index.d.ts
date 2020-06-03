declare interface Bar {
  render(data: number | [number, number], options: Bar.RenderOptions): void;
  destroy(): void;
}

declare namespace Bar {
  interface Options {
    $viewContainer: JQuery;
    observer: View.SubViewObserver;
    renderOptions? : Bar.RenderOptions;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
  }
}
