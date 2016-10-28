import { ChickenParticles } from "./ChickenParticles";
import { Animal } from "../Animal";
import { Utils } from "../../../Utils";

export class Chicken extends Animal {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.createSprite();
    this.createChickenParticles();
    this.reset();
    this._rebornNumber = 0;
    this.scaleAcceleration = -0.0005;
    this.scaleVelocity = 0.01;
  }
  
  createSprite() {
    this.animalType = Utils.getRandomInt(1, 2);
    this.sprite = PIXI.Sprite.fromFrame(`chicken-0${this.animalType}`);
    this.addChild(this.sprite);
  }
  
  explode() {
    if (!this.isExploded) {
      this.isExploded = true;
      this.sprite.alpha = 1;
      this.sprite.scale.set(.16);
      this.particles.alpha = 1;
    }
    this.explodeAnimationNextFrame();
    return this.particles.scatter();
  }
  
  reset() {
    this.isExploded = false;
    this.sprite.scale.x = .16;
    this.sprite.scale.y = .16;
    this.sprite.alpha = 1;
    this.sprite.position.x = 0;
    this.sprite.position.y = 0;
    this.scaleAcceleration = -0.0005;
    this.scaleVelocity = 0.01;
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
  
  resetAnimal() {
    this.particles.destroy();
  }
  
  explodeAnimationNextFrame() {
    this.sprite.alpha = Math.max(0, this.sprite.alpha - .05);
    this.scaleVelocity += this.scaleAcceleration;
    this.scaleVelocity = Math.max(0, this.scaleVelocity);
    this.sprite.scale.set(
      Math.min(1, this.sprite.scale.x + this.scaleVelocity),
      Math.min(1, this.sprite.scale.x + this.scaleVelocity)
    );
    this.sprite.position.y -= 10;
  }
}