declare interface Model {
  getState(): Model.State;
  updateState(state: Model.Options): void;
  addObserver(observer: Model.Observer): void;
  removeObserver(observer: Model.Observer): void;
  unlockState(props: string[] | 'all'): void;
  lockState(props: string[] | 'all'): void;
}

declare namespace Model {
  interface Options {
    maxValue?: number;
    minValue?: number;
    step?: number;
    value?: number;
    secondValue?: number;
    lockedValues?: string[] | 'all';
    unlockValues?: string[] | 'all';
  }

  interface Observer {
    update(): void;
  }

  interface State {
    maxValue: number;
    minValue: number;
    step: number;
    value: number;
    secondValue: number | undefined;
    lockedValues: string[];
  }
}
