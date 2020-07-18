import SliderValuesDisplay from '../values-display';

describe('SliderValuesDisplay', () => {
  document.body.innerHTML = `
    <div id="view_container"></div>
    <div id="view_container_horizontal"></div>
  `;

  const $horizontalView = $('#view_container_horizontal');
  const $verticalView = $('#view_container');

  let testValDisplay: SliderValuesDisplay;
  let vertValDisplay: SliderValuesDisplay;

  const updOpts: ValuesDisplay.UpdateOptions = {
    isHorizontal: true,
    prefix: '+',
    postfix: '$',
  };
  const vertUpdOpts: ValuesDisplay.UpdateOptions = {
    ...updOpts,
    isHorizontal: false,
  };

  const renderData: View.RenderData = {
    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    value: 10,
    percentage: 10,
  };
  const rangeRenderData: View.RenderData = {
    data: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    percentageData: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    value: [10, 50],
    percentage: [10, 50],
  };

  beforeEach(() => {
    testValDisplay = new SliderValuesDisplay({ $viewContainer: $horizontalView });
    vertValDisplay = new SliderValuesDisplay({ $viewContainer: $verticalView });
  });

  describe('constructor', () => {
    test('should save $view in prop', () => {
      expect(testValDisplay).toHaveProperty('$view', $horizontalView);
      expect(vertValDisplay).toHaveProperty('$view', $verticalView);
    });

    test('should create $displayContainer element', () => {
      expect(testValDisplay).toHaveProperty('$displayContainer');
      expect(vertValDisplay).toHaveProperty('$displayContainer');
    });

    test('should reset isRendered flag', () => {
      expect(testValDisplay).toHaveProperty('isRendered', false);
      expect(vertValDisplay).toHaveProperty('isRendered', false);
    });
  });

  describe('update', () => {
    beforeEach(() => {
      testValDisplay.update(renderData, updOpts);
      vertValDisplay.update(renderData, vertUpdOpts);
    });

    afterEach(() => {
      testValDisplay.destroy();
      vertValDisplay.destroy();
    });

    test('should add "slider__display_container_horizontal" class to $displayContainer if options.isHorizontal is true', () => {
      expect($horizontalView.find('.slider__display_container').length).toBe(1);
      expect($horizontalView.find('.slider__display_container_horizontal').length).toBe(1);
      expect($verticalView.find('.slider__display_container').length).toBe(1);
      expect($verticalView.find('.slider__display_container_horizontal').length).toBe(0);

      vertValDisplay.update(renderData, updOpts);
      expect($verticalView.find('.slider__display_container_horizontal').length).toBe(1);
      vertValDisplay.update(renderData, vertUpdOpts);
      expect($verticalView.find('.slider__display_container_horizontal').length).toBe(0);
    });

    test('should create and append $valueDisplay and $secondValueDisplay (if data.value is array) to $displayContainer', () => {
      const $horizontalDisplay = $horizontalView.find('.slider__display_container');
      const $verticalDisplay = $verticalView.find('.slider__display_container');

      expect($horizontalDisplay.find('.slider__display_value').length).toBe(1);
      expect($verticalDisplay.find('.slider__display_value').length).toBe(1);

      testValDisplay.update(rangeRenderData, updOpts);
      vertValDisplay.update(rangeRenderData, vertUpdOpts);
      expect($horizontalDisplay.find('.slider__display_value').length).toBe(2);
      expect($verticalDisplay.find('.slider__display_value').length).toBe(2);

      testValDisplay.update(renderData, updOpts);
      vertValDisplay.update(renderData, vertUpdOpts);

      expect($horizontalDisplay.find('.slider__display_value').length).toBe(1);
      expect($verticalDisplay.find('.slider__display_value').length).toBe(1);

      testValDisplay.destroy();
      vertValDisplay.destroy();

      expect($horizontalDisplay.find('.slider__display_value').length).toBe(0);
      expect($verticalDisplay.find('.slider__display_value').length).toBe(0);

      testValDisplay.update(rangeRenderData, updOpts);
      vertValDisplay.update(rangeRenderData, vertUpdOpts);

      expect($horizontalDisplay.find('.slider__display_value').length).toBe(2);
      expect($verticalDisplay.find('.slider__display_value').length).toBe(2);
    });

    test('should append $displayContainer to $view', () => {
      const $horizontalDisplay = $horizontalView.find('.slider__display_container');
      const $verticalDisplay = $verticalView.find('.slider__display_container');

      expect($horizontalDisplay.length).toBe(1);
      expect($verticalDisplay.length).toBe(1);
    });

    test('should set isRendered flag to true', () => {
      expect(testValDisplay).toHaveProperty('isRendered', true);
      expect(vertValDisplay).toHaveProperty('isRendered', true);
    });

    test('should add prefix and postfix to values', () => {
      const $horizontalDisplay = $horizontalView.find('.slider__display_container');
      const $verticalDisplay = $verticalView.find('.slider__display_container');

      expect($horizontalDisplay.find('.slider__display_value').html()).toBe('+10$');
      expect($verticalDisplay.find('.slider__display_value').html()).toBe('+10$');

      testValDisplay.update(rangeRenderData, updOpts);
      vertValDisplay.update(rangeRenderData, vertUpdOpts);

      expect($horizontalDisplay.find('.slider__display_value').eq(0).html()).toBe('+10$');
      expect($horizontalDisplay.find('.slider__display_value').eq(1).html()).toBe('+50$');
      expect($verticalDisplay.find('.slider__display_value').eq(0).html()).toBe('+10$');
      expect($verticalDisplay.find('.slider__display_value').eq(1).html()).toBe('+50$');

      const newUpdOpts = {
        ...updOpts,
        prefix: '',
        postfix: '',
      };

      testValDisplay.update(rangeRenderData, newUpdOpts);
      expect($horizontalDisplay.find('.slider__display_value').eq(0).html()).toBe('10');
      expect($horizontalDisplay.find('.slider__display_value').eq(1).html()).toBe('50');

      testValDisplay.update(renderData, newUpdOpts);
      expect($horizontalDisplay.find('.slider__display_value').eq(0).html()).toBe('10');
    });

    test('should save options and data in data-attrs of $displayContainer', () => {
      const $displayContainer = $horizontalView.find('.slider__display_container');
      expect($displayContainer.data()).toEqual({
        data: renderData.value,
        options: updOpts,
      });
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      testValDisplay.update(renderData, updOpts);
      vertValDisplay.update(renderData, vertUpdOpts);
    });

    test('should detach $displayContainer', () => {
      testValDisplay.destroy();
      vertValDisplay.destroy();

      const $horizontalDisplay = $horizontalView.find('.slider__display_container');
      const $verticalDisplay = $verticalView.find('.slider__display_container');

      expect($horizontalDisplay.length).toBe(0);
      expect($verticalDisplay.length).toBe(0);

      const newValDisplay = new SliderValuesDisplay({ $viewContainer: $horizontalView });
      newValDisplay.destroy();
      expect($horizontalView.find('.slider__display_container').length).toBe(0);
      expect($horizontalView.find('.slider__display_value').length).toBe(0);
    });

    test('should reset isRendered flag', () => {
      expect(testValDisplay).toHaveProperty('isRendered', true);
      expect(vertValDisplay).toHaveProperty('isRendered', true);
      testValDisplay.destroy();
      vertValDisplay.destroy();
      expect(testValDisplay).toHaveProperty('isRendered', false);
      expect(vertValDisplay).toHaveProperty('isRendered', false);
    });
  });
});
