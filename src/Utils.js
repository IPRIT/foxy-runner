class Utils {
  
  static getBodyBounds() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
  
    let height = window.innerHeight
      || document.documentElement.clientHeight
      || document.body.clientHeight;
    return [width, height];
  }
  
  static getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  static highlight(container) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x0FF0F0);
    graphics.lineStyle(2, 0xFF0000);
    graphics.drawRect(0, 0, container.width || 100, container.height || 100);
    graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    container.addChild(graphics);
  }
}