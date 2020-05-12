import { OptionsModel, Observer, Model } from '../types';

class SliderModel implements Model {
  private _maxValue: number;
  private _minValue: number;
  private _step: number;
  private _value: number;
  private _secondValue: number;
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
    if (SliderModel._validate(newValue) && !this._isLocked('value')) {
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
    if (SliderModel._validate(newValue) && newValue !== this.maxValue && !this._isLocked('maxValue')) {
      if (this._minValue === undefined || newValue > this._minValue) {
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
  }

  get minValue(): number {
    return this._minValue;
  }

  set minValue(newValue: number) {
    if (SliderModel._validate(newValue) && newValue !== this._minValue && !this._isLocked('minValue')) {
      if (this._maxValue === undefined || newValue < this._maxValue) {
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
  }

  get step(): number {
    return this._step;
  }

  set step(newValue: number) {
    if (SliderModel._validate(newValue) && newValue !== this._step && !this._isLocked('step')) {
      if (newValue > 0) {
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
  }

  get secondValue(): number {
    return this._secondValue;
  }

  set secondValue(newValue: number) {
    if (SliderModel._validate(newValue) && !this._isLocked('secondValue')) {
      const {
        _maxValue,
        _value,
        _secondValue: oldValue,
      } = this;

      const valueMultipleStep = this._getMultipleStep(newValue);

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

  public unlockState(props: string[] | 'all'): void {}

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

    return valueMultipleStep;
  }

  private _isLocked(value: string): boolean {
    return (this.lockedValues !== undefined && this.lockedValues.has(value));
  }

  static _validate(value: number): boolean {
    return !(value === null || Number.isNaN(value) || !Number.isFinite(value));
  }
}

export default SliderModel;
