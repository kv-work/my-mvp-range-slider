// Type definitions for myMVPSlider
// Definitions by: Komarov Vyacheslav <github.com/kv-work/>

declare global {
  interface JQuery {
    myMVPSlider(options?: MyMVPSliderOptions | 'destroy'): JQuery;
  }
}

export interface MyMVPSliderOptions {
  // model
  maxValue?: number;
  minValue?: number;
  step?: number;
  value?: number;
  secondValue?: number | null;

  // view
  isHorizontal?: boolean;
  isRange?: boolean;
  dragInterval?: boolean;
  hasRunner?: boolean;
  hasBar?: boolean;
  hasScale?: boolean;
  scaleStep?: number;
  displayScaleValue?: boolean;
  displayValue?: boolean;
  displayMin?: boolean;
  displayMax?: boolean;
  prefix?: string;
  postfix?: string;

  // presenter
  dataValues?: Stringable[];

  // callbacks
  onStart?: CallableFunction;
  onChange?: CallableFunction;
  onFinish?: CallableFunction;
  onUpdate?: CallableFunction;
}

interface Stringable {
  toString(): string;
}
