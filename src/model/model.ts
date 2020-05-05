import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private _maxValue: number
  private minValue: number
  private step: number
  private _value: number
  private observers: Set<Object>

  constructor(options: OptionsModel) {
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.step = options.step;
    
    this.observers = new Set();

    this.value = options.value;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    const { maxValue, minValue, step } = this;

    if (!this.value) {
      this._value = this.minValue;
    }

    const valueMultipleStep = (newValue % step / step > 0.5) ? (newValue - newValue % step + step) : (newValue - newValue % step);

    if (this._value === valueMultipleStep) {
      return
    }  
    
    if ( valueMultipleStep >= maxValue ) {
      this._value = maxValue;
    } else if ( valueMultipleStep <= minValue ) {
      this._value = minValue;
    } else {
      this._value = valueMultipleStep;
    }

    this.notify();
  }

  get maxValue() {
    return this._maxValue;
  }

  set maxValue(newValue: number) {
    if ( this.minValue === undefined || newValue > this.minValue ) {
      this._maxValue = newValue;
    }    
  }

  public setMinValue(newValue: number): void {
    if (newValue < this.maxValue) {
      this.minValue = newValue;
    }
  }

  public setStep(newValue: number): void {
    
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
    
    this.value = value;
  }
}