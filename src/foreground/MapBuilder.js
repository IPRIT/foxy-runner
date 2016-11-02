import { IslandSlicesPool } from "./IslandSlicesPool";
import { IslandType } from "./SliceType";
import { Utils } from "../Utils";

export class MapBuilder extends IslandSlicesPool {
  
  static SCORE_STEP_LEVEL_1 = 10;
  static SCORE_STEP_LEVEL_2 = 35;
  
  constructor() {
    super();
  }
  
  generateNext(lastObjects, score = 0) {
    if (!lastObjects || !Array.isArray(lastObjects) || !lastObjects.length) {
      return this.borrowIsland();
    }
    let isImplementable1 = lastObjects.length >= 2 && this.areTwoLastObjectsIslandAndEmpty(...lastObjects.slice(-2));
    let needChange1 = Utils.probabilityTest(.5) || score > 20;
    let isImplementable2 = lastObjects.length === 3 && this.areThreeLastObjectsIslandAndTwoEmpties(...lastObjects.slice(-3));
    let needChange2 = Utils.probabilityTest(.5);
    
    let lastObject = lastObjects.slice(-1)[0];
    
    if (score > MapBuilder.SCORE_STEP_LEVEL_1
      && isImplementable1
      && needChange1) {
      return this.borrowEmpty();
    } else if (score > MapBuilder.SCORE_STEP_LEVEL_2
      && isImplementable2
      && needChange2) {
      return this.borrowEmpty();
    } else {
      if (this.isObjectIsland(lastObject)) {
        if (!this.isObjectMovable(lastObject) && Utils.probabilityTest(.2) && score > 1) {
          let island = this.borrowIslandByType(object => !this.isObjectMovable(object));
          if (island) {
            return island;
          }
        }
        return this.borrowEmpty();
      } else if (this.isObjectEmpty(lastObject)) {
        return this.borrowIsland();
      }
    }
    console.error(new Error('MapBuilder#generateNext'));
    return this.borrowIsland();
  }
  
  isObjectEmpty(object) {
    return object.type >= IslandType.EMPTY_SHORT && object.type <= IslandType.EMPTY_LARGE;
  }
  
  isObjectIsland(object) {
    return object.type >= IslandType.BIG_1 && object.type <= IslandType.MOVABLE_4;
  }
  
  isObjectMovable(object) {
    return object.type >= IslandType.MOVABLE_1 && object.type <= IslandType.MOVABLE_4;
  }
  
  areTwoLastObjectsIslandAndEmpty(objectA, objectB) {
    return this.isObjectIsland(objectA) && this.isObjectEmpty(objectB);
  }
  
  areThreeLastObjectsIslandAndTwoEmpties(objectA, objectB, objectC) {
    return this.isObjectIsland(objectA) && this.isObjectEmpty(objectB) && this.isObjectEmpty(objectC);
  }
}