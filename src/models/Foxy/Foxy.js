class Foxy extends PhysicFreeFallObject {
  
  constructor() {
    super();
    
    this.init();
  }
  
  init() {
    this.state = 0;
    this.stateValue = 0.0;
    this.stateAcceleration = 0.45;
    this.states = 4;
  
    this.movementState = FoxyState.RUNNING;
    
    this.createSprites();
    this.showState();
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
    sprite.anchor.x = 1;
    sprite.scale.x = -.2;
    sprite.scale.y = .2;
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
      this.setFlyingState();
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
    this.compute();
    let y = this.getY();
    if (y > currentMapY) {
      this.resetV();
      this.setY(currentMapY);
      this.movementState = FoxyState.RUNNING;
      this.endJump();
    } else if (Math.abs(currentMapY - y) > 20) {
      this.movementState = FoxyState.FLYING;
    } else {
      this.movementState = FoxyState.RUNNING;
      this.endJump();
    }
    this.position.y = Math.min(y, currentMapY);
    
    if (Math.abs(this._v) > 10 && this.movementState === FoxyState.FLYING) {
      let sign = this._v > 0 ? 1 : -1;
      let rotation = Math.min(2, Math.abs(this._v / 700));
      this.sprites[this.state].rotation = sign * rotation;
    } else {
      this.sprites[this.state].rotation = Math.sin(this.stateValue) / 70 - .05;
    }
  }
  
  setFlyingState() {
    this.state = 0;
    this.stateValue = 0;
  }
  
  startJump() {
    if (this.movementState === FoxyState.RUNNING) {
      this.physicJump();
      this.loosenGravity();
    }
  }
  
  endJump() {
    if (this.movementState === FoxyState.FLYING) {
      this.repairGravity();
    }
  }
}