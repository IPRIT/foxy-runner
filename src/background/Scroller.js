import { BackgroundTile } from "./BackgroundTile";
import { GameMap } from "../foreground/GameMap";

export class Scroller extends PIXI.Container {
  
  constructor(stage) {
    super();
    this.stage = stage;
    this.init(stage);
  }
  
  init(stage) {
    this._speed = 1;
    
    this.addTiles(stage);
    
    this.gameMap = new GameMap(this);
    stage.addChild(this.gameMap);
    
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
    this.gameMap.moveBy(value);
    return this._viewportX;
  }
  
  getScrollSpeed() {
    return this._speed;
  }
  
  setScrollSpeed(speed) {
    if (this.isGameOver) {
      if (!this.gameOverSpeed) {
        this.gameOverSpeed = speed;
        this.gameOverSpeedStep = speed / 50;
      }
      this._speed = Math.max(0, this.gameOverSpeed -= this.gameOverSpeedStep);
      return;
    }
    this._speed = speed;
  }
  
  hardViewUpdate() {
    for (let tile of this.tiles) {
      this.stage.removeChild(tile);
      tile.destroy();
    }
    this.addTiles(this.stage);
    this.toFront(this.gameMap);
  }
  
  toFront(object) {
    this.stage.removeChild(object);
    this.stage.addChild(object);
  }
  
  pause() {
    this._isStopped = true;
  }
  
  resume() {
    this._isStopped = false;
  }
  
  isPaused() {
    return this._isStopped;
  }
  
  gameOver() {
    this.pause();
    this.isGameOver = true;
    this.gameMap.gameOver();
  }
  
  reset() {
    this._speed = 1;
    this.gameMap.reset();
    this.gameMap.destroy();
    
    this._viewportX = 0;
    this.setViewportX(this._viewportX);
    
    this.isGameOver = false;
    this.gameOverSpeed = null;
    this.tiles.forEach(tile => {
      tile.destroy();
    })
  }
}