import Model, { OptionsModel } from '../model/model';
import Presenter from '../presenter/presenter';
import View from '../view-slider/view-slider';

interface SliderOptions {
  maxCount: number,
  minCount: number,
  startCount: number,
  step: number
}

export default class App {
  private options: SliderOptions
  private $node: JQuery
  private model: Model
  private presenter: Presenter
  private view: View

  constructor(options: SliderOptions, node: HTMLElement) {
    this.options = options;
    const modelOptions: OptionsModel = {
      maxCount: this.options.maxCount,
      minCount: this.options.minCount,
      startCount: this.options.startCount,
      step: this.options.step
    }
    // const presenterOptions: presenterOptions {}
    this.$node = $(node);
    this.model = new Model(modelOptions);
    this.view = new View(node);
    // this.presenter = new Presenter(this.model, this.view, presenterOptions);
  }
}