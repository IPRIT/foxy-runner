class GameMap extends IslandsMap {
  
  constructor(parent) {
    super();
    this._parent = parent;
    this.init();
  }
  
  init() {
    this.animationAttractor = AnimationAttractor.getInstance();
    this.foxy = new Foxy();
    this.foxOffsetX = 200;
    this.foxy.position.x += this.foxOffsetX;
    this.addChild(this.foxy);
    
    this.scoreView = new ScoreView();
    this.addChild(this.scoreView);
    
    this.attachEvents();
    this.score = 0;
  }
  
  getMapSpeed() {
    return this._parent.getScrollSpeed();
  }
  
  moveBy(shiftX) {
    this.shiftViewportX(shiftX);
    this.toFront(this.foxy);
    this.foxy.nextStateValue();
    this.foxy.move(this.getCurrentMapY());
    this.foxy.setStateAcceleration(this.getMapSpeed() / Math.sqrt(this.getMapSpeed() * 120));
    this.catchAnimals();
    this.animationAttractor.nextFrame();
  }
  
  getCurrentMapY() {
    let floorY = Main.CanvasHeight - 200;
    let mapSlices = this.slices;
    let currentSliceIndex = this.getSliceForViewportX(this.getViewportX() + this.foxOffsetX);
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
    this.foxy.enableJumpingState();
  }
  
  endJump() {
    this.foxy.disableJumpingState();
  }
  
  catchAnimals() {
    let foxyPosition = [this.foxOffsetX, this.foxy.position.y];
    let nearestAnimal = this.getHitAreaAnimal(this.foxy, foxyPosition, this.foxOffsetX);
    if (!nearestAnimal) {
      return;
    }
    this.score++;
    this.scoreView.setScore(this.score);
    
    if (isWebGLRenderer && game.getFPS() > 45 && Main.CanvasWidth > 1500) {
      let scoreIncrementerView = new ScoreIncrementer();
      scoreIncrementerView.addScore(1, nearestAnimal.animalType, () => {
        this.removeChild(scoreIncrementerView);
        scoreIncrementerView.destroy();
        scoreIncrementerView = null;
      });
      this.addChild(scoreIncrementerView);
    }
    console.log('Score:', this.score);
    
    this.animationAttractor.append(nearestAnimal.getRebornNumber(), nearestAnimal, function animate(animal) {
      return animal.explode();
    });
  }
  
  gameOver() {
    this.isGameOver = true;
    this.foxy.gameOver();
  }
  
  reset() {
    this.animationAttractor.reset();
    this.foxy.reset();
    this.foxy.destroy();
    this.score = 0;
    this.scoreView.reset();
    this.scoreView.destroy();
    
    this.isGameOver = false;
    
    this.resetMap();
  }
}