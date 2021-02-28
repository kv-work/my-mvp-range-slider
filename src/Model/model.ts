/* eslint-disable class-methods-use-this */
class SliderModel implements Model {
  private state: Model.State;
  private observers: Set<Model.Observer>;
  private isReadyNotify: boolean;
  private isUpdated: boolean;
  private lockedValues: Set<string>;

  constructor(options?: Model.Options) {
    this.observers = new Set();
    this.lockedValues = new Set();

    this.state = this.initState(options);

    this.isReadyNotify = true;
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

  updateState(state: Model.Options): void {
    const { state: oldState } = this;

    this.isReadyNotify = false;

    if (state.unlockValues !== undefined) {
      this.unlockState(state.unlockValues);
    }

    const newState = this.createState(oldState, state);

    this.state = newState;

    this.isReadyNotify = true;
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
    }

    if (props === 'all') {
      this.lockedValues.add('maxValue');
      this.lockedValues.add('minValue');
      this.lockedValues.add('step');
      this.lockedValues.add('value');
      this.lockedValues.add('secondValue');
      this.isUpdated = false;
    }

    if (this.isReadyNotify) {
      this.state.lockedValues = Array.from(this.lockedValues);
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
    }

    if (props === 'all') {
      this.lockedValues.clear();
      this.isUpdated = false;
    }

    if (this.isReadyNotify) {
      this.state.lockedValues = Array.from(this.lockedValues);
    }

    if (!this.isUpdated) this.notify();
  }

  private initState(options?: Model.Options): Model.State {
    const defaultState = {
      maxValue: 10,
      minValue: 0,
      step: 1,
      value: 0,
      secondValue: null,
      lockedValues: [],
    };

    return options ? this.createState(defaultState, options) : defaultState;
  }

  private notify(): void {
    if (this.observers.size !== 0 && this.isReadyNotify) {
      this.observers.forEach((observer: Model.Observer): void => {
        observer.update();
      });

      this.isUpdated = true;
    }
  }

  private isLocked(value: string): boolean {
    return (this.lockedValues !== undefined && this.lockedValues.has(value));
  }

  private createState(state: Model.State, newState: Model.Options): Model.State {
    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    } = newState;

    if (newState.unlockValues && newState.unlockValues.length > 0) {
      this.unlockState(newState.unlockValues);
    }

    const isValidMaxVal = maxValue !== undefined && !this.isLocked('maxValue') && SliderModel.isValid(maxValue);
    const newMaxValue = isValidMaxVal ? Number(maxValue) : state.maxValue;

    const isValidMinVal = minValue !== undefined && !this.isLocked('minValue') && SliderModel.isValid(minValue);
    const newMinValue = isValidMinVal ? Number(minValue) : state.minValue;

    const isValidStep = step !== undefined && !this.isLocked('step') && SliderModel.isValid(step);
    const newStep = isValidStep ? Number(step) : state.step;

    const isValidState = newMaxValue > newMinValue && newStep > 0;
    if (!isValidState) return state;

    const resultState = {
      ...state,
      maxValue: newMaxValue,
      minValue: newMinValue,
      step: newStep,
    };

    const isValidValue = value !== undefined && !this.isLocked('value') && SliderModel.isValid(value);
    const newValue = isValidValue
      ? SliderModel.getMultipleStep(Number(value), resultState)
      : SliderModel.getMultipleStep(state.value, resultState);

    const isValidSecondVal = !this.isLocked('secondValue');


    if (newState.lockedValues && newState.lockedValues.length > 0) {
      this.lockState(newState.lockedValues);
    }

    if (!SliderModel.isEqualStates(state, resultState)) {
      this.isUpdated = false;
    }

    return {
      ...resultState,
      lockedValues: Array.from(this.lockedValues),
    };
  }

  static getMultipleStep(value: number, state: Model.State): number {
    const {
      step,
      maxValue: max,
      minValue: min,
    } = state;
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

  static isEqualStates(first: Model.State, second: Model.State): boolean {
    return (first.maxValue === second.maxValue)
      && (first.minValue === second.minValue)
      && (first.step === second.step)
      && (first.value === second.value)
      && (first.secondValue === second.secondValue);
  }

  static isValid(value: number): boolean {
    return !(value === null || Number.isNaN(value) || !Number.isFinite(value));
  }

  static fixVal(value: number, baseVal: number): number {
    if (!(baseVal % 1)) {
      return Number(value.toFixed(0));
    }

    const baseString = baseVal.toString();

    if (baseString.includes('e')) {
      const base = Number(baseString.split('e-')[1]);
      const fixBase = base > 20 ? 20 : base;
      return Number(value.toFixed(fixBase));
    }
    const base = baseString.split('.')[1].length;
    const fixBase = base > 20 ? 20 : base;
    return Number(value.toFixed(fixBase));
  }
}

export default SliderModel;
