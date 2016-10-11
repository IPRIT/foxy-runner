class Scroller {
  
  constructor(stage) {
    this.stage = stage;
    this.init(stage);
  }
  
  init(stage) {
    this._speed = 1;
    
    this.addTiles(stage);
    
    this.map = new GameMap(this);
    stage.addChild(this.map);
    
    this._viewportX = 0;
  }
  
  addTiles(stage) {
    this.tiles = [];
    let from = 5;
    let to = 1;
    for (let i = from; i >= to; --i) {
      let tile = BackgroundTile.fromFrameIndex(i);
      this.tiles.push(tile);
      stage.addChild(tile);
    }
  }
  
  getViewportX() {
    return this._viewportX;
  }
  
  setViewportX(viewportX) {
    this._viewportX = viewportX;
    for (let tile of this.tiles) {
      tile.setViewportX(viewportX);
    }
  }
  
  shiftViewportX(value) {
    this.setViewportX(this._viewportX + value);
    this.map.moveBy(value);
    return this._viewportX;
  }
  
  getScrollSpeed() {
    return this._speed;
  }
  
  setScrollSpeed(speed) {
    this._speed = speed;
  }
  
  hardViewUpdate() {
    for (let i = 0; i < this.tiles.length; ++i) {
      let tile = this.tiles[i];
      this.stage.removeChild(tile);
      tile.destroy();
    }
    this.stage.removeChild(this.map);
    this.addTiles(this.stage);
    this.stage.addChild(this.map);
  }
}