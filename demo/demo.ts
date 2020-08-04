import './demo.css';

class Demo {
  private $container: JQuery;
  private slider: App;
  private $configPanel: JQuery;
  private settings: App.Option;
  // model config
  private $maxValInput: JQuery;
  private $minValInput: JQuery;
  private $stepInput: JQuery;
  private $valInput: JQuery;
  private $secondValInput: JQuery;
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

  constructor($container: JQuery, options?: App.Option) {
    this.$container = $container;

    const callbacks = {
      onStart: (): void => {},
      onChange: (): void => {
        this.onChangeSlider();
      },
      onFinish: (): void => {
        this.onChangeSlider();
      },
      onUpdate: (): void => {
        this.onChangeSlider();
      },
    };

    const newOptions = $.extend(options, callbacks);

    this.slider = this.$container.find('.js-slider').myMVPSlider(newOptions).data('myMVPSlider');

    this.settings = this.$container.find('.js-slider').data('init-options');

    this.$configPanel = this.$container.find('.js-congig_panel');


    this.initInputs();
    this.setInputValues(this.settings);
    this.attachEventHandlers();
  }

  private initInputs(): void {
    const { $configPanel } = this;

    this.$maxValInput = $configPanel.find('.input_max_val');
    this.$minValInput = $configPanel.find('.input_min_val');
    this.$stepInput = $configPanel.find('.input_step');
    this.$valInput = $configPanel.find('.input_val');
    this.$secondValInput = $configPanel.find('.input_second_val');

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
    this.$numScaleValRange = $configPanel.find('.input_num_scale_val');
    this.$displayMaxValCheck = $configPanel.find('.input_display_max');
    this.$displayMinValCheck = $configPanel.find('.input_display_min');
    this.$prefixInput = $configPanel.find('.input_prefix');

    this.$postfixInput = $configPanel.find('.input_postfix');
  }

  private setInputValues(settings: App.Option): void {
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
    } = this;

    $maxValInput.val(settings.maxValue);
    $minValInput.val(settings.minValue);
    $stepInput.val(settings.step);
    $valInput.val(settings.value);
    if (settings.secondValue !== undefined) {
      $secondValInput.val(settings.secondValue);
    } else {
      $secondValInput.val('');
    }

    if (settings.lockedValues && settings.lockedValues.length !== 0) {
      const { lockedValues } = settings;

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

    if (settings.isHorizontal) {
      $orientationRadio.find('[value="0"]').prop('checked', true);
    } else {
      $orientationRadio.find('[value="1"]').prop('checked', true);
    }
    $rangeCheck.prop('checked', settings.range);
    $dragIntervalCheck.prop('checked', settings.dragInterval);
    $barCheck.prop('checked', settings.bar);
    $runnerCheck.prop('checked', settings.runner);
    $scaleCheck.prop('checked', settings.scale);
    $displayValCheck.prop('checked', settings.displayValue);
    $displayScaleValCheck.prop('checked', settings.displayScaleValue);
    $numScaleValRange.val(settings.numOfScaleVal);
    $displayMaxValCheck.prop('checked', settings.displayMax);
    $displayMinValCheck.prop('checked', settings.displayMin);

    if (settings.prefix !== '') {
      $prefixInput.val(settings.prefix);
    }

    if (settings.postfix !== '') {
      $postfixInput.val(settings.postfix);
    }
  }

  private attachEventHandlers(): void {
    const {
      $configPanel,
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
      slider,
    } = this;

    const $inputs = $maxValInput
      .add($minValInput)
      .add($stepInput)
      .add($valInput)
      .add($secondValInput)
      .add($prefixInput)
      .add($postfixInput);

    const $checkbox = $lockMaxValCheck
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

    function unfocusInput(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
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

    function changeCheckbox(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
      const handler = (e: JQuery.ChangeEvent): void => {
        const elem = e.target;
        const val = $(elem).prop('checked');
        const { name } = elem;
        switch (name) {
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

    function changeRange(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
      const handler = (e: JQuery.ChangeEvent): void => {
        const val = +$(e.target).val();
        slider.update({ numOfScaleVal: val });
      };
      return handler;
    }

    function changeRadio(): JQuery.EventHandler<HTMLElement, JQuery.Event> {
      const handler = (): void => {
        const rotate = !slider.getViewData().isHorizontal;
        slider.update({ isHorizontal: rotate });
      };

      return handler;
    }

    $inputs.on('blur', unfocusInput());
    $checkbox.on('change', changeCheckbox());
    $numScaleValRange.on('change', changeRange());
    $orientationRadio.on('change', changeRadio());
  }

  private onChangeSlider(): void {
    this.settings = this.slider.getAllData();

    this.setInputValues(this.settings);
  }
}

$('.js-demo_slider').each(function setDemo(): void {
  const demo = new Demo($(this));
});
