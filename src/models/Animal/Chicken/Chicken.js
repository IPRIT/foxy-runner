class Chicken extends Animal {
  
  constructor() {
    super();
    this.animalType = AnimalType.Chicken;
    this.init();
  }
  
  init() {
    this.createSprite();
  }
  
  createSprite() {
    let texture = PIXI.loader.resources[`chicken`].texture;
    this.sprite = new PIXI.Sprite(texture);
    this.reset();
    this.addChild(this.sprite);
  }
  
  reset() {
    this.sprite.scale.x = .16;
    this.sprite.scale.y = .16;
    //this.sprite.anchor.x = 0.5;
    //this.sprite.anchor.y = 0.5;
    this.position.x = 0;
    this.position.y = 0;
  }
}