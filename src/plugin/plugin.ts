/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import SliderApp from '../app/app';

(function ($: JQueryStatic): void {
  $.fn.myMVPSlider = function (options: App.Option): JQuery {
    let settings: App.Option = {
      maxValue: 100,
      minValue: 0,
      step: 1,
      value: 0,
      secondValue: undefined,

      // view
      isHorizontal: true,
      range: true,
      dragInterval: false,
      runner: true,
      bar: true,
      scale: true,
      numOfScaleVal: 3,
      displayScaleValue: true,
      displayValue: true,
      displayMin: true,
      displayMax: true,
      prefix: '',
      postfix: '',

      // presenter
      dataValues: [],

      // callbacks
      onStart: () => {},
      onChange: () => {},
      onFinish: () => {},
      onUpdate: () => {},
    };

    if (options === 'destroy') {
      this.each(function destroy(): void {
        const slider = $(this).data('myMVPSlider');
        if (slider) {
          slider.destroy();
          $(this).data({
            myMVPSlider: undefined,
            'init-options': undefined,
          });
        }
      });
    } else {
      if (options) {
        const optionsEntries = Object.entries(options);
        const validOpts = optionsEntries.map((entry): [string, unknown] => {
          const key: string = entry[0];
          switch (key) {
            case 'maxValue':
            case 'minValue':
            case 'step':
            case 'value':
            case 'secondValue':
              if (entry[1] === null || Number.isNaN(entry[1])) {
                break;
              }
              return entry;
            case 'isHorizontal':
            case 'range':
            case 'dragInterval':
            case 'runner':
            case 'bar':
            case 'scale':
            case 'displayScaleValue':
            case 'displayValue':
            case 'displayMin':
            case 'displayMax':
              if (typeof entry[1] === 'boolean') {
                return entry;
              }
              break;
            case 'numOfScaleVal':
              if (typeof entry[1] === 'number' && (entry[1] >= 0)) {
                return entry;
              }
              break;
            case 'prefix':
            case 'postfix':
              if (typeof entry[1] === 'string') {
                return entry;
              }
              break;
            case 'dataValues':
              if (Array.isArray(entry[1])) {
                return entry;
              }
              break;
            case 'onStart':
            case 'onChange':
            case 'onFinish':
            case 'onUpdate':
              if (typeof entry[1] === 'function') {
                return entry;
              }
              break;
            default:
              return entry;
          }
          return [key, settings[key]];
        });

        const resultData = validOpts.reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

        settings = $.extend(settings, resultData);
      }


      this.each(function addPlugin(): void {
        const $this = $(this);
        const app = new SliderApp(settings, this);

        $this.data('myMVPSlider', app);
        $this.data('init-options', settings);
      });
    }

    return this;
  };
}(jQuery));
