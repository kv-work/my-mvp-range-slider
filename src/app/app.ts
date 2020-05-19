/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import {
  OptionsModel,
  Model,
  View,
  Presenter,
  OptionsPresenter,
  ViewData,
  ApplicationOption,
} from '../types';

import SliderModel from '../model/model';
import SliderPresenter from '../presenter/presenter';
import SliderView from '../view/view';

export default class App {
  private options: OptionsModel;
  private $node: JQuery;
  private model: Model;
  private presenter: Presenter;
  private view: View;

  constructor(options: ApplicationOption, node: HTMLElement) {}
}
