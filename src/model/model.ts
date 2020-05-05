import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private _maxValue: number
  private _minValue: number
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
    const { _maxValue, _minValue, step } = this;

    if ( this._value === undefined ) {
      this._value = this._minValue;
    }

    const valueMultipleStep = (newValue % step / step > 0.5) ? (newValue - newValue % step + step) : (newValue - newValue % step);

    if (this._value === valueMultipleStep) {
      return
    }  
    
    if ( valueMultipleStep >= _maxValue ) {
      this._value = _maxValue;
    } else if ( valueMultipleStep <= _minValue ) {
      this._value = _minValue;
    } else {
      this._value = valueMultipleStep;
    }

    this.notify();
  }

  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(newValue: number) {
    if ( this._minValue === undefined || newValue > this._minValue ) {
      this._maxValue = newValue;
    }    
  }

  get minValue(): number {
    return this._minValue;
  }

  set minValue(newValue: number) {
    if ( this._maxValue === undefined || newValue < this._maxValue) {
      this._minValue = newValue;
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