class IslandsMap extends PIXI.Container {
  
  static get ViewportWidth() {
    return Settings.Width;
  }
  
  static get ViewportSliceWidth() {
    return 550;
  }
  
  static get ViewportNumSlices() {
    return Math.ceil(IslandsMap.ViewportWidth / IslandsMap.ViewportSliceWidth) + 2;
  }
  
  constructor() {
    super();
    this.builder = new MapBuilder();
    this.slices = [];
    this.viewportX = 0;
    this.viewportSliceX = 0;
  
    this.initMap();
  }
  
  initMap() {
    for (let i = 0; i < 3; ++i) {
      //this.slices.push(this.builder.generateNext(this));
    }
  }
  
  getLastObject() {
    if (this.slices.length) {
      return this.slices[ this.slices.length - 1 ];
    }
    console.error('...#getLastObject');
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
    for (var i = this.viewportSliceX, sliceIndex = 0; i < this.viewportSliceX + IslandsMap.ViewportNumSlices; i++, sliceIndex++) {
      let slice;
      if (this.slices[i]) {
        slice = this.slices[i];
      } else {
        slice = this.builder.generateNext(this);
        console.log('Generated!', i);
        this.slices.push(slice);
        this.addChild(slice.sprite);
      }
      slice.sprite.position.x = firstX + (sliceIndex * IslandsMap.ViewportSliceWidth);
      slice.sprite.position.y = slice.yPosition || 0;
    }
  }
  
  removeOldSlices(prevViewportSliceX) {
    var numOldSlices = Math.min(IslandsMap.ViewportNumSlices, this.viewportSliceX - prevViewportSliceX);
    
    for (var i = prevViewportSliceX; i < prevViewportSliceX + numOldSlices; i++) {
      var slice = this.slices[i];
      if (!slice) {
        continue;
      }
      slice.reset();
      this.returnIslandSlice(slice);
      this.removeChild(slice.sprite);
      this.slices[i] = null;
    }
  }
  
  returnIslandSlice(slice) {
    let type = slice.type;
    if (type >= IslandType.BIG_1 && type <= IslandType.MOVABLE_1) {
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
    this.slices.filter(slice => slice && slice.type === IslandType.MOVABLE_1)
      .forEach(slice => slice.move());
  }
}