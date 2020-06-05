/* eslint-disable @typescript-eslint/no-useless-constructor */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable class-methods-use-this */
import $ from 'jquery';

class SliderRunner implements Runner {
  constructor(options: Runner.InitOptions) {}

  render(data: number, options: Runner.RenderOptions): void {}

  destroy(): void {}
}

export default SliderRunner;
