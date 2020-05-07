import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private _maxValue: number
  private _minValue: number
  private _step: number
  private _value: number
  private _secondValue: number

  private observers: Set<Object>
  private isUpdated: boolean
  private isReadyNotify: boolean

  constructor(options: OptionsModel) {

    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.step = options.step;
    
    this.observers = new Set();
    this.value = options.value;
    if (options.secondValue !== undefined) {
      this.secondValue = options.secondValue;
    }

    this.isReadyNotify = true;
    this.isUpdated = true;    
  }



  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    if ( this._validate(newValue) ) {
      const { _maxValue, _minValue, _step, _value: oldValue } = this;

      if ( this._value === undefined ) {
        this._value = this._minValue;
      }

      const valueMultipleStep = (newValue % _step / _step > 0.5) ? (newValue - newValue % _step + _step) : (newValue - newValue % _step);
        
      if (this._secondValue !== undefined && valueMultipleStep >= this._secondValue) {
        this._value = this._secondValue;
        this.isUpdated = false;
      } else if ( valueMultipleStep >= _maxValue ) {
        this._value = _maxValue;
        this.isUpdated = false;
      } else if ( valueMultipleStep <= _minValue ) {
        this._value = _minValue;
        this.isUpdated = false;
      } else {
        this._value = valueMultipleStep;
        this.isUpdated = false;
      }

      if ( oldValue !== this._value ) {
        this.notify();
      }
    }
  }

  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(newValue: number) {
    if ( this._validate(newValue) ) {  
      if ( this._minValue === undefined || newValue > this._minValue ) {
        this._maxValue = newValue;

        this.isUpdated = false;

        //update values
        if (this._value !== undefined) {
          this.value = this._value;
        }
        if (this._secondValue !== undefined) {
          this.secondValue = this._secondValue;
        }

        if ( !this.isUpdated ) {
          this.notify()
        }

      }    
    }
  }

  get minValue(): number {
    return this._minValue;
  }

  set minValue(newValue: number) {
    if ( this._validate(newValue) ) {
      if ( this._maxValue === undefined || newValue < this._maxValue) {
        this._minValue = newValue;

        this.isUpdated = false;

        //update values
        if (this._value !== undefined) {
          this.value = this._value;
        }
        if (this._secondValue !== undefined) {
          this.secondValue = this._secondValue;
        }

        if ( !this.isUpdated ) {
          this.notify()
        }
      }
    }
  }

  get step(): number {
    return this._step;
  }

  set step(newValue: number) {
    if ( this._validate(newValue) ) {     
      if (newValue > 0) {
        this._step = newValue;

        this.isUpdated = false;

        //update values
        if (this._value !== undefined) {
          this.value = this._value;
        }
        if (this._secondValue !== undefined) {
          this.secondValue = this._secondValue;
        }

        if ( !this.isUpdated ) {
          this.notify()
        }
      } }   
  }

  get secondValue() {
    return this._secondValue
  }

  set secondValue(newValue: number) {
    if ( this._validate(newValue) ) {
      const { _maxValue, _step, _value, _secondValue: oldValue } = this;

      const valueMultipleStep = (newValue % _step / _step > 0.5) ? (newValue - newValue % _step + _step) : (newValue - newValue % _step);

      switch (true) {
        case ( valueMultipleStep >= _maxValue ):
          this._secondValue = _maxValue;
          this.isUpdated = false;
          break;
        case (valueMultipleStep <= _value):
          this._secondValue = _value;
          this.isUpdated = false;
          break;
        default:
          this._secondValue = valueMultipleStep;
          this.isUpdated = false;
      }

      if ( oldValue !== this._secondValue ) {
        this.notify();
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
    if (this.observers !== undefined && this.observers.size !== 0 && this.isReadyNotify) {
      this.observers.forEach( (observer: Observer): void => {
        observer.update();
      } )

      this.isUpdated = true;
    }
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

    this.isReadyNotify = false;

    if ( maxValue !== undefined ) {
      this.maxValue = maxValue;
    }

    if ( minValue !== undefined ) {
      this.minValue = minValue;
    }

    if ( step !== undefined ) {
      this.step = step;
    }

    if ( value !== undefined ) {
      this.value = value;
    }

    if ( secondValue !== undefined ) {
      this.secondValue = secondValue;
    }

    this.isReadyNotify = true;
    this.notify();
  }

  private _validate(value: any) {
    return !( value === null || isNaN(value) || !isFinite(value) )
  }
}