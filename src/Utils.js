export class Utils {
  
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
  
  static probabilityTest(probability = 1) {
    return Math.random() <= probability;
  }
  
  static highlight(container) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x0FF0F0);
    graphics.lineStyle(2, 0xFF0000);
    graphics.drawRect(0, 0, container.width || 100, container.height || 100);
    graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    container.addChild(graphics);
  }
  
  static mark(coords, container) {
    let graphics = new PIXI.Graphics();
    graphics.beginFill(0x0FF0F0);
    graphics.lineStyle(2, 0xFF0000);
    graphics.drawRect(0, 0, 10, 10);
    graphics.blendMode = PIXI.BLEND_MODES.MULTIPLY;
    graphics.position.x = coords[0];
    graphics.position.y = coords[1];
    setTimeout(() => {
      container.removeChild(graphics);
      graphics.destroy();
    }, 100);
    container.addChild(graphics);
  }
  
  static clear(object) {
    if (typeof object === 'object' && object !== null) {
      for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
          Utils.clear(object[ prop ]);
        }
      }
    } else if (Array.isArray(object)) {
      for (let i = 0; i < object.length; ++i) {
        Utils.clear(object[ i ]);
      }
    } else {
      object = null;
    }
  }
}