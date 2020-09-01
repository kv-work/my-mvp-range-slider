### Обучающее задание на фронтенд разработчика №4
***

## my-mvp-range-slider

Краткое описание:
Range Slider Plugin on jQuery.

**Demo:**
***[kv-work.github.io](https://kv-work.github.io/the_4th_task/)***

## Краткое описание архитектуры:

Приложение разделено на 3 слоя (MVP архитектура):
1. Model;
2. View;
3. Presenter.

**1. Model**

Внутри *model* реализована бизнес-логика слайдера:
- хранение текущего состояние слайдера (минимальное и максимальное значения, текущее значение, велечина шага и т.п.);
- вычисление нового значения слайдера. 

**2. View**

Внутри *view* реализована логика отрисовки слайдера и взаимодействия с пользователем.

**3. Presenter**

*Presenter* предназначен для реализации взаимодействия *model* и *view*.
Ни *model* ни *view* не знают ни о друг друге, ни о *presenter*. Однако *model* и *view* уведомляют о событиях (изменение состояния слайдера, взаимодействие с пользователем и т.д.) своих наблюдателей. Таким образом подписавшись на уведомления *presenter* узнает об изменениях *model* и о событиях взаимодействия *view* с пользователем. На основе полученной информации *presenter* воздействует на *view* и *model*.

## Зависимости:

- jquery: ^3.0.0

## Установка
Возможны два варианта установки плагина:

### 1. Скачать файлы плагина

- Скачать [скрипт](https://github.com/kv-work/the_4th_task/blob/master/dist/lib/my-mvp-range-slider.min.js)
- Скачать [стили](https://github.com/kv-work/the_4th_task/blob/master/dist/lib/my-mvp-range-slider.min.css)

```html
<html>
  <head>
    ···
    <link href="/path/to/my-mvp-range-slider.min.css" rel="stylesheet">
  </head>
  <body>
    ···
    <script src="/path/to/my-mvp-range-slider.min.js"></script>
  </body>
</html>
```

### 2. Установить с помощью NPM

```shell
npm install https://github.com/kv-work/the_4th_task.git
```

Then import/require it:

```javascript
import 'my-mvp-range-slider/dist/lib/my-mvp-range-slider.min';
import 'my-mvp-range-slider/dist/lib/my-mvp-range-slider.min.css';
```

## Использование

### Разметка

```html
<div class="js-slider"></div>
```

### Программный код

```javascript
$(document).ready(() => {
  $('.js-slider').myMVPSlider({ [options] })
})
```

## Options

| Option | Тип   | По умолчанию | Data-атрибут | Описание | Примечание |
| :----: | :---: | :----------: | :----------: | :------- | :--------- |
| **maxValue** | *number* | **100** | `data-max-value` | Максимальное значение | --- |
| **minValue** | *number* | **0** | `data-min-value` | Минимальное значение | --- |
| **step** | *number* | **1** | `data-step` | Велечина шага | Должен быть строго больше **0** |
| **value** | *number* | **0* | `data-value` | Первое значение | --- |
| **secondValue** | *number* | **undefined** | `data-second-value` | Второе значение | --- |
| --- | --- | --- | --- | --- | --- |
| **isHorizontal** | *boolean* | **true** | `data-is-horizontal` | Ориентация слайдера | Горизонтальное, если значение **true** |
| **range** | *boolean* | **true** | `data-range` | Отображение интервала | --- |
| **dragInterval** | *boolean* | **false** | `data-drag-interval` | Возможность перемещать интервал (изменяется и первое, и второе значения) | Работает, только при наличии второго значения (**secondValue** !== **undefined**) |
| **runner** | *boolean* | **true** | `data-runner` | Отображение ручки слайдера (бегунок) | --- |
| **bar** | *boolean* | **true** | `data-bar` | Отображение полоски слайдера | --- |
| **scale** | *boolean* | **true** | `data-scale` | Отображение шкалы | --- |
| **numOfScaleVal** | *number*  | **3** | `data-num-of-scale-val` | Количество отображаемых значений шкалы (не считая максимального и минимального значений) | может принимать значения в интервале от **0** до **10** |
| **displayScaleValue** | *boolean* | **true** | `data-diplay-scale-value` | Отображение значения шкалы | --- |
| **displayValue** | *boolean* | **true** | `data-diplay-value` |  Отображение текущего значения слайдера над полоской (бегунком) | --- |
| **displayMin** | *boolean* | **true** | `data-diplay-min` | Отображение минимального значения шкалы | --- |
| **displayMax** | *boolean* | **true** | `data-diplay-max` | Отображение максимального значения шкалы | --- |
| **prefix** | *string*  | **''** | `data-prefix` | Префикс для отображаемого значения слайдера | Работает, только при отображении значения над полоской слайдера (**displayValue** === **true**) |
| **postfix** | *string*  | **''** | `data-postfix` | Постфикс для отображаемого значения слайдера | Работает, только при отображении значения над полоской слайдера (**displayValue** === **true**) |
