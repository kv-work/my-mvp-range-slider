declare interface ValuesDisplay {
  update(data: View.RenderData, options: ValuesDisplay.UpdateOptions): void;
  destroy(): void;
}

declare namespace ValuesDisplay {
  interface InitOptions {
    $viewContainer: JQuery;
  }

  interface UpdateOptions {
    isHorizontal?: boolean;
    prefix?: string;
    postfix?: string;
  }

  interface CreationData {
    renderData: View.RenderData;
    options: ValuesDisplay.UpdateOptions;
    isSecond?: boolean;
  }

  interface UpdateData {
    renderData: View.RenderData;
    options: ValuesDisplay.UpdateOptions;
  }
}
