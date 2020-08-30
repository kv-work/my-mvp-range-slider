### Обучающее задание на фронтенд разработчика №4
***

## my-mvp-range-slider

Краткое описание:
Range Slider Plugin on jQuery.

**Demo:**
***[kv-work.github.io](http://kv-work.github.io/the_4nd_task/)***

## Dependencies:

- jquery: ^3.0.0

## Installation

### Direct Download

- Download the script [here](https://github.com/kv-work/the_4th_task/blob/gh-pages/lib/my-mvp-range-slider.min.js) and include it as shown below
- Download the stylesheet [here](https://github.com/kv-work/the_4th_task/blob/gh-pages/lib/my-mvp-range-slider.min.css) and include it as shown below

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

**Краткое описание архитектуры:**
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
Ни *model* ни *view* не знают ни о друг друге, ни о *presenter*. Однако *model* и *view* уведомляют о событиях (изменение состояния сдаййдера, взаимодействие с пользователем и т.д.) своих наблюдателей. Таким образом подписавшись на уведомления *presenter* узнает об изменениях *model* и о событиях взаимодействия *view* с пользователем. На основе полученной информации *presenter* воздействует на *view* и *model*.