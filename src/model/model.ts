import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private _maxValue: number
  private _minValue: number
  private _step: number
  private _value: number
  private observers: Set<Object>
  private isUpdated: boolean

  constructor(options: OptionsModel) {
    this.isUpdated = true;
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
    const { _maxValue, _minValue, _step } = this;

    if ( this._value === undefined ) {
      this._value = this._minValue;
    }

    if (this._value === newValue && this.isUpdated) {
      return
    }

    const valueMultipleStep = (newValue % _step / _step > 0.5) ? (newValue - newValue % _step + _step) : (newValue - newValue % _step);
      
    if ( valueMultipleStep >= _maxValue ) {
      this._value = _maxValue;
      this.isUpdated = false;
    } else if ( valueMultipleStep <= _minValue ) {
      this._value = _minValue;
      this.isUpdated = false;
    } else {
      this._value = valueMultipleStep;
      this.isUpdated = false;
    }

    if (this.observers !== undefined) {
      this.notify();
    }
  }

  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(newValue: number) {
    if ( this._minValue === undefined || newValue > this._minValue ) {
      this._maxValue = newValue;

      this.isUpdated = false;

      if ( this._value !== undefined) {
        this.value = this._value;
      }
    }    
  }

  get minValue(): number {
    return this._minValue;
  }

  set minValue(newValue: number) {
    if ( this._maxValue === undefined || newValue < this._maxValue) {
      this._minValue = newValue;

      this.isUpdated = false;

      if ( this._value !== undefined) {
        this.value = this._value;
      }
    }
  }

  get step(): number {
    return this._step;
  }

  set step(newValue: number) {
    if (newValue > 0) {
      this._step = newValue;

      this.isUpdated = false;

      if (this._value !== undefined ) {
        this.value = this._value;
      }      
    }    
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
    this.isUpdated = true;
  }

  public getState(): OptionsModel {
    return {
      maxValue: this._maxValue,
      minValue: this._minValue,
      value: this._value,
      step: this._step
    }
  }

  public updateState(state: OptionsModel): void {
    const {maxValue, minValue, step, value} = state;

    this.maxValue = ( maxValue !== undefined ) ? maxValue : this._maxValue;
    this.minValue = ( minValue !== undefined )  ? minValue : this._minValue;
    this.step = ( step !== undefined )  ? step : this._step;
    this.value = ( value !== undefined )  ? value :  this._value;
  }
}