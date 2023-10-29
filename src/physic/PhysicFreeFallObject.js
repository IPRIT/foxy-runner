export class PhysicAccelerationType {

  static get Normal() {
    return 1;
  }
  static get KeyHold() {
    return 2;
  }
}

export class PhysicFreeFallObject extends PIXI.Container {

  constructor() {
    super();

    this._y = 0;
    this._v0 = 100;
    this._v = this._v0;
    this.accelerationType = PhysicAccelerationType.Normal;
  }

  setY(y) {
    this._y = y * 10;
  }

  compute() {
    this._v += this.getAcceleration() * game.multiplier;
    this._y += this._v * game.multiplier;
  }

  getY() {
    return this._y / 10;
  }

  physicJump() {
    this._v -= 280;
  }

  resetV() {
    this._v = this._v0;
  }

  getAcceleration() {
    if (this.accelerationType === PhysicAccelerationType.Normal) {
      return 9.80665 * 1.7;
    } else if (this.accelerationType === PhysicAccelerationType.KeyHold) {
      return 9.80665 * .45;
    }
  }

  setAccelerationType(type) {
    this.accelerationType = type;
  }

  loosenGravity() {
    this.setAccelerationType(PhysicAccelerationType.KeyHold);
  }

  repairGravity() {
    this.setAccelerationType(PhysicAccelerationType.Normal);
  }
}
