class PhysicAccelerationType {
  
  static get Normal() {
    return 1;
  }
  static get KeyHold() {
    return 2;
  }
}

class PhysicFreeFallObject extends PIXI.Container {
  
  constructor() {
    super();
    
    this._y = 0;
    this._v0 = 50;
    this._v = this._v0;
    this.accelerationType = PhysicAccelerationType.Normal;
  }
  
  setY(y) {
    this._y = y * 10;
  }
  
  compute() {
    this._v += this.getAcceleration();
    this._y += this._v;
  }
  
  getY() {
    return this._y / 10;
  }
  
  physicJump() {
    this._v -= 250;
  }
  
  resetV() {
    this._v = this._v0;
  }
  
  getAcceleration() {
    if (this.accelerationType === PhysicAccelerationType.Normal) {
      return 9.80665 * 1.7;
    } else if (this.accelerationType === PhysicAccelerationType.KeyHold) {
      return 9.80665 * .4;
    }
  }
  
  setAccelerationType(type) {
    this.accelerationType = type;
  }
  
  loosenGravity() {
    console.log('loosen gravity');
    this.setAccelerationType(PhysicAccelerationType.KeyHold);
  }
  
  repairGravity() {
    console.log('repeair gravity');
    this.setAccelerationType(PhysicAccelerationType.Normal);
  }
}