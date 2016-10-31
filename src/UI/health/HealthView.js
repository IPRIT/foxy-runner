import { AnimationAttractor as ScoreAnimalPool } from "../../Animation/Attractor";
import { AnimationAttractor } from "../../Animation/Attractor";

export class HealthView extends PIXI.Container {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this._healthMax = 5;
    this._health = 5;
    this._healths = [];
    this.addText();
    this.addSprites();
    this.position.set(137, 125);
    this.update();
  }
  
  addText() {
    this._text = new PIXI.Text(this.getMessage(), {
      fontFamily: 'Fredoka One',
      fontSize: '48px',
      fill: 'white'
    });
    this._text.anchor.set(.5);
    this.addChild(this._text);
  }
  
  getMessage() {
    return `Health:`;
  }
  
  getRuleMessage() {
    return `You will lose a health if you miss a chicken`;
  }
  
  addSprites() {
    let marginRight = 8;
    for (let i = 0; i < this._healthMax; ++i) {
      let texture = PIXI.loader.resources[`health`].texture;
      let health = new PIXI.Sprite(texture);
      health.anchor.set(.5);
      health.scale.set(.08);
      health.position.x = 130 + (health.width + marginRight) * i;
      health.position.y = 5;
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
  }
  
  getHealth() {
    return this._health;
  }
  
  setHealth(hp) {
    this._health = Math.min(this._healthMax, Math.max(0, hp));
    this.update();
  }
  
  bounceAnimation(health) {
    let frame = 0;
    AnimationAttractor.getInstance()
      .append(1, health, health => {
        health.scale.set(bounceEaseOut(frame / 100) / 100 * 8);
        return (frame += 2.5) >= 100;
      }, () => {}, health => {
        health.scale.set(.08);
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
    this._health = 5;
    this.update();
  }
}