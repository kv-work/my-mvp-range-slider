import { OptionsModel, Observer, ViewData, Model, View} from '../types'

import SliderModel from '../model/model';
// import Presenter from '../presenter/presenter';
import ViewBar from '../view-bar/view-bar';

export default class App {
  private options: OptionsModel
  private $node: JQuery
  private model: Model
  // private presenter: Presenter
  private view: View

  constructor(options: OptionsModel, node: HTMLElement) {
    this.options = options;

    // const presenterOptions: presenterOptions {}
    this.$node = $(node);
    this.model = new SliderModel(this.options);
    this.view = new ViewBar(node);
    // this.presenter = new Presenter(this.model, this.view, presenterOptions);
  }
}