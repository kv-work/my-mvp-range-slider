import { OptionsModel, Observer, Model } from '../types';

class SliderModel implements Model {
  private _maxValue: number;
  private _minValue: number;
  private _step: number;
  private _value: number;
  private _secondValue?: number;
  private observers: Set<Observer>;
  private isUpdated: boolean;
  private isReadyNotify: boolean;
  public readonly lockedValues: Set<string>;

  constructor(options: OptionsModel) {
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.step = options.step;
    this.observers = new Set();
    this.value = options.value;

    if (options.secondValue !== undefined) {
      this.secondValue = options.secondValue;
    }

    this.lockedValues = new Set();

    this.isReadyNotify = true;
    this.isUpdated = true;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    if (this._ableToChange('value', newValue)) {
      const {
        _maxValue,
        _minValue,
        _value: oldValue,
      } = this;

      if (this._value === undefined) {
        this._value = this._minValue;
      }

      const valueMultipleStep = this._getMultipleStep(newValue);

      if (this._secondValue !== undefined && valueMultipleStep >= this._secondValue) {
        this._value = this._secondValue;
        this.isUpdated = false;
      } else if (valueMultipleStep >= _maxValue) {
        this._value = _maxValue;
        this.isUpdated = false;
      } else if (valueMultipleStep <= _minValue) {
        this._value = _minValue;
        this.isUpdated = false;
      } else {
        this._value = valueMultipleStep;
        this.isUpdated = false;
      }

      if (oldValue !== this._value) {
        this.notify();
      }
    }
  }

  get maxValue(): number {
    return this._maxValue;
  }

  set maxValue(newValue: number) {
    if (this._ableToChange('maxValue', newValue)) {
      this._maxValue = newValue;

      this.isUpdated = false;

      if (this._value !== undefined) {
        this.value = this._value;
      }
      if (this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
      }

      if (!this.isUpdated) {
        this.notify();
      }
    }
  }

  get minValue(): number {
    return this._minValue;
  }

  set minValue(newValue: number) {
    if (this._ableToChange('minValue', newValue)) {
      this._minValue = newValue;

      this.isUpdated = false;

      if (this._value !== undefined) {
        this.value = this._value;
      }
      if (this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
      }

      if (!this.isUpdated) {
        this.notify();
      }
    }
  }

  get step(): number {
    return this._step;
  }

  set step(newValue: number) {
    if (this._ableToChange('step', newValue)) {
      this._step = newValue;

      this.isUpdated = false;

      if (this._value !== undefined) {
        this.value = this._value;
      }
      if (this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
      }

      if (!this.isUpdated) {
        this.notify();
      }
    }
  }

  get secondValue(): number {
    return this._secondValue;
  }

  set secondValue(newValue: number | undefined) {
    if (this._ableToChange('secondValue', newValue)) {
      const {
        _maxValue,
        _value,
        _secondValue: oldValue,
      } = this;

      let valueMultipleStep: number;
      if (newValue !== undefined) {
        valueMultipleStep = this._getMultipleStep(newValue);

        switch (true) {
          case (valueMultipleStep >= _maxValue):
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
      } else {
        this._secondValue = undefined;
      }

      if (oldValue !== this._secondValue) {
        this.notify();
      }
    }
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer);
  }

  public getState(): OptionsModel {
    const state = {
      maxValue: this._maxValue,
      minValue: this._minValue,
      value: this._value,
      secondValue: this._secondValue,
      step: this._step,
    };

    if (this._secondValue !== undefined) {
      state.secondValue = this._secondValue;
    }

    return state;
  }

  public updateState(state: OptionsModel): void {
    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    } = state;

    this.isReadyNotify = false;
    this.maxValue = maxValue;
    this.minValue = minValue;
    this.step = step;
    this.value = value;
    this.secondValue = secondValue;

    this.isReadyNotify = true;
    this.notify();
  }

  public lockState(props: string[] | 'all'): void {
    if (Array.isArray(props)) {
      props.forEach((valueName) => {
        switch (valueName) {
          case 'minValue':
            this.lockedValues.add('minValue');
            break;
          case 'maxValue':
            this.lockedValues.add('maxValue');
            break;
          case 'step':
            this.lockedValues.add('step');
            break;
          case 'value':
            this.lockedValues.add('value');
            break;
          case 'secondValue':
            this.lockedValues.add('secondValue');
            break;
          default:
            break;
        }
      });
    } else if (props === 'all') {
      this.lockedValues.add('maxValue');
      this.lockedValues.add('minValue');
      this.lockedValues.add('step');
      this.lockedValues.add('value');
      this.lockedValues.add('secondValue');
    }
  }

  public unlockState(props: string[] | 'all'): void {
    if (Array.isArray(props)) {
      props.forEach((valueName) => {
        switch (valueName) {
          case 'minValue':
            this.lockedValues.delete('minValue');
            break;
          case 'maxValue':
            this.lockedValues.delete('maxValue');
            break;
          case 'step':
            this.lockedValues.delete('step');
            break;
          case 'value':
            this.lockedValues.delete('value');
            break;
          case 'secondValue':
            this.lockedValues.delete('secondValue');
            break;
          default:
            break;
        }
      });
    } else if (props === 'all') {
      this.lockedValues.clear();
    }
  }

  private notify(): void {
    if (this._checkObservers()) {
      this.observers.forEach((observer: Observer): void => {
        observer.update();
      });

      this.isUpdated = true;
    }
  }

  private _checkObservers(): boolean {
    return (this.observers !== undefined && this.observers.size !== 0 && this.isReadyNotify);
  }

  private _getMultipleStep(value: number): number {
    const {
      _step: step,
    } = this;
    let valueMultipleStep;

    if (((value % step) / step > 0.5)) {
      valueMultipleStep = (value - (value % step) + step);
    } else {
      valueMultipleStep = (value - (value % step));
    }

    return this.fixValue(valueMultipleStep);
  }

  private _isLocked(value: string): boolean {
    return (this.lockedValues !== undefined && this.lockedValues.has(value));
  }

  private _ableToChange(value: string, newValue: number): boolean {
    const isValid: boolean = SliderModel._validate(newValue);
    const isLocked: boolean = this._isLocked(value);
    let isEqual: boolean;
    let isUndefined: boolean;
    let isGreaterThenMin: boolean;
    let isLessThenMax: boolean;

    switch (value) {
      case 'value':
        return (isValid && !isLocked);
      case 'secondValue':
        return (newValue === undefined) || (isValid && !isLocked);
      case 'maxValue':
        isEqual = (newValue === this._maxValue);
        isUndefined = (this._maxValue === undefined);
        isGreaterThenMin = (this._minValue === undefined || newValue > this._minValue);
        return isUndefined || (isValid && !isLocked && !isEqual && isGreaterThenMin);
      case 'minValue':
        isEqual = (newValue === this._minValue);
        isUndefined = (this._minValue === undefined);
        isLessThenMax = (this._maxValue === undefined || newValue < this._maxValue);
        return isUndefined || (isValid && !isLocked && !isEqual && isLessThenMax);
      case 'step':
        isEqual = (newValue === this._step);
        isUndefined = (this._step === undefined);
        return isUndefined || (isValid && !isLocked && !isEqual && (newValue > 0));
      default:
        return false;
    }
  }

  private fixValue(value: number): number {
    if (!(this._step % 1)) {
      return value;
    }

    let base: number = this._step.toString().split('.')[1].length;
    if (base > 10) {
      base = 10;
    }
    const result = +value.toFixed(base);
    return result;
  }

  static _validate(value: number): boolean {
    return !(value === null || Number.isNaN(value) || !Number.isFinite(value));
  }
}

export default SliderModel;
