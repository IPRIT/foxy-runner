import { AnimationAttractor as ScoreAnimalPool } from "../../Animation/Attractor";
import { AnimationAttractor } from "../../Animation/Attractor";

export class HealthView extends PIXI.Container {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this._healthMax = 5;
    this._health = 6;
    this._healths = [];
    this.addText();
    this.addSprites();
    this.update();
  }
  
  addText() {
    this._text = new PIXI.Text(this.getMessage(), {
      fontFamily: 'Fredoka One',
      fontSize: '480px',
      fill: 'white'
    });
    this._text.anchor.set(.5);
    this._text.position.x -= 500;
    this.addChild(this._text);
  }
  
  getMessage() {
    return Math.min(this._healthMax, this._health).toString();
  }
  
  addSprites() {
    let marginRight = 20;
    for (let i = 0; i < this._healthMax; ++i) {
      let texture = PIXI.loader.resources[`health`].texture;
      let health = new PIXI.Sprite(texture);
      health.anchor.set(.5);
      health.position.x = (health.width + marginRight) * i;
      this._healths.push(health);
      this.addChild(health);
    }
  }
  
  update() {
    for (let i = 0; i < this._healthMax; ++i) {
      if (i >= this._health) {
        this._healths[ i ].blendMode = PIXI.BLEND_MODES.SCREEN;
        this.bounceAnimation(this._healths[ i ]);
      }
    }
    this._text.text = this.getMessage();
  }
  
  getHealth() {
    return this._health;
  }
  
  setHealth(hp) {
    this._health = hp;
    this.update();
  }
  
  bounceAnimation(health) {
    let frame = 0;
    AnimationAttractor.getInstance()
      .append(1, health, health => {
        health.scale.set(bounceEaseOut(frame / 100));
        return (frame += 2.5) >= 100;
      }, () => {}, health => {
        health.scale.set(1);
      });
  
    function bounce(progress) {
      for(var a = 0, b = 1; 1; a += b, b /= 2) {
        if (progress >= (7 - 4 * a) / 11) {
          return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
        }
      }
    }
  
    function makeEaseOut(delta) {
      return function(progress) {
        return 1 - delta(1 - progress);
      }
    }
  
    var bounceEaseOut = makeEaseOut(bounce);
  }
  
  reset() {
    this._health = 6;
    this.update();
  }
}