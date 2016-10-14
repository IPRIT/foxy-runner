class Chicken extends Animal {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.createSprite();
    this.createChickenParticles();
    this.reset();
    this._rebornNumber = 0;
  }
  
  createSprite() {
    this.animalType = Utils.getRandomInt(1, 2);
    this.sprite = PIXI.Sprite.fromFrame(`chicken-0${this.animalType}`);
    this.addChild(this.sprite);
  }
  
  explode() {
    if (!this.isExploded) {
      this.isExploded = true;
      this.sprite.alpha = 0;
      this.particles.alpha = 1;
    }
    return this.particles.scatter();
  }
  
  reset() {
    this.isExploded = false;
    this.sprite.scale.x = .16;
    this.sprite.scale.y = .16;
    this.sprite.alpha = 1;
    this.position.x = 0;
    this.position.y = 0;
    this.particles.reset();
    this._rebornNumber++;
  }
  
  createChickenParticles() {
    this.particles = new ChickenParticles(this.animalType);
    this.particles.position.set(-200, -200);
    this.addChild(this.particles);
  }
  
  getRebornNumber() {
    return this._rebornNumber;
  }
}