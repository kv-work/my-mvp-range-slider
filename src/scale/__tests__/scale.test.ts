import SliderScale from '../scale';

describe('scale', () => {
  document.body.innerHTML = `
    <div id="view_container"></div>
    <div id="view_container_horizontal"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');

  let testScale: SliderScale;
  let verticalScale: SliderScale;

  const mockStart = jest.fn();
  const mockChange = jest.fn();
  const mockFinish = jest.fn();

  $horizontalView.bind('startChanging.myMVPSlider', mockStart);
  $horizontalView.bind('changeValue.myMVPSlider', mockChange);
  $horizontalView.bind('finish.myMVPSlider', mockFinish);

  $verticalView.bind('startChanging.myMVPSlider', mockStart);
  $verticalView.bind('changeValue.myMVPSlider', mockChange);
  $verticalView.bind('finish.myMVPSlider', mockFinish);

  const renderOptions: Scale.RenderOptions = {
    isHorizontal: true,
    displayScaleValue: true,
    displayMin: true,
    displayMax: true,
    numOfScaleVal: 9,
  };
  const vertRenderOptions: Scale.RenderOptions = {
    ...renderOptions,
    isHorizontal: false,
  };
  const testRenderData: View.RenderData = {
    data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  };

  beforeEach(() => {
    testScale = new SliderScale({ $viewContainer: $horizontalView });
    verticalScale = new SliderScale({ $viewContainer: $verticalView });
  });

  afterEach(() => {
    $horizontalView.empty();
    $verticalView.empty();
  });

  describe('constructor', () => {
    test('should save $view in prop', () => {
      expect(testScale).toHaveProperty('$view', $horizontalView);
    });

    test('should create $scale', () => {
      expect(testScale).toHaveProperty('$scale');
    });

    test('should reset isRendered flag', () => {
      expect(testScale).toHaveProperty('isRendered', false);
    });
  });

  describe('update', () => {
    let $horizontalScale: JQuery;
    let $verticalScale: JQuery;
    beforeEach(() => {
      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });
      verticalScale.update({
        data: testRenderData,
        options: vertRenderOptions,
      });

      $horizontalScale = $horizontalView.find('.slider__scale_horizontal');
      $verticalScale = $verticalView.find('.slider__scale');

      jest.clearAllMocks();
    });

    test('should create and save in prop jQuery element container of scale elements', () => {
      expect(testScale).toHaveProperty('$scale');
      expect(verticalScale).toHaveProperty('$scale');
    });

    test('should create and append scale elements (max 12 elements) to view container', () => {
      const $horizontalElements = $horizontalScale.find('.scale__element_horizontal');
      const $verticalElements = $verticalScale.find('.scale__element');

      expect($horizontalScale.length).toBe(1);
      expect($verticalScale.length).toBe(1);
      expect($horizontalElements.length).toBe(testRenderData.percentageData.length);
      expect($verticalElements.length).toBe(testRenderData.percentageData.length);
    });

    test('should append no more then 12 elements', () => {
      const newData = {
        data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        percentageData: [
          0, 6.25, 12.5, 18.75, 25,
          31.25, 37.5, 43.75, 50,
          56.25, 62.5, 68.75, 75,
          81.25, 87.5, 93.75, 100,
        ],
      };

      const newOpts: Scale.RenderOptions = {
        isHorizontal: true,
        displayScaleValue: true,
        displayMin: true,
        displayMax: true,
        numOfScaleVal: 15,
      };

      testScale.update({
        data: newData,
        options: newOpts,
      });
      const $elements = $horizontalView.find('.scale__element');
      expect($elements.length).toBe(12);
    });

    test('should not append scale elements to view container if options.numOfScaleVal <= 0', () => {
      testScale.update({
        data: testRenderData,
        options: { numOfScaleVal: -5 },
      });
      let $elements = $horizontalView.find('.scale__element');
      // should append only min and max values
      expect($elements.length).toBe(2);

      testScale.update({
        data: testRenderData,
        options: { numOfScaleVal: 0 },
      });

      $elements = $horizontalView.find('.scale__element');
      // should append only min and max values
      expect($elements.length).toBe(2);
    });

    test('should not append min value to scale container if options.displayMin is false', () => {
      testScale.update({
        data: testRenderData,
        options: {
          displayScaleValue: false,
          displayMin: false,
          displayMax: false,
        },
      });

      let $elements = $horizontalView.find('.scale__element');
      expect($elements.length).toBe(0);

      testScale.update({
        data: testRenderData,
        options: { displayMin: true },
      });
      $elements = $horizontalView.find('.scale__element');
      // should append min value
      expect($elements.length).toBe(1);
      expect($elements.html()).toBe('0');
      expect($elements.eq(0).data('percentage')).toBe(0);

      testScale.update({
        data: testRenderData,
        options: { displayMin: false },
      });
      $elements = $horizontalView.find('.scale__element');
      // should not append min value
      expect($elements.length).toBe(0);
    });

    test('should not append max value to scale container if options.displayMax is false', () => {
      testScale.update({
        data: testRenderData,
        options: {
          displayScaleValue: false,
          displayMin: false,
          displayMax: false,
        },
      });

      let $elements = $horizontalView.find('.scale__element');
      expect($elements.length).toBe(0);

      testScale.update({
        data: testRenderData,
        options: { displayMax: true },
      });
      $elements = $horizontalView.find('.scale__element');
      // should append max value
      expect($elements.length).toBe(1);
      expect($elements.html()).toBe('10');
      expect($elements.eq(0).data('percentage')).toBe(100);

      testScale.update({
        data: testRenderData,
        options: { displayMax: false },
      });
      $elements = $horizontalView.find('.scale__element');
      // should not append max value
      expect($elements.length).toBe(0);
    });

    test('should not append value elements (except min and max values) to scale container if options.displayScaleValue is false', () => {
      testScale.update({
        data: testRenderData,
        options: { displayScaleValue: false },
      });

      const $elements = $horizontalView.find('.scale__element');

      expect($elements.length).toBe(2);
      expect($elements.eq(0).html()).toBe('0');
      expect($elements.eq(0).data('percentage')).toBe(0);

      expect($elements.eq(1).html()).toBe('10');
      expect($elements.eq(1).data('percentage')).toBe(100);
    });

    test('should toggle "slider__scale_horizontal" class if options.isHorizontal changed', () => {
      expect($horizontalView.find('.slider__scale_horizontal').length).toBe(1);

      testScale.update({
        options: { isHorizontal: false },
        data: testRenderData,
      });
      expect($horizontalView.find('.slider__scale_horizontal').length).toBe(0);

      testScale.update({
        options: { isHorizontal: true },
        data: testRenderData,
      });
      expect($horizontalView.find('.slider__scale_horizontal').length).toBe(1);
    });

    test('should render element.toString() content', () => {
      const newData = {
        data: [
          { toString(): string { return '1'; } },
          { toString(): string { return 'second'; } },
          { toString(): string { return '3333'; } },
        ],
        percentageData: [0, 50, 100],
      };

      testScale.update({
        data: newData,
        options: renderOptions,
      });
      const $elements = $horizontalView.find('.scale__element');
      expect($elements.length).toBe(3);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should update scale if it is rendered', () => {
      const newData = { data: [3, 4, 5, 6, 7, 8], percentageData: [0, 20, 40, 60, 80, 100] };

      testScale.update({
        data: newData,
        options: renderOptions,
      });
      const $elements = $horizontalView.find('.scale__element');
      expect($elements.length).toBe(6);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should attach event handlers to scale elements', () => {
      const $scaleElement = $horizontalScale.find('.scale__element_horizontal').eq(5);

      expect($horizontalScale.find('.scale__element_horizontal').length).toBe(11);
      $scaleElement.click();
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(50);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(50);

      mockChange.mockClear();
      const $scaleClickEvent = $.Event('click', {
        target: $horizontalScale[0],
      });
      $horizontalScale.trigger($scaleClickEvent);
      expect(mockChange).not.toBeCalled();

      // if type of data is Array
      jest.clearAllMocks();
      const data: View.RenderData = {
        data: [2, 3, 4, 5, 6],
        percentageData: [0, 25, 50, 75, 100],
        value: [2, 6],
        percentage: [0, 100],
      };
      testScale.update({
        options: {},
        data,
      });

      expect($horizontalScale.data('data').percentage).toEqual([0, 100]);

      const $newScaleElem = $horizontalScale.find('.scale__element_horizontal').eq(3);
      expect($newScaleElem.data('percentage')).toBe(75);

      $newScaleElem.click();
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(75); // value
      expect(mockChange.mock.calls[0][2]).toBe(true); // isSecond
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(75); // value
      expect(mockFinish.mock.calls[0][2]).toBe(true); // isSecond

      jest.clearAllMocks();
      const $anotherScaleElem = $horizontalScale.find('.scale__element_horizontal').eq(1);
      expect($anotherScaleElem.data('percentage')).toBe(25);
      $anotherScaleElem.click();
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(25); // value
      expect(mockChange.mock.calls[0][2]).toBe(false); // isSecond
      expect(mockFinish.mock.calls[0][1]).toBe(25); // value
      expect(mockFinish.mock.calls[0][2]).toBe(false); // isSecond
    });
  });

  describe('destroy', () => {
    let $scale: JQuery;
    beforeEach(() => {
      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });

      $scale = $('.js-slider__scale');
      jest.clearAllMocks();
    });

    test('should detach scale container', () => {
      expect($scale.length).toBe(1);
      expect($scale.find('.scale__element').length).not.toBe(0);

      testScale.destroy();
      expect($('.js-slider__scale').length).toBe(0);
      expect($('#view_container').find('.scale__element').length).toBe(0);

      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });
      const $horizontalScale = $horizontalView.find('.slider__scale_horizontal');
      const $horizontalElements = $horizontalScale.find('.scale__element_horizontal');

      expect($horizontalScale.length).toBe(1);
      expect($horizontalElements.length).toBe(testRenderData.percentageData.length);
    });

    test('should reset isRendered flag', () => {
      testScale.destroy();
      expect(testScale).toHaveProperty('isRendered', false);
    });

    test('should remove scale elements event listeners', () => {
      const $clickEvent = $.Event('click');
      const scaleElement = $scale.find('.scale__element')[5];
      testScale.destroy();
      $(scaleElement).trigger($clickEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });
  });
});
