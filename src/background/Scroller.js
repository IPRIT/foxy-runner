class Scroller {
  
  constructor(stage) {
    this.stage = stage;
    this.init(stage);
  }
  
  init(stage) {
    this.tiles = [];
    this.speed = 1;
    let from = 5;
    let to = 1;
    for (let i = from; i >= to; --i) {
      let tile = BackgroundTile.fromFrameIndex(i);
      this.tiles.push(tile);
      stage.addChild(tile);
    }
    this.map = new GameMap();
    stage.addChild(this.map);
  
    this._viewportX = Main.CanvasWidth * 1.5;
  }
  
  setViewportX(viewportX) {
    this._viewportX = viewportX;
    for (let tile of this.tiles) {
      tile.setViewportX(viewportX);
    }
  }
  
  getViewportX() {
    return this._viewportX;
  }
  
  shiftViewportX(value) {
    this.setViewportX(this._viewportX + value);
    this.map.moveBy(value);
    return this._viewportX;
  }
}