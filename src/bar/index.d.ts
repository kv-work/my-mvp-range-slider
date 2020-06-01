declare interface Bar {
  render(data: number | [number, number]): void;
  destroy(): void;
}

declare namespace Bar {
  interface Options {
    $viewContainer: JQuery;
    observer: Bar.Observer;
    renderOptions? : Bar.RenderOptions;
  }

  interface Observer {
    notify(action: {event: string; value?: [number, number] | number}): void;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
  }
}
