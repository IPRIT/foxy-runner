export class Animal extends PIXI.Container {
  
  constructor() {
    super();
    window.animalIncrement = window.animalIncrement || 0;
    this.id = ++window.animalIncrement;
  }
}