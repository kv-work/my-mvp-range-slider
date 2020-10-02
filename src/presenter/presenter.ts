class SliderPresenter implements Presenter {
  private view: View;
  private model: Model;
  private viewObserver: View.Observer;
  private modelObserver: Model.Observer;
  private dataValues: App.Stringable[];
  private isChanging: boolean;
  private isReadyRender: boolean;
  private callbacks: {
    onStart: CallableFunction;
    onChange: CallableFunction;
    onFinish: CallableFunction;
    onUpdate: CallableFunction;
  };

  constructor(options: Presenter.Options) {
    this.model = options.model;
    this.view = options.view;
    this.callbacks = {
      onStart: options.onStart,
      onChange: options.onChange,
      onFinish: options.onFinish,
      onUpdate: options.onUpdate,
    };

    this.modelObserver = this.createModelObserver();
    this.viewObserver = this.createViewObserever();

    this.subscribeToModel();
    this.subscribeToView();

    this.dataValues = options.dataValues || [];

    this.isChanging = false;

    this.isReadyRender = true;
    this.renderView();
  }

  update(options: App.Option): void {
    this.isReadyRender = false;
    const { dataValues } = options;

    let modelOptions: Model.Options = {
      maxValue: options.maxValue,
      minValue: options.minValue,
      step: options.step,
      value: options.value,
      lockedValues: options.lockedValues,
      unlockValues: options.unlockValues,
    };

    if (Object.prototype.hasOwnProperty.call(options, 'secondValue')) {
      modelOptions.secondValue = options.secondValue;
    }

    let viewOptions: View.Options = {
      isHorizontal: options.isHorizontal,
      range: options.range,
      dragInterval: options.dragInterval,
      runner: options.runner,
      bar: options.bar,
      scale: options.scale,
      numOfScaleVal: options.numOfScaleVal,
      displayScaleValue: options.displayScaleValue,
      displayValue: options.displayValue,
      displayMin: options.displayMin,
      displayMax: options.displayMax,
      prefix: options.prefix,
      postfix: options.postfix,
    };

    if (dataValues) {
      if (dataValues.length > 1) {
        this.dataValues = dataValues;
        modelOptions = {
          ...modelOptions,
          unlockValues: 'all',
          maxValue: dataValues.length - 1,
          minValue: 0,
          step: 1,
          lockedValues: ['maxValue', 'minValue', 'step'],
        };
        viewOptions = {
          ...viewOptions,
          numOfScaleVal: dataValues.length - 2,
        };
      } else {
        this.dataValues = [];
        this.model.unlockState(['maxValue', 'minValue', 'step']);
      }
    }

    if (!SliderPresenter.isEmpty(modelOptions) || Object.prototype.hasOwnProperty.call(options, 'secondValue')) {
      this.model.updateState(modelOptions);
    }

    if (!SliderPresenter.isEmpty(viewOptions)) {
      this.view.update(viewOptions);
    }

    if (options.onStart && typeof options.onStart === 'function') {
      this.callbacks.onStart = options.onStart;
    }
    if (options.onChange && typeof options.onChange === 'function') {
      this.callbacks.onChange = options.onChange;
    }
    if (options.onFinish && typeof options.onFinish === 'function') {
      this.callbacks.onFinish = options.onFinish;
    }
    if (options.onUpdate && typeof options.onUpdate === 'function') {
      this.callbacks.onUpdate = options.onUpdate;
    }

    this.callbacks.onUpdate();

    this.isReadyRender = true;
    this.renderView();
  }

  getPresenterData(): Presenter.Data {
    return { dataValues: this.dataValues };
  }

  setUserData(data: App.Stringable[] | Model.Options): void {
    if (Array.isArray(data) && data.length > 1) {
      this.dataValues = data;
      this.update({
        unlockValues: 'all',
        maxValue: data.length - 1,
        minValue: 0,
        step: 1,
        lockedValues: ['maxValue', 'minValue', 'step'],
        numOfScaleVal: data.length - 2,
      });
    }
  }

  private renderView(): void {
    if (this.isReadyRender) {
      const modelState = this.model.getState();
      if (this.dataValues.length > 1) {
        this.view.render(modelState, this.dataValues);
      } else {
        this.view.render(modelState);
      }
    }
  }

  private createModelObserver(): Model.Observer {
    const modelObserver = {
      update: (): void => {
        const updatedModelState = this.model.getState();

        if (this.isChanging) {
          this.callbacks.onChange(updatedModelState);
        }
        this.renderView();
      },
    };

    return modelObserver;
  }

  private createViewObserever(): View.Observer {
    const viewObserver = {
      start: (): void => {
        this.callbacks.onStart(this.model.getState());
      },
      change: (values: [number, number] | number): void => {
        this.isChanging = true;
        const convertedValues = this.convertPercentToValue(values);
        if (Array.isArray(convertedValues)) {
          const [newValue, newSecondValue] = convertedValues;
          this.model.updateState({ value: newValue, secondValue: newSecondValue });
        } else {
          this.model.updateState({ value: convertedValues });
        }
      },
      finish: (): void => {
        this.callbacks.onFinish(this.model.getState());
      },
      update: (): void => {
        this.renderView();
      },
    };

    return viewObserver;
  }

  private convertPercentToValue(percentage: [number, number] | number): [number, number] | number {
    const { minValue, maxValue } = this.model.getState();
    let value: number;
    let secondValue: number;
    let values: [number, number] | number;

    if (Array.isArray(percentage)) {
      const [firstPercent, secondPercent] = percentage;
      value = ((maxValue - minValue) / 100) * firstPercent + minValue;
      secondValue = ((maxValue - minValue) / 100) * secondPercent + minValue;
      values = [value, secondValue];
    } else {
      values = ((maxValue - minValue) / 100) * percentage + minValue;
    }

    return values;
  }

  private subscribeToModel(): void {
    this.model.addObserver(this.modelObserver);
  }

  private subscribeToView(): void {
    this.view.addObserver(this.viewObserver);
  }

  static isEmpty(object: {}): boolean {
    const entries = Object.entries(object);
    let isEmpty = true;

    entries.forEach((entry) => {
      if (entry[1] !== undefined) {
        isEmpty = false;
      }
    });

    return isEmpty;
  }
}

export default SliderPresenter;
