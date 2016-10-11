class AnimalPool {
  
  constructor() {
    this.animals = [];
    this.createChickens(10);
    this.shuffle();
  }
  
  createChickens(instancesNumber) {
    for (let i = 0; i < instancesNumber; ++i) {
      this.animals.push(new Chicken());
    }
  }
  
  shuffle(array = this.animals) {
    let len = array.length;
    let shuffles = len * 3;
    for (let i = 0; i < shuffles; i++) {
      let foregroundSlice = array.pop();
      let pos = Math.floor(Math.random() * (len - 1));
      array.splice(pos, 0, foregroundSlice);
    }
  }
  
  borrowAnimal() {
    return this.animals.shift();
  }
  
  returnAnimal(animal) {
    this.animals.push(animal);
  }
}