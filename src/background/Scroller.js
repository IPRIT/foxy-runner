class Scroller {
  
  constructor(stage) {
    this.stage = stage;
    this.init(stage);
  }
  
  init(stage) {
    this.tiles = [];
    let from = 5;
    let to = 1;
    for (let i = from; i >= to; --i) {
      let tile = BackgroundTile.fromFrameIndex(i);
      this.tiles.push(tile);
      stage.addChild(tile);
    }
    this.map = new IslandsMap();
    stage.addChild(this.map);
  
    this._viewportX = 4000;
    this._viewportY = 0;
  }
  
  setViewportX(viewportX) {
    this._viewportX = viewportX;
    for (let tile of this.tiles) {
      tile.setViewportX(viewportX);
    }
    this.map.setViewportX(viewportX / 1.2);
  }
  
  setViewportY(viewportY) {
    this._viewportY = viewportY;
    for (let tile of this.tiles) {
      tile.setViewportY(viewportY);
    }
    //todo: this.map.setViewportY(viewportY);
  }
  
  getViewportX() {
    return this._viewportX;
  }
  
  getViewportY() {
    return this._viewportY;
  }
  
  shiftViewportX(value) {
    this.setViewportX(this._viewportX + value);
    return this._viewportX;
  }
  
  shiftViewportY(value) {
    this.setViewportY(this._viewportY + value);
    return this._viewportY;
  }
}