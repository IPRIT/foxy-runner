class IslandsOffset {
  
  static getIslandYOffset(islandType) {
    let offsets = [
      150, 100, 120, 150, 150, 105, 125, 150, 150
    ];
    return offsets[ islandType - 1 ] || 0;
  }
}