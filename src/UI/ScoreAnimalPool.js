import { AnimalType } from "../models/Animal/AnimalType";

export class ScoreAnimalPool {
  
  static getInstance() {
    return window._scoreAnimalPool || (window._scoreAnimalPool = new ScoreAnimalPool());
  }
  
  constructor() {
    this.animals = {};
    this.createChickens(4);
    this.createChickensWithChucks(4);
  }
  
  createChickens(number = 1) {
    for (let i = 0; i < number; ++i) {
      this.addAnimal(`chicken-0${AnimalType.Chicken}`, AnimalType.Chicken);
    }
  }
  
  createChickensWithChucks(number = 1) {
    for (let i = 0; i < number; ++i) {
      this.addAnimal(`chicken-0${AnimalType.ChickenWithChucks}`, AnimalType.ChickenWithChucks);
    }
  }
  
  addAnimal(frameId, animalType) {
    if (!this.animals[`object${animalType}`]) {
      this.animals[`object${animalType}`] = [];
    }
    let sprite = PIXI.Sprite.fromFrame(frameId);
    sprite.scale.x = .16;
    sprite.scale.y = .16;
    this.animals[`object${animalType}`].push(sprite);
  }
  
  getAnimals(animalType) {
    return this.animals[`object${animalType}`] || [];
  }
  
  borrowAnimal(animalType) {
    return this.getAnimals(animalType).shift();
  }
  
  returnAnimal(animal, animalType) {
    return this.getAnimals(animalType).push(animal);
  }
  
  reset() {
    Object.keys(this.animals).forEach(key => {
      if (this.animals[key]) {
        this.animals[key].forEach(animal => {
          animal.destroy();
        });
      }
    });
    this.animals = null;
    window._scoreAnimalPool = new ScoreAnimalPool()
  }
}