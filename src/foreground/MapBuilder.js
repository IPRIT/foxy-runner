import { IslandSlicesPool } from "./IslandSlicesPool";
import { IslandType } from "./SliceType";

export class MapBuilder extends IslandSlicesPool {
  
  constructor() {
    super();
  }
  
  generateNext(lastObject) {
    if (!lastObject) {
      return this.borrowIsland();
    }
    let lastObjectType = lastObject.type;
    if (lastObjectType >= IslandType.BIG_1 && lastObjectType <= IslandType.MOVABLE_4) {
      return this.borrowEmpty();
    } else if (lastObjectType >= IslandType.EMPTY_SHORT && lastObjectType <= IslandType.EMPTY_LARGE) {
      return this.borrowIsland();
    }
    console.error(new Error('MapBuilder#generateNext'));
    return this.borrowIsland();
  }
}