import $ from 'jquery';

import { Observer, View, ViewData } from '../types';

export default class ViewBar implements View {
  private $container: JQuery
  private $bar: JQuery
  private observers: Set<Observer>
  private isRendered: boolean

  constructor(container: HTMLElement) {
    this.$container = $(container)
    
    this.$bar = $('<div>', {
      class: 'slider__bar',
    });
    this.observers = new  Set();
    this.isRendered = false;
  }

  private attachEventListeners() {
    this.$bar.click( (event) => {
      //Здесь нужно высчитать какое значение было выбрано
      const bar = event.currentTarget;
      const value: number = Math.floor((event.clientX - bar.offsetLeft) / bar.offsetWidth * 100);
      this.notify(value);
    } )
  }

  public render(viewData: ViewData): void {
    if (!this.isRendered) {
      this.$container.append(this.$bar);
      // Здесь нужно добавить отрисовку bar в соответсвии с передаваемым значением value
      this.attachEventListeners();
      this.isRendered = true;
    } else {
      throw Error('View is already rendered!')
    }
  }

  public update(viewData: ViewData): void {}

  public unmount(): void {}

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