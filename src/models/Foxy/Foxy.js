class Foxy extends PhysicFreeFallObject {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this.frame = 0;
    this.stateValue = 0.0;
    this.stateAcceleration = 0.2; // [.2-.45]
    this.states = 4;
  
    this.movementState = FoxyState.RUNNING;
    
    this.createSprites();
    this.showState();
  
    this.dust = new Dirt();
    this.dust.position.x -= 80;
    this.dust.position.y += 25;
    this.dust.scale.set(this.width / (1.4 * this.dust.width));
    this.addChild(this.dust);
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
    if (this.frame === oldState) {
      return;
    }
    this.sprites.forEach((sprite, index) => {
      if (this.frame === index) {
        sprite.alpha = 1;
      } else {
        sprite.alpha = 0;
      }
    });
  }
  
  nextStateValue() {
    if (this.isGameOver) {
      return;
    }
    if (this.movementState === FoxyState.FLYING) {
      this.frame = 0;
      this.stateValue = 0;
      this.showState();
    } else {
      let oldState = this.frame;
      this.stateValue += this.stateAcceleration;
      this.frame = Math.floor(this.stateValue) % this.states;
      if (!this.frame && this.stateValue > 1) {
        this.stateValue = 0;
      }
      this.showState({ oldState });
    }
  }
  
  move(currentMapY) {
    if (this.isGameOver) {
      return;
    }
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
      this.sprites[this.frame].rotation = sign * rotation;
    } else {
      this.sprites[this.frame].rotation = Math.sin(this.stateValue) / 70 - .05;
    }
  }
  
  running() {
    if (this.isGameOver) {
      return;
    }
    this.movementState = FoxyState.RUNNING;
    this.dust.alpha = 1;
    this.dust.animate();
    if (this.jumpState) {
      this.jump();
    }
  }
  
  flying() {
    this.movementState = FoxyState.FLYING;
    this.dust.alpha = 0;
  }
  
  putOnSurface(currentMapY) {
    this.resetV();
    this.setY(currentMapY);
    let floorY = Main.CanvasHeight - 200;
    if (currentMapY >= floorY) {
      game.gameOver();
    }
  }
  
  jump() {
    if (this.isGameOver) {
      return;
    }
    this.physicJump();
  }
  
  getWidth() {
    return this.sprites && this.sprites.length && this.sprites[0].width;
  }
  
  getHeight() {
    return this.sprites && this.sprites.length && this.sprites[0].height;
  }
  
  gameOver() {
    this.isGameOver = true;
    this.stateAcceleration = 0;
    this.sprites.forEach(sprite => sprite.alpha = 0);
    
    let texture = PIXI.loader.resources[`foxy-died`].texture;
    this.diedFox = new PIXI.Sprite(texture);
    this.diedFox.scale.x = -.25;
    this.diedFox.scale.y = .25;
    this.diedFox.anchor.set(.5);
    this.diedFox.position.y += 5;
    this.addChild(this.diedFox);
    
    this.foxyGhost = new Ghost();
    this.addChild(this.foxyGhost);
    let yGhostAcceleration = 2;
    let xGhostAcceleration = 2;
    this.foxyGhost.position.y -= 50;
    let ySinArg = 0;
    AnimationAttractor.getInstance()
      .append(1, this.foxyGhost, (ghost) => {
        ghost.nextStateValue();
        this.foxyGhost.position.y -= Math.max(0, yGhostAcceleration -= .01);
        this.foxyGhost.position.x += Math.max(0, xGhostAcceleration -= .01);
        if (yGhostAcceleration <= 2) {
          this.foxyGhost.position.y += Math.sin(ySinArg += .1) * 2.5;
        }
      }, (ghost) => {
  
      }, (ghost) => {
  
      });
  }
}