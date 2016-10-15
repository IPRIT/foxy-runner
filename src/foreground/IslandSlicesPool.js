import { IslandsMap } from "./IslandsMap";
import { IslandType } from "./SliceType";
import { MovableIsland } from "./MovableIsland";
import { Island } from "./Island";

export class IslandSlicesPool {
  
  constructor() {
    this.init();
  }
  
  init() {
    this.createIslands();
    this.createEmptySpaces();
  }
  
  createIslands() {
    this.islands = [];
    let islandsNumber = 4;
    let similarTypeNumber = 1;
    for (let type = IslandType.BIG_1; type <= IslandType.SMALL_4; ++type) {
      this.islands = this.islands.concat(this.addObject(type, similarTypeNumber, `island_0${type % islandsNumber + 1}`));
    }
    for (let type = IslandType.MOVABLE_1, spriteIndex = 0; type <= IslandType.MOVABLE_4; ++type, ++spriteIndex) {
      this.islands = this.islands.concat(this.addObject(type, similarTypeNumber * 4, `island_0${spriteIndex + 1}`));
    }
    this.shuffle(this.islands);
  }
  
  addObject(objectType, repeatsNumber = 3, frameName) {
    if (!(`object${objectType}` in this)) {
      this[`object${objectType}`] = []
    }
    
    for (let i = 0; i < repeatsNumber; ++i) {
      let sprite = PIXI.Sprite.fromFrame(frameName);
      let width = sprite.width;
      let ratio = IslandsMap.ViewportSliceWidth / width;
      sprite.scale.x *= ratio;
      sprite.scale.y *= ratio;
  
      let island;
      if (objectType >= IslandType.MOVABLE_1 && objectType <= IslandType.MOVABLE_4) {
        island = new MovableIsland(objectType, sprite);
      } else {
        island = new Island(objectType, sprite);
      }
      this[`object${objectType}`].push(island);
    }
    return this[`object${objectType}`] || [];
  }
  
  shuffle(array = this.islands) {
    let len = array.length;
    let shuffles = len * 3;
    for (let i = 0; i < shuffles; i++) {
      let foregroundSlice = array.pop();
      let pos = Math.floor(Math.random() * (len - 1));
      array.splice(pos, 0, foregroundSlice);
    }
  }
  
  borrowIsland() {
    let island = this.islands.shift();
    console.log('Borrowed island', island.type);
    return island;
  }
  
  returnIsland(object) {
    console.log('Returned island', object.type, 'Count:', this.islands.length);
    this.islands.push(object);
  }
  
  createEmptySpaces() {
    this.emptySpaces = [];
    for (let type = IslandType.EMPTY_SHORT; type <= IslandType.EMPTY_LARGE; ++type) {
      this.emptySpaces = this.emptySpaces.concat(this.addEmptyObject(type, 5));
    }
    this.shuffle(this.emptySpaces);
  }
  
  addEmptyObject(objectType, repeatsNumber) {
    if (!(`object${objectType}` in this)) {
      this[`object${objectType}`] = []
    }
    
    for (let i = 0; i < repeatsNumber; ++i) {
      let scale = 1;
      let emptyContainer = new PIXI.Container();
      //Utils.highlight(emptyContainer);
      
      if (objectType === IslandType.EMPTY_SHORT) {
        emptyContainer.scale.x *= scale;
      } else if (objectType === IslandType.EMPTY_LARGE) {
        emptyContainer.scale.x /= scale;
      }
      this[`object${objectType}`].push(new Island(objectType, emptyContainer));
    }
    return this[`object${objectType}`] || [];
  }
  
  borrowEmpty() {
    //console.log('Borrowed empty');
    return this.emptySpaces.shift();
  }
  
  returnEmpty(object) {
    //console.log('Returned empty', object.type, 'Count:', this.emptySpaces.length);
    this.emptySpaces.push(object);
  }
}