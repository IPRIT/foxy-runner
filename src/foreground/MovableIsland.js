class MovableIsland extends Island {
  
  constructor(type, sprite) {
    super(type, sprite);
    
    this.sinArg = 0;
    
    this.isMovable = true;
    
    let functions = [ BounceMovableFunction, SquareMovableFunction, SinMovableFunction ];
    this.transformFunction = new functions[ Utils.getRandomInt(0, functions.length - 1) ]();
    this.sinArgAcceleration = this.transformFunction.accelerator;
  }
  
  move() {
    if (!this.isMovable) {
      return;
    }
    this.sinArg += this.sinArgAcceleration;
    this.yPosition = this.yMiddle + this.offset * this.transformFunction.compute(this.sinArg) * 2;
    this.sprite.position.y = this.yPosition;
  }
}