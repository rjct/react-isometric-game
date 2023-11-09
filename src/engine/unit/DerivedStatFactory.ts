export class DerivedStatFactory {
  private _currentValue: number;
  private _maxValue: number;

  get current() {
    return this._currentValue;
  }

  set current(value: number) {
    this._currentValue = value;
  }

  get max() {
    return this._maxValue;
  }

  constructor(initialValue: number) {
    this._currentValue = initialValue;
    this._maxValue = initialValue;
  }
}
