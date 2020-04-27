import $ from 'jquery'

export default class ViewBar {
  private $container: JQuery

  constructor(container: HTMLElement) {
    this.$container = $(container)
  }
}