export default class Panel {
  private $container: JQuery;
  private slider: App;
  private $configPanel: JQuery;
  private $callbackIndicators: JQuery;
  private settings: App.Option;
  private presets: App.Stringable[][];
  private currentPreset?: number;
  private $presetsRadio: JQuery;
  // model config
  private $maxValInput: JQuery;
  private $minValInput: JQuery;
  private $stepInput: JQuery;
  private $valInput: JQuery;
  private $secondValInput: JQuery;
  private $secondValCheck: JQuery;
  // presenter config
  private $lockMaxValCheck: JQuery;
  private $lockMinValCheck: JQuery;
  private $lockStepCheck: JQuery;
  private $lockValCheck: JQuery;
  private $lockSecondValCheck: JQuery;
  private $lockAllCheck: JQuery;
  // view config
  private $orientationRadio: JQuery;
  private $rangeCheck: JQuery;
  private $dragIntervalCheck: JQuery;
  private $barCheck: JQuery;
  private $runnerCheck: JQuery;
  private $scaleCheck: JQuery;
  private $displayValCheck: JQuery;
  private $displayScaleValCheck: JQuery;
  private $numScaleValRange: JQuery;
  private $displayMaxValCheck: JQuery;
  private $displayMinValCheck: JQuery;
  private $prefixInput: JQuery;
  private $postfixInput: JQuery;

  constructor($container: JQuery) {
    this.$container = $container;

    this.slider = this.$container.find('.js-slider').data('myMVPSlider');

    this.$configPanel = this.$container.find('.js-config_panel');
    this.$callbackIndicators = this.$container.find('.callback_indicators');

    this.settings = this.$container.find('.js-slider').data('init-options');

    this.presets = Panel.createPresets();
    this.currentPreset = 0;

    this.initInputs();
    this.setInputValues();
    this.addCallbacks();
    this.attachEventHandlers();
  }

  private initInputs(): void {
    const { $configPanel } = this;

    this.$maxValInput = $configPanel.find('.input_max_val');
    this.$minValInput = $configPanel.find('.input_min_val');
    this.$stepInput = $configPanel.find('.input_step');
    this.$valInput = $configPanel.find('.input_val');
    this.$secondValInput = $configPanel.find('.input_second_val');
    this.$secondValCheck = $configPanel.find('.input_second_val_check');

    this.$lockMaxValCheck = $configPanel.find('.input_lock_max');
    this.$lockMinValCheck = $configPanel.find('.input_lock_min');
    this.$lockStepCheck = $configPanel.find('.input_lock_step');
    this.$lockValCheck = $configPanel.find('.input_lock_val');
    this.$lockSecondValCheck = $configPanel.find('.input_lock_second_val');
    this.$lockAllCheck = $configPanel.find('.input_lock_all');

    this.$orientationRadio = $configPanel.find('.input_orientation');

    this.$rangeCheck = $configPanel.find('.input_range');
    this.$dragIntervalCheck = $configPanel.find('.input_drag_interval');
    this.$barCheck = $configPanel.find('.input_bar');
    this.$runnerCheck = $configPanel.find('.input_runner');
    this.$scaleCheck = $configPanel.find('.input_scale');
    this.$displayValCheck = $configPanel.find('.input_display_value');
    this.$displayScaleValCheck = $configPanel.find('.input_scale_value');
    this.$numScaleValRange = $configPanel.find('input[name="num_scale_val"]');
    this.$displayMaxValCheck = $configPanel.find('.input_display_max');
    this.$displayMinValCheck = $configPanel.find('.input_display_min');
    this.$prefixInput = $configPanel.find('.input_prefix');

    this.$postfixInput = $configPanel.find('.input_postfix');

    // presets
    this.$presetsRadio = $configPanel.find('[name="presets"]');
  }

  private setInputValues(): void {
    const {
      slider,
      $maxValInput,
      $minValInput,
      $stepInput,
      $valInput,
      $secondValInput,
      $lockMaxValCheck,
      $lockMinValCheck,
      $lockStepCheck,
      $lockValCheck,
      $lockSecondValCheck,
      $lockAllCheck,
      $orientationRadio,
      $rangeCheck,
      $dragIntervalCheck,
      $barCheck,
      $runnerCheck,
      $scaleCheck,
      $displayValCheck,
      $displayScaleValCheck,
      $numScaleValRange,
      $displayMaxValCheck,
      $displayMinValCheck,
      $prefixInput,
      $postfixInput,
      $presetsRadio,
    } = this;

    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
      lockedValues,
    } = slider.getModelData();

    const {
      isHorizontal,
      range,
      dragInterval,
      bar,
      runner,
      scale,
      displayValue,
      displayScaleValue,
      numOfScaleVal,
      displayMax,
      displayMin,
      prefix,
      postfix,
    } = slider.getViewData();

    $maxValInput.val(maxValue);
    $minValInput.val(minValue);
    $stepInput.val(step);
    $valInput.val(value);
    if (secondValue !== undefined) {
      $secondValInput.val(secondValue);
    } else {
      $secondValInput.val('');
    }

    if (lockedValues) {
      $lockMaxValCheck.prop('checked', lockedValues.includes('maxValue'));
      $lockMinValCheck.prop('checked', lockedValues.includes('minValue'));
      $lockStepCheck.prop('checked', lockedValues.includes('step'));
      $lockValCheck.prop('checked', lockedValues.includes('value'));
      $lockSecondValCheck.prop('checked', lockedValues.includes('secondValue'));

      const isAllLocked = [
        lockedValues.includes('maxValue'),
        lockedValues.includes('minValue'),
        lockedValues.includes('step'),
        lockedValues.includes('value'),
        lockedValues.includes('secondValue'),
      ].reduce((p, c): boolean => (p && c), true);

      $lockAllCheck.prop('checked', isAllLocked);
    }

    if (isHorizontal) {
      $orientationRadio.find('[value="0"]').prop('checked', true);
    } else {
      $orientationRadio.find('[value="1"]').prop('checked', true);
    }
    this.changeOrientation(isHorizontal);

    $rangeCheck.prop('checked', range);
    $dragIntervalCheck.prop('checked', dragInterval);
    $barCheck.prop('checked', bar);
    $runnerCheck.prop('checked', runner);
    $scaleCheck.prop('checked', scale);
    $displayValCheck.prop('checked', displayValue);
    $displayScaleValCheck.prop('checked', displayScaleValue);
    $numScaleValRange.val(numOfScaleVal);
    $displayMaxValCheck.prop('checked', displayMax);
    $displayMinValCheck.prop('checked', displayMin);

    if (prefix !== '') {
      $prefixInput.val(prefix);
    }

    if (postfix !== '') {
      $postfixInput.val(postfix);
    }

    if (this.currentPreset) {
      const selector = `input[value="${this.currentPreset}"]`;
      const $preset = $presetsRadio.closest(selector);
      $preset.prop('checked', true);
    } else {
      $presetsRadio.find('[value="0"]').prop('checked', true);
    }
  }

  private addCallbacks(): void {
    const callbacks = {
      onStart: (): void => {
        this.lightIndicator('onStart');
      },
      onChange: (): void => {
        this.lightIndicator('onChange');
        this.onChangeSlider();
      },
      onFinish: (): void => {
        this.lightIndicator('onFinish');
        this.onChangeSlider();
      },
      onUpdate: (): void => {
        this.lightIndicator('onUpdate');
        this.onChangeSlider();
      },
    };
    this.slider.update(callbacks);
  }

  private attachEventHandlers(): void {
    const {
      $maxValInput,
      $minValInput,
      $stepInput,
      $valInput,
      $secondValInput,
      $secondValCheck,
      $lockMaxValCheck,
      $lockMinValCheck,
      $lockStepCheck,
      $lockValCheck,
      $lockSecondValCheck,
      $lockAllCheck,
      $orientationRadio,
      $rangeCheck,
      $dragIntervalCheck,
      $barCheck,
      $runnerCheck,
      $scaleCheck,
      $displayValCheck,
      $displayScaleValCheck,
      $numScaleValRange,
      $displayMaxValCheck,
      $displayMinValCheck,
      $prefixInput,
      $postfixInput,
      $presetsRadio,
    } = this;

    const $inputs = $maxValInput
      .add($minValInput)
      .add($stepInput)
      .add($valInput)
      .add($secondValInput)
      .add($prefixInput)
      .add($postfixInput);

    const $checkbox = $lockMaxValCheck
      .add($secondValCheck)
      .add($lockMinValCheck)
      .add($lockStepCheck)
      .add($lockValCheck)
      .add($lockSecondValCheck)
      .add($lockAllCheck)
      .add($rangeCheck)
      .add($dragIntervalCheck)
      .add($barCheck)
      .add($runnerCheck)
      .add($scaleCheck)
      .add($displayValCheck)
      .add($displayScaleValCheck)
      .add($displayMaxValCheck)
      .add($displayMinValCheck);

    const unfocusInputHandler = this.createUnfocusHandler();
    const changeCheckboxHandler = this.createChangeHandler();
    const changeRangeHandler = this.createChangeRangeHandler();
    const changeRadioHandler = this.createChangeRadioHandler();

    $inputs.on('blur', unfocusInputHandler);
    $checkbox.on('change', changeCheckboxHandler);
    $numScaleValRange.on('change', changeRangeHandler);
    $orientationRadio.on('change', changeRadioHandler);
    $presetsRadio.on('change', changeRadioHandler);
  }

  private createUnfocusHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const { slider } = this;
    const handler = (e: JQuery.BlurEvent): void => {
      const elem = e.target;
      const newVal = $(elem).val();
      const { name } = elem;
      switch (name) {
        case 'max-value':
          slider.update({ maxValue: +newVal });
          break;
        case 'min-value':
          slider.update({ minValue: +newVal });
          break;
        case 'step':
          slider.update({ step: +newVal });
          break;
        case 'value':
          slider.update({ value: +newVal });
          break;
        case 'second-value':
          if (!newVal) {
            slider.update({ secondValue: undefined });
          } else {
            slider.update({ secondValue: +newVal });
          }
          break;
        case 'prefix':
          slider.update({ prefix: newVal.toString() });
          break;
        case 'postfix':
          slider.update({ postfix: newVal.toString() });
          break;
        default:
          break;
      }
    };

    return handler;
  }

  private createChangeHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const { slider } = this;

    const handler = (e: JQuery.ChangeEvent): void => {
      const elem = e.target;
      const val = $(elem).prop('checked');
      const { name } = elem;
      switch (name) {
        case 'second-value':
          if (val) {
            this.$secondValInput.prop('disabled', false);
            const { secondValue } = slider.getModelData();
            slider.update({ secondValue });
          } else {
            this.$secondValInput.prop('disabled', true);
            slider.update({ secondValue: undefined });
          }
          break;
        case 'lock_max':
          if (val) {
            slider.lockValues(['maxValue']);
          } else {
            slider.unlockValues(['maxValue']);
          }
          break;
        case 'lock_min':
          if (val) {
            slider.lockValues(['minValue']);
          } else {
            slider.unlockValues(['minValue']);
          }
          break;
        case 'lock_step':
          if (val) {
            slider.lockValues(['step']);
          } else {
            slider.unlockValues(['step']);
          }
          break;
        case 'lock_val':
          if (val) {
            slider.lockValues(['value']);
          } else {
            slider.unlockValues(['value']);
          }
          break;
        case 'lock_second_val':
          if (val) {
            slider.lockValues(['secondValue']);
          } else {
            slider.unlockValues(['secondValue']);
          }
          break;
        case 'lock_all':
          if (val) {
            slider.lockValues('all');
          } else {
            slider.unlockValues('all');
          }
          break;
        case 'range':
          slider.update({ range: val });
          break;
        case 'drag_interval':
          slider.update({ dragInterval: val });
          break;
        case 'runner':
          slider.update({ runner: val });
          break;
        case 'bar':
          slider.update({ bar: val });
          break;
        case 'scale':
          slider.update({ scale: val });
          break;
        case 'display_value':
          slider.update({ displayValue: val });
          break;
        case 'scale_value':
          slider.update({ displayScaleValue: val });
          break;
        case 'display_min':
          slider.update({ displayMin: val });
          break;
        case 'display_max':
          slider.update({ displayMax: val });
          break;
        default:
          break;
      }
    };

    return handler;
  }

  private createChangeRangeHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const { slider } = this;

    const handler = (e: JQuery.ChangeEvent): void => {
      const val = +$(e.target).val();
      slider.update({ numOfScaleVal: val });
    };
    return handler;
  }

  private createChangeRadioHandler(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
    const { slider } = this;

    const handler = (e: JQuery.ChangeEvent): void => {
      const elem = e.target;
      const { name, value } = elem;
      switch (name) {
        case 'presets':
          this.currentPreset = +value;
          this.setPreset();
          this.addCallbacks();
          break;
        case 'orientation':
          slider.update({ isHorizontal: !slider.getViewData().isHorizontal });
          this.changeOrientation(value === '0');
          break;
        default:
          break;
      }
    };

    return handler;
  }

  private changeOrientation(isHorizontal: boolean): void {
    if (isHorizontal && this.$container.hasClass('demo_slider_vertical')) {
      this.$container.removeClass('demo_slider_vertical');
      this.$configPanel.removeClass('config_form_vertical');
    }

    if (!isHorizontal && !this.$container.hasClass('demo_slider_vertical')) {
      this.$container.addClass('demo_slider_vertical');
      this.$configPanel.addClass('config_form_vertical');
    }
  }

  private lightIndicator(indicator: string): void {
    let indicatorClass: string;
    switch (indicator) {
      case 'onStart':
        indicatorClass = '.indicator__on-start';
        break;
      case 'onChange':
        indicatorClass = '.indicator__on-change';
        break;
      case 'onFinish':
        indicatorClass = '.indicator__on-finish';
        break;
      case 'onUpdate':
        indicatorClass = '.indicator__on-update';
        break;
      default:
        break;
    }
    const $indicator = this.$callbackIndicators.find(indicatorClass);

    $indicator.css({
      'background-color': 'lime',
    });

    setTimeout(() => {
      $indicator.css({
        'background-color': '',
      });
    }, 500);
  }

  private onChangeSlider(): void {
    this.settings = this.slider.getAllData();

    this.setInputValues();
  }

  private setPreset(): void {
    const preset = this.currentPreset;
    this.slider.setUserData(this.presets[preset]);
    let max: number;
    if (this.presets[preset].length > 1 && this.presets[preset].length < 12) {
      max = this.presets[preset].length - 2;
    } else {
      max = 10;
    }
    this.$numScaleValRange.attr('max', max);
  }

  static createPresets(): App.Stringable[][] {
    const week = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
    const year = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const presets: App.Stringable[][] = [[]];

    presets.push(week);
    presets.push(year);

    return presets;
  }
}
