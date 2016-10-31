import { AnimationAttractor as ScoreAnimalPool } from "../../Animation/Attractor";

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
    sprite.scale.set(.05);
    sprite.position.set(300, 36);
    this.addChild(sprite);
    this.chicken = sprite;
  
    this._message.position.set(54, 30);
    this.addChild(this._message);
  }
  
  update() {
    this._message.text = this.getMessage();
    let symbols = this.getScore().toString().length;
    this.chicken.position.set(290 + (symbols - 1) * 20, 36);
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
    return `Score:    ${this.getScore()}`
  }
  
  reset() {
    this._score = 0;
    this.update();
    ScoreAnimalPool.getInstance().reset();
  }
}