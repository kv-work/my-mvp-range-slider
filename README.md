### Обучающее задание на фронтенд разработчика №4
***

## my-mvp-range-slider

## Содержание:
1. ***[Краткое описание архитектуры](#architecture)***
2. ***[Зависимости](#dependencies)***
3. ***[Установка](#installation)***
4. ***[Использование:](#usage)***
    * ***[Разметка](#usage_html)***
    * ***[Программный код](#usage_js)***
    * ***[Options](#options)***
    * ***[Работа с плагином](#work)***
    * ***[Публичные методы](#methods)***
    * ***[Callbacks](#callbacks)***
    * ***[Работа с массивом данных](#work_with_data_values)***
5. ***[UML-диаграмма приложения](#uml)***
6. ***[Тесты](#test)***
7. ***[Использованные инструменты при разработке](#instruments)***

Краткое описание:
Range Slider Plugin on jQuery.

## Demo

***[Github-page][1]***

##  <a name="architecture">Краткое описание архитектуры:</a>

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

## <a name="dependencies">Зависимости:</a>

- [jquery: ^3.0.0](http://jquery.com/)

## <a name="installation">Установка</a>
Возможны два варианта установки плагина:

### 1. Скачать файлы плагина

- Скачать [скрипт](https://github.com/kv-work/my-mvp-range-slider/blob/master/dist/lib/my-mvp-range-slider.min.js)
- Скачать [стили](https://github.com/kv-work/my-mvp-range-slider/blob/master/dist/lib/my-mvp-range-slider.min.css)

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

```sh
$ npm install https://github.com/kv-work/my-mvp-range-slider.git
```

Затем необходимо импортировать файлы:

```javascript
import 'my-mvp-range-slider/dist/lib/my-mvp-range-slider.min';
import 'my-mvp-range-slider/dist/lib/my-mvp-range-slider.min.css';
```

## <a name="usage">Использование</a>

### <a name="usage_html">Разметка</a>

```html
<div class="js-slider"></div>
```

### <a name="usage_js">Программный код</a>

```javascript
$(document).ready(() => {
  $('.js-slider').myMVPSlider({ [options] })
})
```

### <a name="options">Options</a>

| Option | Тип   | По умолчанию | Data-атрибут | Описание | Примечание |
| :----: | :---: | :----------: | :----------: | :------- | :--------- |
| **maxValue** | *number* | **100** | `data-max-value` | Максимальное значение | --- |
| **minValue** | *number* | **0** | `data-min-value` | Минимальное значение | --- |
| **step** | *number* | **1** | `data-step` | Велечина шага | Должен быть строго больше **0** |
| **value** | *number* | **0** | `data-value` | Первое значение | --- |
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

### <a name="work">Работа с плагином</a>

Для работы с экземпляром плагина, его необходимо сохранить в переменной (***[Разметку](#usage_html)*** и ***[Подключение плагина](#usage_js)*** смотри выше):

```javascript
const slider = $('.js-slider').data('myMVPSlider');
```

**Важно!** *Указанным выше способом в константу **slider** сохранится экземпляр первого найденного по селектору ***'.js-slider'*** элемента. Поэтому, если на странице подключенно более одного экземпляра плагина **my-mvp-range-slider**, для работы с каждым, необходимо сохранять экземпляры в отдельные переменные.*

### <a name="methods">Методы</a>

1. Обновление [свойств](#options) плагина.

```javascript
slider.update({ [options] })
```

2. Запрос свойств плагина. Возвращает объект со всеми свойствами плагина.

```javascript
// Возвращает объект со свойствами model
slider.getModelData()
// Возвращает объект со свойствами view
slider.getViewData()
// Возвращает объект со свойствами presenter
slider.getPresenterData()
// Возвращает объект со всеми свойствами
slider.getAllData()
```

3. Блокирование/разблокирование свойств модели. В качестве аргумента передается массив строк названий значений свойств **model** (`maxValue`, `minValue`, `step`, `value`, `secondValue`) или строка `all` (в этом случае блокируются/разблокируются все свойства **model**)

```javascript
// Блокирование свойств model
slider.lockValues([ [values] ])
// Разблокирование свойств model
slider.unlockValues([ [values] ])
```

4. Сброс состояния плагина. Слайдер возвращается к изначальному состоянию (полученному при инициализации).

```javascript
slider.reset()
```

5. Удаление плагина

```javascript
slider.destroy()

// Альтернативный способ удаления
$('.js-slider').myMVPSlider('destroy')
```

### <a name="callbacks">Callbacks</a>

При взаимодействии с слайдером (изменении значений, обновлении свойств), вызываются функции callback:
* **onStart** - вызывается в начале взаимодействия пользователя с слайдером на странице (например, когда пользователь начинает перетаскивать бегунок);
* **onChange** - вызывается каждый раз после изменения текущего значения слайдера;
* **onFinish** - вызывается после окончания взаимодействия пользователя с слайдером на странице (например, когда пользователь отпустил бегунок в новом положении);
* **onUpdate** - вызывается при обновлении свойств слайдера с помощью публичного метода `.update`.

Вызываемые функции фактически являются свойствами слайдера, поэтому могут быть заданы при инициализации сдайдера или обновлены с помощью публичного метода `.update`. И в том, и вдругом случае необходимо передать callback-функции в качестве значений объекта **options** (ключам соответствуют названия функций).

### <a name="work_with_data_values">Работа с массивом данных</a>

Помимо работы с числовыми значениями, **my-mvp-range-slider** может работать с массивом объектов. Необходимым условием использования объектов является наличие у каждого из объектов метода `.toString()`, которое возвращает `string`. Длина массива должна быть строго больше 1.

Массив объектов можно передать в качестве поля объекта **options** при инициализации плагина или при вызове метода `.update` по ключу **dataValues**.
При работе с массивом данных изменяются свойства **model**:
* *минимальное значение* принимается равным **0**;
* *максимальное значение* принимается равным **dataValues.length - 1**;
* *шаг* принимается равным **1**;
* Блокируются от изменений свойства **maxValue**, **minValue**, **step**.

Пример работы с массивом объектов можно рассмотреть на **[demo-странице][1]** (пресеты *Week* и *Year* )

## <a name="uml">UML-диаграмма приложения</a>

![UML-диаграмма приложения](https://github.com/kv-work/my-mvp-range-slider/raw/master/UML.jpg)

## <a name="test">Тесты</a>

Для тестов использовался фраймфорк ***[Jest](https://jestjs.io/)***

Тесты запускаются с помощью команды:

```sh
$ npm test
```

Для запуска демо-***[страницы][1]*** в режиме dev-server'а используется команда:

```sh
$ npm start
```

Для запуска сборки используются команды:

* **development mode**:

```sh
$ npm run build:dev
```

* **production mode**:

```sh
$ npm run build:prod
```

## <a name="instruments">Использованные инструменты при разработке</a>

1.  [webpack](https://webpack.js.org/)
  *  [css-loader](https://webpack.js.org/loaders/css-loader/)
  *  [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
  *  [mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)
  *  [style-loader](https://webpack.js.org/loaders/style-loader/)
  *  [webpack-dev-server](https://github.com/webpack/webpack-dev-server)
2.  [typescript](https://www.typescriptlang.org/)
3.  [jquery](https://jquery.com/)
4.  [jest](https://jestjs.io/)
5. [gh-pages](https://github.com/tschaub/gh-pages)

[1]: https://kv-work.github.io/my-mvp-range-slider/index.html
