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
    
    this.observers = new Set();

    this.setValue(options.value);
  }

  public setValue(newValue: number): void {
    const { maxValue, minValue, step } = this;

    if (!this.value) {
      this.value = this.minValue;
    }

    const valueMultipleStep = (newValue % step / step > 0.5) ? (newValue - newValue % step + step) : (newValue - newValue % step);

    if (this.value === valueMultipleStep) {
      return
    }  
    
    if ( valueMultipleStep >= maxValue ) {
      this.value = maxValue;
    } else if ( valueMultipleStep <= minValue ) {
      this.value = minValue;
    } else {
      this.value = valueMultipleStep;
    }

    this.notify();
  }

  public setMaxValue(newValue: number): void {
    this.maxValue = newValue;
  }

  public setMinValue(newValue: number): void {
    this.minValue = newValue;
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  private notify(): void {
    if (this.observers.size !== 0) {
      this.observers.forEach( (observer: Observer): void => {
        observer.update();
      } )
    }
  }

  public getState(): OptionsModel {
    return {
      maxValue: this.maxValue,
      minValue: this.minValue,
      value: this.value,
      step: this.step
    }
  }

  public updateState(state: OptionsModel): void {
    const {maxValue, minValue, step, value} = state;

    this.maxValue = maxValue ? maxValue : this.maxValue;
    this.minValue = minValue ? minValue : this.minValue;
    this.step = step ? step : this.step;
    
    this.setValue(value);
  }
}