import SliderModel from '../model/model';
import SliderPresenter from '../presenter/presenter';
import SliderView from '../view/view';

export default class App {
  private options: App.Option;
  private node: HTMLElement;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: App.Option, node: HTMLElement) {
    this.options = options;
    this.node = node;

    this.createModel();
    this.createView();
    this.createPresenter();
  }

  private createModel(): void {
    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    } = this.options;

    this.model = new SliderModel({
      maxValue,
      minValue,
      step,
      value,
      secondValue,
    });
  }

  private createPresenter(): void {
    const {
      dataValues,
      onStart,
      onChange,
      onFinish,
      onUpdate,
    } = this.options;

    this.presenter = new SliderPresenter({
      model: this.model,
      view: this.view,
      dataValues,
      onStart,
      onChange,
      onFinish,
      onUpdate,
    });
  }

  private createView(): void {
    const {
      isHorizontal,
      range,
      dragInterval,
      runner,
      bar,
      scale,
      scaleStep,
      displayScaleValue,
      displayValue,
      displayMin,
      displayMax,
      prefix,
      postfix,
    } = this.options;

    this.view = new SliderView(this.node, {
      isHorizontal,
      range,
      dragInterval,
      runner,
      bar,
      scale,
      scaleStep,
      displayScaleValue,
      displayValue,
      displayMin,
      displayMax,
      prefix,
      postfix,
    });
  }
}
