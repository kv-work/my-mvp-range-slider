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
      class: 'slider__bar',
    });
    this.observers = new  Set();
  }

  private attachEventListeners() {
    this.$bar.click( (event) => {
      //Здесь нужно высчитать какое значение было выбрано
      const bar = event.currentTarget;
      const value: number = Math.floor((event.clientX - bar.offsetLeft) / bar.offsetWidth * 100);
      this.notify(value);
    } )
  }

  public render(value: number): void {
    this.$container.append(this.$bar);
    // Здесь нужно добавить отрисовку bar в соответсвии с передаваемым значением value
    this.attachEventListeners();
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  private notify(value: number): void {
    this.observers.forEach( (observer: Observer): void => {
      observer.update(value);
    } )
  }
}

export { Observer };