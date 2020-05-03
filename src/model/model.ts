import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private maxValue: number
  private minValue: number
  private step: number
  private value: number
  private observers: Set<Object>

  constructor(options: OptionsModel) {
      this.maxValue = options.maxValue;
      this.minValue = options.minValue;
      this.step = options.step;
      this.value = options.value;

    this.observers = new Set();
  }

  public setValue(newValue: number): void {
    const { maxValue, minValue } = this;
    if ( newValue > maxValue ) {
      throw new RangeError('Value greater then maximum value of slider')
    } else if ( newValue < minValue ) {
      throw new RangeError('Value less then minimum value of slider')
    } else if (this.value !== newValue) {
      this.value = newValue;
      this.notify();
    }  
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  private notify(): void {
    this.observers.forEach( (observer: Observer): void => {
      observer.update();
    } )
  }

  public getState(): OptionsModel {
    return {
      maxValue: this.maxValue,
      minValue: this.minValue,
      value: this.value,
      step: this.step
    }
  }

  public updateState(state: OptionsModel | {option: number}): void {}
}