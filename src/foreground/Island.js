import { IslandsOffset } from "./IslandsOffset";
import { Utils } from "../Utils";
export class Island extends PIXI.Container {
  
  constructor(type, sprite) {
    super();
    this.type = type;
    this.sprite = sprite;
  
    this.yMiddle = (1 << 8) + 120;
    this.offset = 1 << 6;
    
    this.sprite.position.y = this.yPosition = this.generateY();
    this.ySurfaceOffset = IslandsOffset.getIslandYOffset(type);
    
    this.animals = [];
  }
  
  generateY() {
    return Utils.getRandomInt(this.yMiddle - this.offset, this.yMiddle + this.offset);
  }
  
  getWidth() {
    return this.sprite.width;
  }
  
  getHeight() {
    return this.sprite.height;
  }
  
  reset() {
    this.sprite.position.y = this.yPosition = this.generateY();
  }
  
  addAnimal(animal) {
    this.animals.push(animal);
  }
  
  getAnimals() {
    return this.animals;
  }
  
  unpinAnimals() {
    let animals = this.animals;
    this.animals = [];
    return animals;
  }
}