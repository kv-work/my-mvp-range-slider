export default class Panel {
  private $container: JQuery;
  private slider: App;
  private $configPanel: JQuery;
  private $callbackIndicators: JQuery;
  private presets: App.Stringable[][];
  private currentPreset: number;
  private inputs: PanelInputs;

  constructor($container: JQuery) {
    this.$container = $container;

    this.slider = this.$container.find('.js-slider').data('myMVPSlider');

    this.$configPanel = this.$container.find('.js-config-form');
    this.$callbackIndicators = this.$container.find('.js-callback-indicators');

    this.presets = Panel.createPresets();
    this.currentPreset = 0;

    this.inputs = this.initInputs();
    this.setInputValues();
    this.addCallbacks();
    this.attachEventHandlers();
  }

  private initInputs(): PanelInputs {
    const { $configPanel } = this;

    const $maxValInput = $configPanel.find('.js-config__model-input_named-max-val');
    const $minValInput = $configPanel.find('.js-config__model-input_named-min-val');
    const $stepInput = $configPanel.find('.js-config__model-input_named-step');
    const $valInput = $configPanel.find('.js-config__model-input_named-val');
    const $secondValInput = $configPanel.find('.config__model-input_named-second-val');
    const $secondValCheck = $configPanel.find('.js-config__model-checkbox');

    const $lockMaxValCheck = $configPanel.find('.js-config__lock-checkbox_named-max-val');
    const $lockMinValCheck = $configPanel.find('.js-config__lock-checkbox_named-min-val');
    const $lockStepCheck = $configPanel.find('.js-config__lock-checkbox_named-step');
    const $lockValCheck = $configPanel.find('.js-config__lock-checkbox_named-val');
    const $lockSecondValCheck = $configPanel.find('.js-config__lock-checkbox_named-second-val');
    const $lockAllCheck = $configPanel.find('.js-config__lock-checkbox_named-all');

    const $orientationRadio = $configPanel.find('.js-config__orientation-radio');

    const $rangeCheck = $configPanel.find('.js-config__view-checkbox_named-range');
    const $dragIntervalCheck = $configPanel.find('.js-config__view-checkbox_named-drag-interval');
    const $barCheck = $configPanel.find('.js-config__view-checkbox_named-bar');
    const $runnerCheck = $configPanel.find('.js-config__view-checkbox_named-runner');
    const $scaleCheck = $configPanel.find('.js-config__view-checkbox_named-scale');
    const $displayValCheck = $configPanel.find('.js-config__view-checkbox_named-display-value');
    const $displayScaleValCheck = $configPanel.find('.js-config__view-checkbox_named-scale-value');
    const $numScaleValRange = $configPanel.find('.js-config__view-checkbox_named-num-scale-val');

    const $displayMaxValCheck = $configPanel.find('.js-config__view-checkbox_named-display-max');
    const $displayMinValCheck = $configPanel.find('.js-config__view-checkbox_named-display-min');
    const $prefixInput = $configPanel.find('.js-config__view-input_named-prefix');

    const $postfixInput = $configPanel.find('.js-config__view-input_named-postfix');

    const $presetsRadio = $configPanel.find('.js-config__presets-radio');

    const inputs: PanelInputs = {
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
    };

    return inputs;
  }

  private setInputValues(): void {
    const { slider } = this;
    const {
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
    } = this.inputs;

    const {
      maxValue,
      minValue,
      step,
      value,
      secondValue,
      lockedValues,
    } = slider.getModelData();

    const {
      isHorizontal = true,
      isRange,
      isDragInterval,
      hasBar,
      hasRunner,
      hasScale,
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

    if (secondValue !== undefined && secondValue !== null) {
      $secondValInput.val(secondValue);
    } else {
      $secondValInput.val('');
    }

    if (lockedValues.length !== 0) {
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
      $orientationRadio.eq(0).prop('checked', true);
    } else {
      $orientationRadio.eq(1).prop('checked', true);
    }
    this.changeOrientation(isHorizontal);

    $rangeCheck.prop('checked', isRange);
    $dragIntervalCheck.prop('checked', isDragInterval);
    $barCheck.prop('checked', hasBar);
    $runnerCheck.prop('checked', hasRunner);
    $scaleCheck.prop('checked', hasScale);
    $displayValCheck.prop('checked', displayValue);
    $displayScaleValCheck.prop('checked', displayScaleValue);

    if (numOfScaleVal) {
      $numScaleValRange.val(numOfScaleVal);
    }

    $displayMaxValCheck.prop('checked', displayMax);
    $displayMinValCheck.prop('checked', displayMin);

    if (prefix !== '' && prefix !== undefined) {
      $prefixInput.val(prefix);
    }

    if (postfix !== '' && postfix !== undefined) {
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
    } = this.inputs;

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

    const handleCheckboxChange = this.makeCheckboxChangeHandler();
    const handleRangeChange = this.makeRangeChangeHandler();
    const handleRadioChange = this.makeRadioChangeHandler();

    $inputs.on('blur', this.handleInputBlur.bind(this));
    $checkbox.on('change', handleCheckboxChange);
    $numScaleValRange.on('change', handleRangeChange);
    $orientationRadio.on('change', handleRadioChange);
    $presetsRadio.on('change', handleRadioChange);
  }

  private handleInputBlur(e: JQuery.BlurEvent): void {
    const { slider } = this;
    const elem = e.target;
    const newVal = $(elem).val();
    const { name } = elem;
    if (newVal) {
      switch (name) {
        case 'max-value':
          slider.update({ maxValue: Number(newVal) });
          break;
        case 'min-value':
          slider.update({ minValue: Number(newVal) });
          break;
        case 'step':
          slider.update({ step: Number(newVal) });
          break;
        case 'value':
          slider.update({ value: Number(newVal) });
          break;
        case 'second-value':
          slider.update({ secondValue: Number(newVal) });
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
    } else {
      this.setInputValues();
    }
  }

  private makeCheckboxChangeHandler(): (event: JQuery.ChangeEvent) => void {
    const { slider } = this;
    const { $secondValInput } = this.inputs;

    const handler = (e: JQuery.ChangeEvent): void => {
      const elem = e.target;
      const val = $(elem).prop('checked');
      const { name } = elem;
      switch (name) {
        case 'second-value':
          if (val) {
            $secondValInput.prop('disabled', false);
            const { secondValue } = slider.getModelData();
            slider.update({ secondValue });
          } else {
            $secondValInput.prop('disabled', true);
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
          slider.update({ isRange: val });
          break;
        case 'drag_interval':
          slider.update({ isDragInterval: val });
          break;
        case 'runner':
          slider.update({ hasRunner: val });
          break;
        case 'bar':
          slider.update({ hasBar: val });
          break;
        case 'scale':
          slider.update({ hasScale: val });
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

  private makeRangeChangeHandler(): (event: JQuery.ChangeEvent) => void {
    const { slider } = this;

    const handler = (e: JQuery.ChangeEvent): void => {
      const targetVal = $(e.target).val();
      if (targetVal) {
        const val = Number(targetVal);
        slider.update({ numOfScaleVal: val });
      }
    };
    return handler;
  }

  private makeRadioChangeHandler(): (event: JQuery.ChangeEvent) => void {
    const { slider } = this;

    const handler = (e: JQuery.ChangeEvent): void => {
      const elem = e.target;
      const { name, value } = elem;
      switch (name) {
        case 'presets':
          this.currentPreset = Number(value);
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
    if (isHorizontal && this.$container.hasClass('demo-slider_vertical')) {
      this.$container.removeClass('demo-slider_vertical');
      this.$configPanel.removeClass('config-form_vertical');
    }

    if (!isHorizontal && !this.$container.hasClass('demo-slider_vertical')) {
      this.$container.addClass('demo-slider_vertical');
      this.$configPanel.addClass('config-form_vertical');
    }
  }

  private lightIndicator(indicator: string): void {
    let $indicator: JQuery;
    switch (indicator) {
      case 'onStart':
        $indicator = this.$callbackIndicators.find('.js-callback-indicators__indicator_on-start')
          .css({ 'background-color': 'lime' });
        break;
      case 'onChange':
        $indicator = this.$callbackIndicators.find('.js-callback-indicators__indicator_on-change')
          .css({ 'background-color': 'lime' });
        break;
      case 'onFinish':
        $indicator = this.$callbackIndicators.find('.js-callback-indicators__indicator_on-finish')
          .css({ 'background-color': 'lime' });
        break;
      case 'onUpdate':
        $indicator = this.$callbackIndicators.find('.js-callback-indicators__indicator_on-update')
          .css({ 'background-color': 'lime' });
        break;
      default:
        break;
    }

    setTimeout(() => {
      $indicator.css({
        'background-color': '',
      });
    }, 500);
  }

  private onChangeSlider(): void {
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
    this.inputs.$numScaleValRange.attr('max', max);
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
