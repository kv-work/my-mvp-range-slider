import { OptionsModel, Observer, Model } from '../types';

export default class SliderModel implements Model {
  private maxCount: number
  private minCount: number
  private step: number
  private _count: number
  private observers: Set<Object>

  constructor(options?: OptionsModel) {
    if (options) {
      this.maxCount = options.maxCount;
      this.minCount = options.minCount;
      this.step = options.step;
      this._count = options.startCount;
    } else {
      this.maxCount = 10;
      this.minCount = 0;
      this.step = 1;
      this._count = 0;
    }

    this.observers = new  Set();
  }

  get count(): number {
    return this._count;
  }

  public incCount(): void {
    const { maxCount, step } = this;

    const newCount = this._count + step;

    if (newCount >= maxCount) {
      this.setCount(maxCount);
    } else {
      this.setCount(newCount);
    }
  }

  public decCount(): void {
    const { minCount, step } = this;

    const newCount = this._count - step;

    if ( newCount <= minCount ) {
      this.setCount(minCount);
    } else {
      this.setCount(newCount);
    }    
  }

  public setCount(value: number): void {
    const { maxCount, minCount } = this;
    if ( value > maxCount ) {
      throw new RangeError('Value greater then maximum value of slider')
    } else if ( value < minCount ) {
      throw new RangeError('Value less then minimum value of slider')
    } else if (this._count !== value) {
      this._count = value;
      this.notify();
    }  
  }

  public addObserver(observer: Observer): void {
    this.observers.add(observer)
  }

  public removeObserver(observer: Observer): void {
    this.observers.delete(observer)
  }

  private notify(): void {
    this.observers.forEach( (observer: Observer): void => {
      observer.update();
    } )
  }

  public getState(): OptionsModel {
    return
  }

  public updateState(state: OptionsModel): void {}
}