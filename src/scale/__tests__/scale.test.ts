import $ from 'jquery';
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
    beforeEach(() => {
      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });
      verticalScale.update({
        data: testRenderData,
        options: vertRenderOptions,
      });
      jest.clearAllMocks();
    });

    test('should create and save in prop jQuery element container of scale elements', () => {
      expect(testScale).toHaveProperty('$scale');
      expect(verticalScale).toHaveProperty('$scale');
    });

    test('should create and append scale elements (max 12 elements) to view container', () => {
      const $view = $('#view_container_horizontal');
      const $horizontalScale = $view.find('.slider__scale_horizontal');
      const $verticalScale = $verticalView.find('.slider__scale');
      const $horizontalElements = $horizontalScale.find('.scale__element_horizontal');
      const $verticalElements = $verticalScale.find('.scale__element');

      expect($horizontalScale.length).toBe(1);
      expect($verticalScale.length).toBe(1);
      expect($horizontalElements.length).toBe(testRenderData.percentageData.length);
      expect($verticalElements.length).toBe(testRenderData.percentageData.length);
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
      const $container = $('#view_container_horizontal');
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
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(3);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should update scale if it is rendered', () => {
      const $container = $('#view_container_horizontal');
      const newData = { data: [3, 4, 5, 6, 7, 8], percentageData: [0, 20, 40, 60, 80, 100] };

      testScale.update({
        data: newData,
        options: renderOptions,
      });
      const $elements = $container.find('.scale__element');
      expect($elements.length).toBe(6);
      $elements.each(function test(idx: number) {
        expect($(this).html()).toBe(newData.data[idx].toString());
      });
    });

    test('should attach event handlers to scale elements', () => {
      const $scale = $horizontalView.find('.slider__scale');
      const $scaleElement = $scale.find('.scale__element_horizontal').eq(5);

      expect($scale.find('.scale__element_horizontal').length).toBe(11);
      $scaleElement.click();
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(50);
      expect(mockFinish).toBeCalledTimes(1);
      expect(mockFinish.mock.calls[0][1]).toBe(50);

      mockChange.mockClear();
      const $scaleClickEvent = $.Event('click', {
        target: $scale[0],
      });
      $scale.trigger($scaleClickEvent);
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

      expect($scale.data('data').percentage).toEqual([0, 100]);

      const $newScaleElem = $scale.find('.scale__element_horizontal').eq(3);
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
      const anotherScaleElem = $scale.find('.scale__element_horizontal')[1];
      expect($(anotherScaleElem).data('percentage')).toBe(25);
      $(anotherScaleElem).click();
      expect(mockStart).toBeCalledTimes(1);
      expect(mockChange.mock.calls[0][1]).toBe(25); // value
      expect(mockChange.mock.calls[0][2]).toBe(false); // isSecond
      expect(mockFinish.mock.calls[0][1]).toBe(25); // value
      expect(mockFinish.mock.calls[0][2]).toBe(false); // isSecond
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });
      jest.clearAllMocks();
    });

    test('should detach scale container', () => {
      const $scale = $('.js-slider__scale');
      expect($scale.length).toBe(1);
      expect($scale.find('.scale__element').length).not.toBe(0);

      testScale.destroy();
      expect($('.js-slider__scale').length).toBe(0);
      expect($('#view_container').find('.scale__element').length).toBe(0);

      testScale.update({
        data: testRenderData,
        options: renderOptions,
      });
      const $view = $('#view_container_horizontal');
      const $horizontalScale = $view.find('.slider__scale_horizontal');
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

      const $scale = $('.js-slider__scale');
      const scaleElement = $scale.find('.scale__element')[5];
      testScale.destroy();
      $(scaleElement).trigger($clickEvent);
      expect(mockChange).not.toBeCalled();
      expect(mockFinish).not.toBeCalled();
    });
  });
});
