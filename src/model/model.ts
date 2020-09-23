class SliderModel implements Model {
  // private maxValue: number;
  // private minValue: number;
  // private step: number;
  // private value: number;
  // private secondValue?: number;
  private state: Model.State;
  private observers: Set<Model.Observer>;
  private isUpdated: boolean;
  public readonly lockedValues: Set<string>;

  constructor(options?: Model.Options) {
    let maxValue = 10;
    let minValue = 0;
    let step = 1;
    let value = 0;
    let secondValue: number | undefined;

    if (options !== undefined && SliderModel.validateInitOptions(options)) {
      maxValue = options.maxValue!;
      minValue = options.minValue!;
      step = options.step!;
    }

    this.observers = new Set();
    if (options?.value) {
      value = options.value;
    }

    if (options?.secondValue !== undefined) {
      secondValue = options.secondValue;
    }

    this.lockedValues = new Set();
    if (options?.lockedValues !== undefined) {
      this.lockState(options.lockedValues);
    }

    this.state = {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
      lockedValues: Array.from(this.lockedValues),
    };

    this.isUpdated = true;
  }

  addObserver(observer: Model.Observer): void {
    this.observers.add(observer);
  }

  removeObserver(observer: Model.Observer): void {
    this.observers.delete(observer);
  }

  getState(): Model.State {
    return this.state;
  }

  // NEED FIX
  updateState(state: Model.Options): void {
    const {
      maxValue: oldMax,
      minValue: oldMin,
      secondValue,
    } = this.getState();

    if (state.unlockValues !== undefined) {
      this.unlockState(state.unlockValues);
    }

    const newState = this.createNewState(state);

    if (newState.maxValue > newState.minValue) {
      this.state.maxValue = newState.maxValue;
      this.state.minValue = newState.minValue;
    }

    if (this._ableToChange('step', newState.step)) {
      this.state.step = newState.step;
    }
    if (this._ableToChange('value', newState.value)) {
      this.state.value = newState.value;
    }

    if (Object.prototype.hasOwnProperty.call(state, 'secondValue') || secondValue !== undefined) {
      if (newState.secondValue && this._ableToChange('secondValue', newState.secondValue)) {
        this.state.secondValue = newState.secondValue;
      }
    }

    if (Object.prototype.hasOwnProperty.call(newState, 'lockedValues')) {
      this.lockState(newState.lockedValues);
    }

    if (oldMax !== this.state.maxValue || oldMin !== this.state.minValue) {
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
    if (this.observers !== undefined && this.observers.size !== 0) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });

      this.isUpdated = true;
    }
  }

  private _getMultipleStep(value: number): number {
    const {
      step,
      maxValue: max,
      minValue: min,
    } = this.state;
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
    const { maxValue, minValue, step } = this.state;
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
        isEqual = (newValue === maxValue);
        isUndefined = (maxValue === undefined);
        isGreaterThenMin = (minValue === undefined || newValue > minValue);
        return isUndefined || (isValid && !isLocked && !isEqual && isGreaterThenMin);
      case 'minValue':
        isEqual = (newValue === minValue);
        isUndefined = (minValue === undefined);
        isLessThenMax = (maxValue === undefined || newValue < maxValue);
        return isUndefined || (isValid && !isLocked && !isEqual && isLessThenMax);
      case 'step':
        isEqual = (newValue === step);
        isUndefined = (step === undefined);
        return isUndefined || (isValid && !isLocked && !isEqual && (newValue > 0));
      default:
        return false;
    }
  }

  private createNewState(state: Model.Options): Model.State {
    const {
      maxValue: oldMax,
      minValue: oldMin,
      step: oldStep,
      value: oldVal,
      secondValue: oldSecondVal,
    } = this.getState();

    const newState: Model.State = $.extend(this.getState(), state);

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
    const { maxValue, minValue, step } = options;
    const hasMaxVal = Object.prototype.hasOwnProperty.call(options, 'maxValue');
    const hasMinVal = Object.prototype.hasOwnProperty.call(options, 'minValue');
    const hasStep = Object.prototype.hasOwnProperty.call(options, 'step');

    let isMaxGreaterMin = false;
    if (maxValue !== undefined && minValue !== undefined) {
      isMaxGreaterMin = maxValue > minValue;
    }

    let isStepPositive = false;
    if (step !== undefined) {
      isStepPositive = step > 0;
    }

    return hasMaxVal && hasMinVal && hasStep && isMaxGreaterMin && isStepPositive;
  }

  static fixVal(value: number, baseVal: number): number {
    if (!(baseVal % 1)) {
      return +value.toFixed(0);
    }

    if (baseVal.toString().includes('e')) {
      const base = +`${baseVal}`.split('e-')[1];
      const fixedVal = +value.toFixed(base);
      return fixedVal;
    }
    const base = `${baseVal}`.split('.')[1].length;
    const fixedVal = +value.toFixed(base);
    return fixedVal;
  }
}

export default SliderModel;
