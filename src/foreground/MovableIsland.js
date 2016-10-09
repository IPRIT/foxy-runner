class MovableIsland extends Island {
  
  constructor(type, sprite) {
    super(type, sprite);
    
    this.sinArg = 0;
    this.sinArgAcceleration = 0.03;
    this.isMovable = true;
  }
  
  move() {
    if (!this.isMovable) {
      return;
    }
    this.sinArg += this.sinArgAcceleration;
    this.yPosition = this.yMiddle + this.offset * Math.sin(this.sinArg) * 2;
    this.sprite.position.y = this.yPosition;
  }
}