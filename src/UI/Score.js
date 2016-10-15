import { AnimationAttractor as ScoreAnimalPool } from "../Animation/Attractor";

export class ScoreView extends PIXI.Container {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this._score = 0;
    this._message = new PIXI.Text(this.getMessage(), {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      fill: 'white'
    });
  
    let sprite = PIXI.Sprite.fromFrame(`chicken-01`);
    sprite.scale.x = .1;
    sprite.scale.y = .1;
    sprite.position.set(54, 50);
    this.addChild(sprite);
  
    this._message.position.set(80 + sprite.width, 60);
    this.addChild(this._message);
  }
  
  update() {
    this._message.text = this.getMessage();
  }
  
  setScore(score, noUpdate) {
    this._score = score;
    if (!noUpdate) {
      this.update();
    }
  }
  
  getScore() {
    return this._score;
  }
  
  getMessage() {
    return `Score: ${this.getScore()}`
  }
  
  reset() {
    this._score = 0;
    this.update();
    ScoreAnimalPool.getInstance().reset();
  }
}