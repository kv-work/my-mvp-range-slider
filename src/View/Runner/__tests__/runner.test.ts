import SliderRunner from '../runner';

describe('SliderRunner', () => {
  document.body.innerHTML = `
  <div id="view_container" class="js-slider__container">
    <div class="slider__bar_container"></div>
  </div>
  <div id="view_container_horizontal" class="js-slider__container">
    <div class="slider__bar_container"></div>
  </div>
  `;

  HTMLElement.prototype.getBoundingClientRect = (): DOMRect => ({
    x: 0,
    y: 0,
    height: 100,
    width: 100,
    bottom: 100,
    left: 0,
    right: 100,
    top: 0,
    toJSON: (): void => {},
  });

  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();

  const $horizontalView = $('#view_container_horizontal');
  $horizontalView.on('startChanging.myMVPSlider', mockStart);
  $horizontalView.on('changeValue.myMVPSlider', mockChange);
  $horizontalView.on('finish.myMVPSlider', mockFinish);

  const $verticalView = $('#view_container');
  $verticalView.on('startChanging.myMVPSlider', mockStart);
  $verticalView.on('changeValue.myMVPSlider', mockChange);
  $verticalView.on('finish.myMVPSlider', mockFinish);

  const $horizontalBarContainer = $horizontalView.find('.slider__bar_container');
  const $verticalBarContainer = $verticalView.find('.slider__bar_container');

  const renderData: View.RenderData = {
    value: 10,
    percentage: 10,
    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  };

  const horizontalOptions: Runner.RenderOptions = { isHorizontal: true };
  const verticalOptions: Runner.RenderOptions = { isHorizontal: false };

  const testOptions: Runner.InitOptions = {
    $viewContainer: $horizontalView,
    $barContainer: $horizontalBarContainer,
  };
  const testOptionsVertical: Runner.InitOptions = {
    $viewContainer: $verticalView,
    $barContainer: $verticalBarContainer,
  };

  let testRunner: SliderRunner;
  let vertRunner: SliderRunner;

  beforeEach(() => {
    testRunner = new SliderRunner(testOptions);
    vertRunner = new SliderRunner(testOptionsVertical);
  });

  describe('constructor', () => {
    test('should save $view in prop', () => {
      expect(testRunner).toHaveProperty('$view', $horizontalView);
      expect(vertRunner).toHaveProperty('$view', $verticalView);
    });

    test('should save $barContainer in prop', () => {
      expect(testRunner).toHaveProperty('$barContainer', $horizontalBarContainer);
      expect(vertRunner).toHaveProperty('$barContainer', $verticalBarContainer);
    });

    test('should reset isRendered flag', () => {
      expect(testRunner).toHaveProperty('isRendered', false);
      expect(vertRunner).toHaveProperty('isRendered', false);
    });

    test('should set isSecond flag, if it is not undefined', () => {
      expect(testRunner).toHaveProperty('isSecond', false);
      expect(vertRunner).toHaveProperty('isSecond', false);

      const newRunner = new SliderRunner({
        ...testOptions,
        isSecond: true,
      });

      expect(newRunner).toHaveProperty('isSecond', true);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      testRunner.update({
        data: renderData, options: horizontalOptions,
      });
      vertRunner.update({
        data: renderData, options: verticalOptions,
      });
      jest.clearAllMocks();
    });

    afterEach(() => {
      $horizontalBarContainer.empty();
      $verticalBarContainer.empty();
      $horizontalView.off('**');
      $verticalView.off('**');
    });

    test('should create $runner prop', () => {
      expect(testRunner).toHaveProperty('$runner');
      expect(vertRunner).toHaveProperty('$runner');
    });

    test('should append $runner to $view', () => {
      expect($horizontalView.find('.js-slider__runner').length).toBe(1);
      expect($verticalView.find('.js-slider__runner').length).toBe(1);
    });

    test('should save options and value in data attr', () => {
      const horizontalData = $horizontalView.find('.js-slider__runner').data();
      const verticalData = $verticalView.find('.js-slider__runner').data();

      expect(horizontalData).toEqual({
        options: { isHorizontal: true },
        value: renderData.value,
      });
      expect(verticalData).toEqual({
        options: { isHorizontal: false },
        value: renderData.value,
      });

      const newRunner = new SliderRunner({
        ...testOptions,
        isSecond: true,
      });

      const newData: View.RenderData = {
        value: [10, 40],
        percentage: [10, 40],
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      };
      const newOpts: Runner.RenderOptions = { isHorizontal: true };

      newRunner.update({ data: newData, options: newOpts });

      const $newRunner = $horizontalView.find('.runner_second');
      const newRunnerData = $newRunner.data();

      expect($newRunner.length).toBe(1);

      expect(newRunnerData).toEqual({
        options: { isHorizontal: true },
        value: 40,
      });

      testRunner.update({ data: newData, options: newOpts });
      expect(horizontalData).toEqual({
        options: { isHorizontal: true },
        value: 10,
      });
    });

    test('should update $runner if it is rendered', () => {
      let newData: View.RenderData = {
        value: 20,
        percentage: 20,
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      };

      testRunner.update({ data: newData, options: horizontalOptions });

      expect($horizontalView.find('.js-slider__runner').length).toBe(1);

      const horizontalData = $horizontalView.find('.js-slider__runner').data();
      expect(horizontalData).toEqual({
        options: { isHorizontal: true },
        value: newData.value,
      });

      expect($horizontalView.find('.slider__runner_horizontal').length).toBe(1);
      testRunner.update({
        data: newData,
        options: { isHorizontal: false },
      });
      expect($horizontalView.find('.slider__runner_horizontal').length).toBe(0);
      expect($horizontalView.find('.slider__runner').length).toBe(1);

      newData = {
        value: [0, 100],
        percentage: [0, 100],
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      };
      const newRunner = new SliderRunner({
        ...testOptions,
        isSecond: true,
      });

      testRunner.update({ data: newData, options: horizontalOptions });
      newRunner.update({ data: newData, options: horizontalOptions });
      const $newRunner = $horizontalView.find('.runner_second');
      let testRunnerVal = $horizontalView.find('.runner_first').data('value');
      const newRunnerData = $newRunner.data();
      expect(testRunnerVal).toBe(0);
      expect(newRunnerData.value).toBe(100);

      newData = {
        value: 0,
        percentage: 0,
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      };
      testRunner.update({ data: newData, options: horizontalOptions });
      testRunnerVal = $horizontalView.find('.runner_first').data('value');
      expect($horizontalView.find('.runner_first').length).toBe(1);
      expect(testRunnerVal).toBe(0);

      newData = {
        value: 100,
        percentage: 100,
        data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
        percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      };
      testRunner.update({ data: newData, options: horizontalOptions });
      testRunnerVal = $horizontalView.find('.runner_first').data('value');
      expect(testRunnerVal).toBe(100);
    });

    test('should attach mouse events handlers to $runner', () => {
      const $mouseDownEvent = $.Event('mousedown');
      const $mouseMoveEvent = $.Event('mousemove', {
        clientX: 70,
        clientY: 50,
      });
      const $AnotherMouseMoveEvent = $.Event('mousemove', {
        clientX: 90,
        clientY: 20,
      });
      const mouseUpEvent = new Event('mouseup');

      $horizontalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(0);

      $verticalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(0);

      const $horizontalRunner = $horizontalView.find('.js-slider__runner');

      $horizontalRunner.trigger($mouseDownEvent);
      expect(mockStart).toBeCalledTimes(1);

      $horizontalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(2);
      expect(mockChange.mock.calls[0][1]).toBe(70);
      expect(mockChange.mock.calls[0][2]).toBe(false);
      expect(mockChange.mock.calls[1][1]).toBe(90);
      expect(mockChange.mock.calls[1][2]).toBe(false);

      document.dispatchEvent(mouseUpEvent);
      expect(mockFinish).toBeCalledTimes(1);

      mockChange.mockClear();
      mockFinish.mockClear();

      const $verticalRunner = $verticalView.find('.js-slider__runner');
      $verticalRunner.trigger($mouseDownEvent);
      $verticalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(2);
      expect(mockChange.mock.calls[0][1]).toBe(50);
      expect(mockChange.mock.calls[0][2]).toBe(false);
      expect(mockChange.mock.calls[1][1]).toBe(20);
      expect(mockChange.mock.calls[1][2]).toBe(false);

      document.dispatchEvent(mouseUpEvent);
      expect(mockFinish).toBeCalledTimes(1);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      testRunner.update({ data: renderData, options: horizontalOptions });
      vertRunner.update({ data: renderData, options: verticalOptions });
      jest.clearAllMocks();
    });

    test('should detach runner', () => {
      testRunner.destroy();
      vertRunner.destroy();
      expect($horizontalView.find('.js-slider__runner').length).toBe(0);
      expect($verticalView.find('.js-slider__runner').length).toBe(0);
      testRunner.update({ data: renderData, options: horizontalOptions });
      expect($horizontalView.find('.js-slider__runner').length).toBe(1);
      testRunner.destroy();
    });

    test('should reset isRendered flag', () => {
      testRunner.destroy();
      vertRunner.destroy();
      expect(testRunner).toHaveProperty('isRendered', false);
      expect(vertRunner).toHaveProperty('isRendered', false);
    });

    test('should remove event listeners', () => {
      const $mouseDownEvent = $.Event('mousedown');
      const $mouseMoveEvent = $.Event('mousemove', {
        clientX: 70,
        clientY: 50,
      });
      const $AnotherMouseMoveEvent = $.Event('mousemove', {
        clientX: 90,
        clientY: 20,
      });
      const mouseUpEvent = new Event('mouseup');

      testRunner.destroy();
      vertRunner.destroy();

      const $runner = $('.js-slider__runner');
      expect($runner.length).toBe(0);

      mockChange.mockClear();
      $runner.trigger($mouseDownEvent);
      expect(mockStart).toBeCalledTimes(0);

      $horizontalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(0);
      $verticalView
        .trigger($mouseMoveEvent)
        .trigger($AnotherMouseMoveEvent);
      expect(mockChange).toBeCalledTimes(0);

      document.dispatchEvent(mouseUpEvent);
      expect(mockFinish).toBeCalledTimes(0);
    });
  });
});
