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
    this.accelerator = 0.003;
  }
  
  fn(arg) {
    return Math.cos(arg * arg) * Math.sin(arg * arg);
  }
}

class SquareMovableFunction extends MovableFunction {
  
  constructor() {
    super();
    this.accelerator = 0.003;
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