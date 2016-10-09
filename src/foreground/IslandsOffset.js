class IslandsOffset {
  
  static getIslandYOffset(islandType) {
    let offsets = [
      190, 140, 160, 190, 190, 145, 165, 190, 190
    ];
    return offsets[ islandType - 1 ] || 0;
  }
}