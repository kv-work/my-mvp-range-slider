declare interface Runner {
  update(options: Runner.UpdateOptions): void;
  destroy(): void;
}

declare namespace Runner {
  interface InitOptions {
    $viewContainer: JQuery;
    $barContainer: JQuery;
    isSecond?: boolean;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
  }

  interface UpdateOptions {
    data: View.RenderData;
    options: Runner.RenderOptions;
  }
}
