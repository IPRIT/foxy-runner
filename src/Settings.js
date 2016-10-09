class Settings {
  
  static get Width() {
    if (Utils.getBodyBounds()[0] < 1000) {
      return 1500;
    }
    return 3072;
  }
  
  static get Height() {
    return 1536;
  }
  
  static get ScrollSpeed() {
    return 20;
  }
  
  static get MaxScrollSpeed() {
    return 40;
  }
  
  static get ScrollSpeedAcceleration() {
    return 0.004;
  }
  
  static get CanvasDomId() {
    return 'game-canvas';
  }
}