import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private _maxValue: number
  private _minValue: number
  private _step: number
  private _value: number
  private _secondValue: number

  private observers: Set<Object>
  private isUpdated: boolean
  private readyNotify: boolean

  constructor(options: OptionsModel) {
    this.isUpdated = true;
    this.readyNotify = true;
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.step = options.step;
    
    this.observers = new Set();
    this.value = options.value;
    this.secondValue = options.secondValue;
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

      //update value
      if ( this._value !== undefined) {
        this.value = this._value;
      }

      //update second value
      if ( this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
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

      //update second value
      if ( this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
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

  get secondValue() {
    return this._secondValue
  }

  set secondValue(newValue: number) {
    if (newValue >= this.maxValue) {
      this._secondValue = this.maxValue;
    } else if (newValue <= this.minValue) {
      this._secondValue = this.minValue;
    } else {
      this._secondValue = newValue;
    }
    
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  private notify(): void {
    if (this.observers.size !== 0 && this.readyNotify) {
      this.observers.forEach( (observer: Observer): void => {
        observer.update();
      } )
    }
    this.isUpdated = true;
  }

  public getState(): OptionsModel {
    const state = {
      maxValue: this._maxValue,
      minValue: this._minValue,
      value: this._value,
      secondValue: this._secondValue,
      step: this._step
    }

    if ( this._secondValue !== undefined ) {
      state['secondValue'] = this._secondValue;
    }
    
    return state
  }

  public updateState(state: OptionsModel): void {
    const {maxValue, minValue, step, value, secondValue} = state;

    this.readyNotify = false;

    this.maxValue = ( maxValue !== undefined ) ? maxValue : this._maxValue;
    this.minValue = ( minValue !== undefined )  ? minValue : this._minValue;
    this.step = ( step !== undefined )  ? step : this._step;
    this.value = ( value !== undefined )  ? value :  this._value;
    this.secondValue = ( secondValue !== undefined ) ? secondValue : this._secondValue;

    this.readyNotify = true;
    this.notify();
  }
}