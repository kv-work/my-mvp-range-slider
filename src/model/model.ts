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
    if (SliderModel.validateInitOptions(options)) {
      this.maxValue = options.maxValue;
      this.minValue = options.minValue;
      this.step = options.step;
    } else {
      this.maxValue = 10;
      this.minValue = 0;
      this.step = 1;
    }

    this.observers = new Set();
    this.value = options.value;

    if (options.secondValue !== undefined) {
      this.secondValue = options.secondValue;
    }

    this.lockedValues = new Set();
    if (options.lockedValues !== undefined) {
      this.lockState(options.lockedValues);
    }

    this.isReadyNotify = true;
    this.isUpdated = true;
  }

  get value(): number {
    return this._value;
  }

  set value(newValue: number) {
    if (this._ableToChange('value', newValue)) {
      const { _value: oldValue } = this;

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
      this._step = +newValue.toFixed(17);

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
        this.isUpdated = oldValue === undefined;
      }

      if (oldValue !== this._secondValue) {
        this.notify();
      }
    }
  }

  addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  getState(): Model.Options {
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

  updateState(state: Model.Options): void {
    const {
      maxValue: oldMax,
      minValue: oldMin,
    } = this.getState();


    this.isReadyNotify = false;
    if (Object.prototype.hasOwnProperty.call(state, 'unlockValues')) {
      this.unlockState(state.unlockValues);
    }

    const newState = this.createNewState(state);

    if (newState.maxValue > newState.minValue) {
      this._maxValue = newState.maxValue;
      this._minValue = newState.minValue;
    }

    this.step = newState.step;
    this.value = newState.value;

    if (Object.prototype.hasOwnProperty.call(state, 'secondValue') || this.secondValue !== undefined) {
      this.secondValue = newState.secondValue;
    }

    if (Object.prototype.hasOwnProperty.call(newState, 'lockedValues')) {
      this.lockState(newState.lockedValues);
    }

    this.isReadyNotify = true;

    if (oldMax !== this.maxValue || oldMin !== this.minValue) {
      this.isUpdated = false;
    }

    if (!this.isUpdated) this.notify();
  }

  lockState(props: string[] | 'all'): void {
    if (Array.isArray(props)) {
      props.forEach((valueName) => {
        switch (valueName) {
          case 'minValue':
            this.lockedValues.add('minValue');
            this.isUpdated = false;
            break;
          case 'maxValue':
            this.lockedValues.add('maxValue');
            this.isUpdated = false;
            break;
          case 'step':
            this.lockedValues.add('step');
            this.isUpdated = false;
            break;
          case 'value':
            this.lockedValues.add('value');
            this.isUpdated = false;
            break;
          case 'secondValue':
            this.lockedValues.add('secondValue');
            this.isUpdated = false;
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
      this.isUpdated = false;
    }

    if (!this.isUpdated) this.notify();
  }

  unlockState(props: string[] | 'all'): void {
    if (Array.isArray(props)) {
      props.forEach((valueName) => {
        switch (valueName) {
          case 'minValue':
            this.lockedValues.delete('minValue');
            this.isUpdated = false;
            break;
          case 'maxValue':
            this.lockedValues.delete('maxValue');
            this.isUpdated = false;
            break;
          case 'step':
            this.lockedValues.delete('step');
            this.isUpdated = false;
            break;
          case 'value':
            this.lockedValues.delete('value');
            this.isUpdated = false;
            break;
          case 'secondValue':
            this.lockedValues.delete('secondValue');
            this.isUpdated = false;
            break;
          default:
            break;
        }
      });
    } else if (props === 'all') {
      this.lockedValues.clear();
      this.isUpdated = false;
    }

    if (!this.isUpdated) this.notify();
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
    let tempResult: number;

    switch (true) {
      case (value >= max):
        result = max;
        break;
      case (value <= min):
        result = min;
        break;
      case ((((value - min) % step) / step > 0.5)):
        tempResult = (value - ((value - min) % step) + step);
        if (tempResult > max) {
          result = max;
        } else {
          result = tempResult;
        }
        break;
      default:
        tempResult = (value - ((value - min) % step));
        if ((tempResult + step) >= max && ((max + tempResult) / 2) < value) {
          result = max;
        } else {
          result = (value - ((value - min) % step));
        }
        break;
    }

    return SliderModel.fixVal(result, step);
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

  private createNewState(state: Model.Options): Model.Options {
    const {
      maxValue: oldMax,
      minValue: oldMin,
      step: oldStep,
      value: oldVal,
      secondValue: oldSecondVal,
    } = this.getState();

    const newState: Model.Options = $.extend(this.getState(), state);

    if (Object.prototype.hasOwnProperty.call(state, 'secondValue')) {
      newState.secondValue = state.secondValue;
    }

    newState.maxValue = this._isLocked('maxValue') ? oldMax : newState.maxValue;
    newState.minValue = this._isLocked('minValue') ? oldMin : newState.minValue;
    newState.step = this._isLocked('step') ? oldStep : newState.step;
    newState.value = this._isLocked('value') ? oldVal : newState.value;
    newState.secondValue = this._isLocked('secondValue') ? oldSecondVal : newState.secondValue;

    return newState;
  }

  static _validate(value: number): boolean {
    return !(value === null || Number.isNaN(value) || !Number.isFinite(value));
  }

  static validateInitOptions(options: Model.Options): boolean {
    const hasMaxVal = Object.prototype.hasOwnProperty.call(options, 'maxValue');
    const hasMinVal = Object.prototype.hasOwnProperty.call(options, 'minValue');
    const hasStep = Object.prototype.hasOwnProperty.call(options, 'step');

    const isMaxGreaterMin = options.maxValue > options.minValue;
    const isStepPositive = options.step > 0;

    return hasMaxVal && hasMinVal && hasStep && isMaxGreaterMin && isStepPositive;
  }

  static fixVal(value: number, baseVal: number): number {
    if (!(baseVal % 1)) {
      return +value.toFixed(0);
    }
    const base = `${baseVal}`.split('.')[1].length;
    const fixedVal = +value.toFixed(base);
    return fixedVal;
  }
}

export default SliderModel;
