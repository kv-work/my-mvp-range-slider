interface OptionsModel {
  maxCount: number,
  minCount: number,
  startCount: number,
  step: number
}

interface Observer {
  update(value?: number): void
}

interface ViewData {
  value: number,
  step?: number,
  interval?: [number, number]
}

interface View {
  render(value: number, step?: number, interval?: [number, number]): void,
  update(value: number, step?: number, interval?: [number, number]): void,
  addObserver(observer: Observer): void,
  removeObserver(observer: Observer): void
}

export {
  OptionsModel,
  Observer,
  ViewData,
  View
}