// Type definitions for SliderModel
// Definitions by: Komarov Vyacheslav <github.com/kv-work/>

declare interface Observer {
  update?(): void;
  start?(): void;
  change?(values: [number, number] | number): void;
  finish?(values: [number, number] | number): void;
}

declare interface OptionsModel {
  maxValue?: number;
  minValue?: number;
  step?: number;
  value?: number;
  secondValue?: number;
}

declare interface Model {
  getState(): OptionsModel;
  updateState(state: OptionsModel): void;
  addObserver(observer: Observer): void;
  removeObserver(observer: Observer): void;
  unlockState(props: string[] | 'all'): void;
  lockState(props: string[] | 'all'): void;
}
