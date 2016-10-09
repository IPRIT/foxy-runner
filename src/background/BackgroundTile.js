class BackgroundTile extends PIXI.extras.TilingSprite {
  
  static get DeltaX() {
    return 0.128;
  }
  
  static get DeltaY() {
    return 0.128;
  }
  
  static get ForegroundDecreaseRatioX() {
    return 2;
  }
  
  static get ForegroundDecreaseRatioY() {
    return 2;
  }
  
  constructor(tileNumber, texture, width, height) {
    super(texture, width, height);
    this._tileNumber = tileNumber;
    this.init();
  }
  
  init() {
    this.position.x = 0;
    this.position.y = 0;
    this.tilePosition.x = 0;
    this.tilePosition.y = 0;
    
    this.viewportX = 0;
    this.viewportY = 0;
  }
  
  setTileNumber(tileNumber) {
    this._tileNumber = tileNumber;
  }
  
  setViewportX(newViewportX) {
    var distanceTravelled = newViewportX - this.viewportX;
    this.viewportX = newViewportX;
    this.tilePosition.x -= distanceTravelled / this.getDeltaX();
  }
  
  setViewportY(newViewportY) {
    var distanceTravelled = newViewportY - this.viewportY;
    this.viewportY = newViewportY;
    this.tilePosition.y -= distanceTravelled / this.getDeltaY();
  }
  
  getDeltaX() {
    return BackgroundTile.DeltaX * Math.pow(BackgroundTile.ForegroundDecreaseRatioX, this._tileNumber + 2);
  }
  
  getDeltaY() {
    return BackgroundTile.DeltaY * Math.pow(BackgroundTile.ForegroundDecreaseRatioY, this._tileNumber + 2);
  }
  
  static fromImage(index, imageUri) {
    let texture = PIXI.Texture.fromImage(imageUri);
    return new BackgroundTile(index, texture, Settings.Width, Settings.Height);
  }
  
  static fromFrameIndex(index) {
    let texture = PIXI.loader.resources[`bg-0${index}`].texture;
    return new BackgroundTile(index, texture, Settings.Width, Settings.Height);
  }
}