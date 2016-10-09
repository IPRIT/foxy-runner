class Island {
  
  constructor(type, sprite) {
    this.type = type;
    this.sprite = sprite;
  
    this.yMiddle = (1 << 8) + 120;
    this.offset = 1 << 6;
    
    this.sprite.position.y = this.yPosition = this.generateY();
    this.ySurfaceOffset = IslandsOffset.getIslandYOffset(type);
    console.error(type, this.ySurfaceOffset);
  }
  
  generateY() {
    return Utils.getRandomInt(this.yMiddle - this.offset, this.yMiddle + this.offset);
  }
  
  getWidth() {
    return this.sprite.width;
  }
  
  getHeight() {
    return this.sprite.height;
  }
  
  reset() {
    this.yPosition = this.generateY();
  }
}