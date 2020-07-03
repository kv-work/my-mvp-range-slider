declare interface Runner {
  update(data: View.RenderData, options: Runner.RenderOptions): void;
  destroy(): void;
}

declare namespace Runner {
  interface InitOptions {
    $viewContainer: JQuery;
    isSecond?: boolean;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
  }
}
