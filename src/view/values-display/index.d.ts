declare interface ValuesDisplay {
  update(options: ValuesDisplay.UpdateOptions): void;
  destroy(): void;
}

declare namespace ValuesDisplay {
  interface InitOptions {
    $viewContainer: JQuery;
  }

  interface RenderOptions {
    isHorizontal?: boolean;
    prefix?: string;
    postfix?: string;
  }

  interface UpdateOptions {
    data: View.RenderData;
    options?: ValuesDisplay.RenderOptions;
  }
}
