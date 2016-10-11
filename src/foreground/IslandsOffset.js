class IslandsOffset {
  
  static getIslandYOffset(islandType) {
    let offsets = [
      175, //1
      120, //2
      145, //3
      190, //4
      180, //5
      115, //6
      150, //7
      185, //8
      180, //9
      180, //10
      120, //11
      150  //12
    ];
    return offsets[ islandType - 1 ] || 0;
  }
}