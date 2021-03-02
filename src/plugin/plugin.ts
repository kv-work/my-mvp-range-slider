import SliderApp from '../App/app';
import SliderModel from '../Model/model';
import SliderView from '../View/view';

$.fn.myMVPSlider = function createMVPSlider(options: App.Option): JQuery {
  const defaultSettings: App.Option = {
    maxValue: 100,
    minValue: 0,
    step: 1,
    value: 0,
    secondValue: null,

    // view
    isHorizontal: true,
    isRange: true,
    isDragInterval: false,
    hasRunner: true,
    hasBar: true,
    hasScale: true,
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
    onStart: () => { },
    onChange: () => { },
    onFinish: () => { },
    onUpdate: () => { },
  };

  function validateOptions(data: App.Option): App.Option {
    const optionsEntries = Object.entries(data);
    const opts = optionsEntries.filter((entry): boolean => {
      const key: string = entry[0];
      switch (key) {
        case 'maxValue':
        case 'minValue':
        case 'step':
        case 'value':
        case 'secondValue':
          return SliderModel.isValid(entry[1]);
        case 'isHorizontal':
        case 'isRange':
        case 'isDragInterval':
        case 'hasRunner':
        case 'hasBar':
        case 'hasScale':
        case 'displayScaleValue':
        case 'displayValue':
        case 'displayMin':
        case 'displayMax':
          return (typeof entry[1] === 'boolean');
        case 'numOfScaleVal':
          return (SliderView.isValidNumOfValue(entry[1]));
        case 'prefix':
        case 'postfix':
          return (typeof entry[1] === 'string');
        case 'dataValues':
          return (Array.isArray(entry[1]));
        case 'onStart':
        case 'onChange':
        case 'onFinish':
        case 'onUpdate':
          return (typeof entry[1] === 'function');
        default:
          return false;
      }
    });

    const resultOptions = opts.reduce((result, [key, value]) => (
      {
        ...result,
        [key]: value,
      }), {});

    return resultOptions;
  }

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
    this.each(function addPlugin(): void {
      const $this = $(this);
      const dataOptions = $this.data();
      const userSettings = $.extend({}, options, dataOptions);
      const validUserSettings = validateOptions(userSettings);
      const sliderSettings = $.extend({}, defaultSettings, validUserSettings);
      const app = new SliderApp(sliderSettings, this);

      $this.data('myMVPSlider', app);
      $this.data('init-options', sliderSettings);
    });
  }

  return this;
};
