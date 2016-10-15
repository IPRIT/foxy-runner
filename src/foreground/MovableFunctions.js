export class MovableFunction {
  
  compute(argX) {
    return this.fn(argX);
  }
  
  fn(arg) {
    return arg;
  }
}

export class BounceMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.03;
  }
  
  fn(arg) {
    return Math.sin(Math.E / (Math.PI / 2) * Math.cos(arg));
  }
}

export class SinMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.03;
  }
  
  fn(arg) {
    return Math.sin(arg);
  }
}