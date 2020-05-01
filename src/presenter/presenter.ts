import Model from "../model/model";
import { Observer, View } from '../types';


export default class Presenter {
  private views: Set<View>
  private model: Model
  private viewObserver: Observer
  private modelObserver: Observer
}