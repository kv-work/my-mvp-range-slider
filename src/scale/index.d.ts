declare interface Scale {
  render(data: App.Stringable[]): void;
  destroy(): void;
}

declare namespace Scale {
  interface Options {
    $viewContainer: JQuery;
    observer: Scale.Observer;
  }

  interface Observer {
    update(value: number): void;
  }
}
