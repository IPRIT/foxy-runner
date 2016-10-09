class PhysicFreeFallObject extends PIXI.Container {
  
  constructor() {
    super();
    
    this._y = 0;
    this._v0 = 0;
    this._v = this._v0;
    this.acceleration = 9.80665;
  }
  
  setY(y) {
    this._y = y * 10;
  }
  
  compute() {
    this._v += this.acceleration;
    this._y += this._v;
  }
  
  getY() {
    return this._y / 10;
  }
  
  physicJump() {
    this._v -= 300;
  }
  
  resetV() {
    this._v = this._v0;
  }
}