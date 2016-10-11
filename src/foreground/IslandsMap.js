class IslandsMap extends PIXI.Container {
  
  static get ViewportWidth() {
    return Settings.Width;
  }
  
  static get ViewportSliceWidth() {
    return 550;
  }
  
  static get ViewportNumSlices() {
    return Math.ceil(IslandsMap.ViewportWidth / IslandsMap.ViewportSliceWidth) + 1;
  }
  
  constructor() {
    super();
    this.builder = new MapBuilder();
    this.animalPool = new AnimalPool();
    this.slices = [];
    this.viewportX = 0;
    this.viewportSliceX = 0;
  }
  
  getLastObject() {
    if (this.slices.length) {
      return this.slices[ this.slices.length - 1 ];
    }
    return null;
  }
  
  setViewportX(viewportX) {
    this.viewportX = viewportX;
    
    this.moveMovableIslands();
  
    var prevViewportSliceX = this.viewportSliceX;
    this.viewportSliceX = Math.floor(this.viewportX / IslandsMap.ViewportSliceWidth);
  
    this.removeOldSlices(prevViewportSliceX);
    this.addNewSlices();
  }
  
  getCurrentSliceIndex() {
    return this.viewportSliceX;
  }
  
  getSliceForViewportX(viewportX) {
    return Math.floor(viewportX / IslandsMap.ViewportSliceWidth);
  }
  
  getViewportX() {
    return this.viewportX;
  }
  
  shiftViewportX(shiftX) {
    this.setViewportX(this.viewportX + shiftX);
  }
  
  addNewSlices() {
    var firstX = -(this.viewportX % IslandsMap.ViewportSliceWidth);
    for (var i = this.viewportSliceX - 1, sliceIndex = -1; i < this.viewportSliceX + IslandsMap.ViewportNumSlices; i++, sliceIndex++) {
      if (i < 0) {
        continue;
      }
      let slice;
      if (this.slices[i]) {
        slice = this.slices[i];
      } else {
        slice = this.builder.generateNext(this.getLastObject());
        
        if (slice.type >= IslandType.BIG_1 && slice.type <= IslandType.MOVABLE_4) {
          let peaceAnimal = this.animalPool.borrowAnimal();
          this.setUpAnimal(peaceAnimal, slice);
          slice.addAnimal(peaceAnimal);
          slice.sprite.addChild(peaceAnimal);
        }
        
        this.slices.push(slice);
        this.addChild(slice.sprite);
      }
      if (sliceIndex < 2) {
        slice.animals.forEach(animal => {
          animal.explode();
        });
      }
      slice.sprite.position.x = firstX + (sliceIndex * IslandsMap.ViewportSliceWidth);
      slice.sprite.position.y = slice.yPosition || 0;
    }
  }
  
  removeOldSlices(prevViewportSliceX) {
    var numOldSlices = Math.min(IslandsMap.ViewportNumSlices, this.viewportSliceX - prevViewportSliceX - 1);
    for (var i = prevViewportSliceX - 1; i < prevViewportSliceX + numOldSlices; i++) {
      var slice = this.slices[i];
      if (!slice) {
        continue;
      }
      let peaceAnimals = slice.unpinAnimals();
      peaceAnimals.forEach(animal => {
        animal.reset();
        slice.sprite.removeChild(animal);
      });
      this.returnAnimals(peaceAnimals);
      
      slice.reset();
      this.returnIslandSlice(slice);
      this.removeChild(slice.sprite);
      this.slices[i] = null;
    }
  }
  
  returnIslandSlice(slice) {
    let type = slice.type;
    if (type >= IslandType.BIG_1 && type <= IslandType.MOVABLE_4) {
      this.builder.returnIsland(slice);
    } else if (type >= IslandType.EMPTY_SHORT && type <= IslandType.EMPTY_LARGE) {
      this.builder.returnEmpty(slice);
    } else {
      console.error('WTF!!');
    }
  }
  
  moveMovableIslands() {
    if (!this.slices.length) {
      return;
    }
    this.slices.filter(slice => slice && slice.type >= IslandType.MOVABLE_1 && slice.type <= IslandType.MOVABLE_4)
      .forEach(slice => slice.move());
  }
  
  returnAnimals(animals) {
    if (!Array.isArray(animals)) {
      return;
    }
    animals.forEach(animal => {
      animal.reset();
      this.animalPool.returnAnimal(animal);
    });
  }
  
  setUpAnimal(animal, slice) {
    let { width, height } = slice.sprite;
    animal.position.x += width + Math.random() * 200 - 100;
    let animalOffsets = [65, 25, 50, 65, 50, 30, 50, 70, 70, 55, 25, 45];
    let animalOffset = animalOffsets[ slice.type - 1 ];
    animal.position.y += IslandsOffset.getIslandYOffset(slice.type) + animalOffset;
  }
  
  getNextChicken(x = this.viewportX) {
    let curSliceIndex = Math.floor(this.viewportX / IslandsMap.ViewportSliceWidth);
  }
}