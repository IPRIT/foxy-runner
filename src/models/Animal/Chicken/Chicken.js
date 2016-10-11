class Chicken extends Animal {
  
  constructor() {
    super();
    this.animalType = AnimalType.Chicken;
    this.init();
  }
  
  init() {
    this.createChickenParticles();
    this.createSprite();
    this.particles.alpha = 0;
  }
  
  createSprite() {
    let texture = PIXI.loader.resources[`chicken`].texture;
    this.sprite = new PIXI.Sprite(texture);
    this.reset();
    this.addChild(this.sprite);
  }
  
  explode() {
    if (!this.isExploded) {
      this.isExploded = true;
      this.sprite.alpha = 0;
      this.particles.alpha = 1;
    }
    this.particles.scatter();
  }
  
  reset() {
    this.sprite.scale.x = .16;
    this.sprite.scale.y = .16;
    this.position.x = 0;
    this.position.y = 0;
    this.isExploded = false;
    this.sprite.alpha = 1;
    this.particles.alpha = 0;
    this.particles.reset();
  }
  
  createChickenParticles() {
    this.particles = new ChickenParticles();
    this.particles.position.set(-200, -200);
    this.addChild(this.particles);
  }
}