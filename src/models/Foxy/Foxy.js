class Foxy extends PhysicFreeFallObject {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.state = 0;
    this.stateValue = 0.0;
    this.stateAcceleration = 0.2; // [.2-.45]
    this.states = 4;
  
    this.movementState = FoxyState.RUNNING;
    
    this.createSprites();
    this.showState();
  }
  
  setStateAcceleration(acceleration) {
    this.stateAcceleration = Math.max(Math.min(acceleration, .45), .2);
  }
  
  createSprites() {
    this.sprites = [];
    for (let state = 0; state < this.states - 1; ++state) {
      this.addSprite(`foxy-0${state + 1}`);
    }
    // add a middle sprite in the end
    this.addSprite(`foxy-02`);
  }
  
  addSprite(frameId) {
    let sprite = PIXI.Sprite.fromFrame(frameId);
    sprite.scale.x = -.25;
    sprite.scale.y = .25;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    this.sprites.push(sprite);
    this.addChild(sprite);
  }
  
  showState({ oldState } = {}) {
    if (this.state === oldState) {
      return;
    }
    this.sprites.forEach((sprite, index) => {
      if (this.state === index) {
        sprite.alpha = 1;
      } else {
        sprite.alpha = 0;
      }
    });
  }
  
  nextStateValue() {
    if (this.movementState === FoxyState.FLYING) {
      this.state = 0;
      this.stateValue = 0;
      this.showState();
    } else {
      let oldState = this.state;
      this.stateValue += this.stateAcceleration;
      this.state = Math.floor(this.stateValue) % this.states;
      if (!this.state && this.stateValue > 1) {
        this.stateValue = 0;
      }
      this.showState({ oldState });
    }
  }
  
  move(currentMapY) {
    this.jumpState ? this.loosenGravity() : this.repairGravity();
    this.compute();
    let nextY = this.getY();
    if (nextY - currentMapY > 0 && this._v > 0) {
      this.putOnSurface(currentMapY);
      this.running();
    } else {
      this.flying();
    }
    this.position.y = Math.min(nextY, currentMapY);
    this.tilt(this._v);
  }
  
  enableJumpingState() {
    this.jumpState = true;
  }
  
  disableJumpingState() {
    this.jumpState = false;
  }
  
  tilt(velocity) {
    if (this.movementState === FoxyState.FLYING) {
      let sign = velocity >= 0 ? 1 : -1;
      let rotation = Math.abs(velocity / 700);
      this.sprites[this.state].rotation = sign * rotation;
    } else {
      this.sprites[this.state].rotation = Math.sin(this.stateValue) / 70 - .05;
    }
  }
  
  running() {
    this.movementState = FoxyState.RUNNING;
    if (this.jumpState) {
      this.jump();
    }
  }
  
  flying() {
    this.movementState = FoxyState.FLYING;
  }
  
  putOnSurface(currentMapY) {
    this.resetV();
    this.setY(currentMapY);
  }
  
  jump() {
    this.physicJump();
  }
}