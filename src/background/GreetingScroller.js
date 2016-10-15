import { BackgroundTile } from "./BackgroundTile";

export class GreetingScroller extends PIXI.Container {
  
  constructor(stage) {
    super();
    this.stage = stage;
    this.init(stage);
  }
  
  init(stage) {
    this._speed = 1;
    this.addTiles(stage);
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
  
  setViewportX(viewportX) {
    this._viewportX = viewportX;
    for (let tile of this.tiles) {
      tile.setViewportX(viewportX);
    }
  }
  
  shiftViewportX(value) {
    this.setViewportX(this._viewportX + value);
    return this._viewportX;
  }
  
  getScrollSpeed() {
    return this._speed;
  }
  
  setScrollSpeed(speed) {
    this._speed = speed;
  }
  
  hardViewUpdate() {
    for (let tile of this.tiles) {
      this.stage.removeChild(tile);
      tile.destroy();
    }
    this.addTiles(this.stage);
  }
  
  toFront(object) {
    this.stage.removeChild(object);
    this.stage.addChild(object);
  }
  
  reset() {
    this._speed = 1;
    this._viewportX = 0;
    this.setViewportX(this._viewportX);
    this.tiles.forEach(tile => {
      tile.destroy();
      tile = null;
    });
    this.tiles = [];
  }
}