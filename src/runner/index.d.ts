declare interface Runner {
  render(data: number, options: Runner.RenderOptions): void;
  destroy(): void;
}

declare namespace Runner {
  interface InitOptions {
    $viewContainer: JQuery;
    renderOptions?: Runner.RenderOptions;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    displayValue?: boolean;
    prefix?: string;
    postfix?: string;
  }
}
