class GameMap extends IslandsMap {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.foxy = new Foxy();
    this.foxOffsetX = 200;
    this.position.x += this.foxOffsetX;
    this.addChild(this.foxy);
    this.attachEvents();
  }
  
  moveBy(shiftX) {
    this.shiftViewportX(shiftX);
    this.toFront(this.foxy);
    this.foxy.nextStateValue();
    this.foxy.move(this.getCurrentMapY());
  }
  
  getCurrentMapY() {
    let floorY = Main.CanvasHeight - 200;
    let mapSlices = this.slices;
    let currentSliceIndex = this.getSliceForViewportX(this.getViewportX());
    let slice = mapSlices[ currentSliceIndex ];
    //console.log('Current type is', slice.type);
    if (slice && slice.type >= IslandType.BIG_1 && slice.type <= IslandType.MOVABLE_4) {
      let foxY = this.foxy.getY();
      let surfaceY = slice.yPosition + slice.ySurfaceOffset;
      if (foxY - surfaceY > 30) {
        return floorY;
      }
      return slice.yPosition + slice.ySurfaceOffset;
    }
    return floorY;
  }
  
  toFront(object) {
    this.removeChild(object);
    this.addChild(object);
  }
  
  attachEvents() {
    document.addEventListener('keydown', this.onKeyDown.bind(this));
    document.addEventListener('mousedown', this.startJump.bind(this));
    document.addEventListener('touchstart', this.startJump.bind(this));
  
    document.addEventListener('keyup', this.onKeyUp.bind(this));
    document.addEventListener('mouseup', this.endJump.bind(this));
    document.addEventListener('touchend', this.endJump.bind(this));
  }
  
  detachEvents() {
    // todo: detach events
  }
  
  onKeyDown(event) {
    if (event.keyCode !== 32 && event.keyCode !== 87 && event.keyCode !== 38) {
      return;
    }
    this.startJump();
  }
  
  onKeyUp() {
    if (event.keyCode !== 32 && event.keyCode !== 87 && event.keyCode !== 38) {
      return;
    }
    this.endJump();
  }
  
  startJump() {
    this.foxy.startJump();
  }
  
  endJump() {
    this.foxy.endJump();
  }
}