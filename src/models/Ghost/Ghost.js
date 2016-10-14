class Ghost extends PIXI.Container {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.frame = 0;
    this.frameValue = 0.0;
    this.frameAcceleration = 0.25;
    this.frames = 2;
    this.createSprites();
    this.showState();
  }
  
  setStateAcceleration(acceleration) {
    this.stateAcceleration = Math.max(Math.min(acceleration, .45), .2);
  }
  
  createSprites() {
    this.sprites = [];
    this.addSprite(`ghost-01`);
    this.addSprite(`ghost-02`);
  }
  
  addSprite(frameId) {
    let sprite = PIXI.Sprite.fromFrame(frameId);
    sprite.scale.x = .12;
    sprite.scale.y = .12;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    this.sprites.push(sprite);
    this.addChild(sprite);
  }
  
  showState({ oldState } = {}) {
    if (this.frame === oldState) {
      return;
    }
    this.sprites.forEach((sprite, index) => {
      if (this.frame === index) {
        sprite.alpha = 1;
      } else {
        sprite.alpha = 0;
      }
    });
  }
  
  nextStateValue() {
    let oldState = this.frame;
    this.frameValue += this.frameAcceleration;
    this.frame = Math.floor(this.frameValue) % this.frames;
    this.showState({ oldState });
  }
  
  reset() {
    this.frame = 0;
    this.frameValue = 0.0;
    this.frameAcceleration = 0.25;
    this.frames = 2;
    this.position.x = 0;
    this.position.y = -50;
    this.showState();
  }
}