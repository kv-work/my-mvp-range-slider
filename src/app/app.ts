import Model from '../model/model';
import Presenter from '../presenter/presenter';
import View from '../view/view';

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

  constructor(options: SliderOptions, $node: JQuery) {
    this.options = options;
    this.$node = $node;
    this.model = new Model();
    this.presenter = new Presenter();
    this.view = new View();
  }
}