declare interface Runner {
  render(data: View.RenderData, options: Runner.RenderOptions): void;
  destroy(): void;
}

declare namespace Runner {
  interface InitOptions {
    $viewContainer: JQuery;
    isSecond?: boolean;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    displayValue?: boolean;
    prefix?: string;
    postfix?: string;
  }
}
