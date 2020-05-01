interface Observer {
  update: CallableFunction
}

abstract class View {
  private $container: JQuery

  constructor(container: HTMLElement) {
    this.$container = $(container)
  }

  public render(value: number): void {}
  public update(): void {}
  public notify(value: number): void {}
}

export {
  Observer,
  View
}