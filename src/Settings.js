import { Utils } from "./Utils";

export class Settings {
  
  static get Width() {
    let [ width, height ] = Utils.getBodyBounds();
    if (width < 1000 && width < height) {
      return 1500;
    }
    return 3072;
  }
  
  static get Height() {
    return 1536;
  }
  
  static get ScrollSpeed() {
    return 10;
  }
  
  static get MaxScrollSpeed() {
    return 33;
  }
  
  static get ScrollSpeedAcceleration() {
    return 0.015;
  }
  
  static get CanvasDomId() {
    return 'game-canvas';
  }
}