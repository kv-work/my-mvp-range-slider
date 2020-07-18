$('.jq-test').css({
  border: '1px solid',
  height: '50px'
})

const options = {
  maxValue: 100,
  minValue: 0,
  step: 0.01,
  value: 75,
  secondValue: 76,
  isHorizontal: true,
  range: true,
  dragInterval: true,
  runner: true,
  bar: true,
  scale: false,
  scaleStep: 100,
  displayValue: true,
  displayMin: true,
  displayMax: true,
  onStart: () => {},
  onChange: () => {},
  onFinish: () => {},
  onUpdate: () => {},
};

const anotherOptions = {
  maxValue: 100,
  minValue: 0,
  step: 0.01,
  value: 30,
  secondValue: 75,
  isHorizontal: false,
  range: true,
  dragInterval: true,
  runner: true,
  bar: true,
  scale: false,
  displayValue: false,
  displayMin: false,
  displayMax: false,
  onStart: () => {},
  onChange: () => {},
  onFinish: () => {},
  onUpdate: () => {},
};

$('.js-test_with_options').myMVPSlider(options);
$('.js-test_with_another_options').myMVPSlider(anotherOptions);
