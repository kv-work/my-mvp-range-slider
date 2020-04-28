import $ from 'jquery'

interface Observer {
  update: (value: number) => {}
}

export default class ViewBar {
  private $container: JQuery
  private $bar: JQuery
  private observers: Set<Observer>

  constructor(container: HTMLElement) {
    this.$container = $(container);
    this.$bar = $('<div>', {
      class: 'slider__bar'
    });

    this.$container.append(this.$bar)
    this.observers = new  Set();

    this.attachEventListeners();
  }

  private attachEventListeners() {
    this.$bar.click( (event) => {
      //Здесь нужно высчитать какое значение было выбрано
      const value: number = event.clientX - event.currentTarget.offsetLeft;
      this.notify(value);
    } )
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  public notify(value: number): void {
    this.observers.forEach( (observer: Observer): void => {
      observer.update(value);
    } )
  }
}

export { Observer };