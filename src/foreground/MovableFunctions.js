class MovableFunction {
  
  compute(argX) {
    return this.fn(argX);
  }
  
  fn(arg) {
    return arg;
  }
}

class BounceMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.001;
  }
  
  fn(arg) {
    return Math.cos(arg * arg * arg) * Math.sin(arg * arg * arg) * 2;
  }
}

class SquareMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.001;
  }
  
  fn(arg) {
    return Math.sin(arg * arg);
  }
}

class SinMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.03;
  }
  
  fn(arg) {
    return Math.sin(arg);
  }
}