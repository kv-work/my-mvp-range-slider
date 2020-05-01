import './view.css'

export default class View {
  private $container: JQuery
  private $bar: JQuery
  private $slider: JQuery

  constructor(container: HTMLElement) {
    this.$container = $(container)

  }


  public render() {}
}