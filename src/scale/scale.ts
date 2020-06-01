/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unused-vars */
import $ from 'jquery';

class SliderScale implements Scale {
  private $container: JQuery;
  private $scale: JQuery;
  private observer: Scale.Observer;

  constructor(options: Scale.Options) {
    this.observer = options.observer;
    this.$container = options.$viewContainer;

    this.createScale();
  }

  public render(data: App.Stringable[]): void {}

  public destroy(): void {}

  private createScale(): void {
    const $scaleContainer = $('<div>', {
      class: 'slider__scale',
    });

    this.$scale = $scaleContainer;
  }
}

export default SliderScale;
