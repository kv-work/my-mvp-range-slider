declare interface Bar {
  update(options: Bar.UpdateOptions): void;
  destroy(): void;
}

declare namespace Bar {
  interface Options {
    $viewContainer: JQuery;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    range?: boolean;
    dragInterval?: boolean;
  }

  interface UpdateOptions {
    data: number | [number, number];
    options?: Bar.RenderOptions;
  }
}
