class MovableIsland extends Island {
  
  constructor(type, sprite) {
    super(type, sprite);
    
    this.sinArg = 0;
    this.isMovable = true;
    this.selectTransformFunction();
  }
  
  move() {
    this.sinArg += this.sinArgAcceleration;
    this.yPosition = this.yMiddle + this.offset * this.transformFunction.compute(this.sinArg) * 2;
    this.sprite.position.y = this.yPosition;
  }
  
  reset() {
    this.sinArg = 0;
    this.yPosition = this.generateY();
    this.selectTransformFunction();
  }
  
  selectTransformFunction() {
    let functions = [ BounceMovableFunction, SquareMovableFunction, SinMovableFunction ];
    this.transformFunction = new functions[ Utils.getRandomInt(0, functions.length - 1) ]();
    this.sinArgAcceleration = this.transformFunction.accelerator;
  }
}