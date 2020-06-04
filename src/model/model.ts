class SliderModel implements Model {
  private _maxValue: number;
  private _minValue: number;
  private _step: number;
  private _value: number;
  private _secondValue?: number;
  private observers: Set<Model.Observer>;
  private isUpdated: boolean;
  private isReadyNotify: boolean;
  public readonly lockedValues: Set<string>;

  constructor(options: Model.Options) {
    this.maxValue = options.maxValue;
    this.minValue = options.minValue;
    this.step = options.step;
    this.observers = new Set();
    this.value = options.value;

    if (options.secondValue !== undefined) {
      this.secondValue = options.secondValue;
    }

    if (options.lockedValues !== undefined) {
      this.lockedValues = new Set(options.lockedValues);
    } else {
      this.lockedValues = new Set();
    }


    this.isReadyNotify = true;
    this.isUpdated = true;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    if (this._ableToChange('value', newValue)) {
      const {
        _value: oldValue,
      } = this;

      if (this._value === undefined) {
        this._value = this._minValue;
      }

      const fixedValue = this._getMultipleStep(newValue);

      if (this._secondValue !== undefined && fixedValue >= this._secondValue) {
        this._value = this._secondValue;
        this.isUpdated = false;
      } else if (oldValue !== fixedValue) {
        this._value = fixedValue;
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
      this._maxValue = this.fixValue(newValue);

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
      this._minValue = this.fixValue(newValue);

      this.isUpdated = false;

      if (this._secondValue !== undefined) {
        this.secondValue = this._secondValue;
      }

      if (this._value !== undefined) {
        this.value = this._value;
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
      this._step = this.fixValue(newValue);

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
        _value,
        _secondValue: oldValue,
      } = this;

      if (newValue !== undefined) {
        const fixedValue = this._getMultipleStep(newValue);

        if (fixedValue <= _value) {
          this._secondValue = _value;
          this.isUpdated = oldValue === _value;
        } else if (oldValue !== fixedValue) {
          this._secondValue = fixedValue;
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

  public addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  public removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  public getState(): Model.Options {
    const state: Model.Options = {
      maxValue: this._maxValue,
      minValue: this._minValue,
      value: this._value,
      step: this._step,
      lockedValues: Array.from(this.lockedValues),
    };

    if (this._secondValue !== undefined) {
      state.secondValue = this._secondValue;
    }

    return state;
  }

  public updateState(state: Model.Options): void {
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
    if (!this.isUpdated) this.notify();
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
    if (this._checkObservers() && this.isReadyNotify) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });

      this.isUpdated = true;
    }
  }

  private _checkObservers(): boolean {
    return (this.observers !== undefined && this.observers.size !== 0);
  }

  private _getMultipleStep(value: number): number {
    const {
      _step: step,
      _maxValue: max,
      _minValue: min,
    } = this;
    let result: number;

    switch (true) {
      case (value >= max):
        result = max;
        break;
      case (value <= min):
        result = min;
        break;
      case (((value % step) / step > 0.5)):
        result = (value - (value % step) + step);
        break;
      default:
        result = (value - (value % step));
        break;
    }

    return this.fixValue(result);
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

    const result = +value.toFixed(10);
    return result;
  }

  static _validate(value: number): boolean {
    return !(value === null || Number.isNaN(value) || !Number.isFinite(value));
  }
}

export default SliderModel;
