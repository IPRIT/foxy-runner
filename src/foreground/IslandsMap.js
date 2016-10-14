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
          peaceAnimal.reset();
          this.setUpAnimal(peaceAnimal, slice);
          slice.addAnimal(peaceAnimal);
          slice.sprite.addChild(peaceAnimal);
        }
        
        this.slices.push(slice);
        this.addChild(slice.sprite);
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
      AnimationAttractor.getInstance()
        .remove(animal);
      animal.reset();
      this.animalPool.returnAnimal(animal);
    });
  }
  
  setUpAnimal(animal, slice) {
    let { width, height } = slice.sprite;
    animal.position.x = (width / slice.sprite.scale.x) / 2 + Math.random() * 200 - 100;
    let animalOffsets = [65, 25, 50, 65, 50, 30, 50, 70, 70, 55, 25, 45];
    let animalOffset = animalOffsets[ slice.type - 1 ];
    animal.position.y = IslandsOffset.getIslandYOffset(slice.type) + animalOffset;
  }
  
  getHitAreaAnimal(foxy, foxyPosition, foxOffset) {
    let curSliceIndex = this.getCurrentSliceIndex();
    for (let sliceIndex = curSliceIndex; sliceIndex < this.slices.length; ++sliceIndex) {
      let island = this.slices[ curSliceIndex ];
      if (!island) {
        console.error(`Island doesn't exist`);
        continue;
      }
      let animals = island.getAnimals();
      if (!animals.length) {
        continue;
      }
      let animalIndex = -1;
      animals.forEach((animal, index) => {
        if (animalIndex >= 0 || animal.isExploded) {
          return;
        }
        let animalX = island.sprite.position.x + animal.position.x - foxOffset;
        let animalY = island.sprite.position.y + IslandsOffset.getIslandYOffset(island.type);
        let animalPosition = [animalX, animalY];
        //Utils.mark([animalX, animalY], this);
        let conditions = [
          this.isBetween([foxyPosition[0] - foxy.getWidth() / 2, foxyPosition[0] + foxy.getWidth() / 2], animalPosition[0]),
          this.isBetween([foxyPosition[1] - foxy.getHeight() / 2, foxyPosition[1] + foxy.getHeight() / 2], animalPosition[1])
        ];
        //Utils.mark([foxyPosition[0] - foxy.getWidth() / 2, foxyPosition[1] - foxy.getHeight() / 2], this);
        //Utils.mark([foxyPosition[0] + foxy.getWidth() / 2, foxyPosition[1] - foxy.getHeight() / 2], this);
        //Utils.mark([foxyPosition[0] - foxy.getWidth() / 2, foxyPosition[1] + foxy.getHeight() / 2], this);
        //Utils.mark([foxyPosition[0] + foxy.getWidth() / 2, foxyPosition[1] + foxy.getHeight() / 2], this);

        if (conditions.every(condition => condition)) {
          console.log('Caught!', animals[ index ].id);
          animalIndex = index;
        }
      });
      if (animalIndex >= 0) {
        return animals[ animalIndex ];
      }
    }
  }
  
  isBetween(interval, coord) {
    return interval[0] <= coord && coord <= interval[1];
  }
}