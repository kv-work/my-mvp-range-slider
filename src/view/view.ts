/* eslint-disable no-useless-return */
/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/semi */
import {
  View,
  ViewData,
  ViewRenderData,
  Observer,
} from '../types';

class SliderView implements View {
  private $container: JQuery;
  private viewOptions: ViewData;

  constructor(container: HTMLElement, options: ViewData) {
    this.$container = $(container);
    this.viewOptions = options;
  }

  render(renderData: ViewRenderData): void {}

  update(viewData: ViewData): void {}

  addObserver(observer: Observer): void {}

  removeObserver(observer: Observer): void {}

  getData(): ViewData {
    return
  }
}

export default SliderView;
