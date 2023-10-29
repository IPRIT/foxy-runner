import { AnimationAttractor } from "../Animation/Attractor";
import { IslandsMap } from "./IslandsMap";
import { Main } from "../Main";
import { IslandType } from "./SliceType";
import { ScoreIncrementer } from "../UI/score/ScoreIncrementer";
import { ScoreView } from "../UI/score/Score";
import { HealthView } from "../UI/health/HealthView";
import { Foxy } from "../models/Foxy/Foxy";
import { Utils } from "../Utils";
import deap from "deap";

export class GameMap extends IslandsMap {

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

    this.healthView = new HealthView();
    this.addChild(this.healthView);

    this.attachEvents();
    this.score = 0;
    this._passIslands = null;
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
    window.score = ++this.score;
    let prob = Utils.getRandomInt(0, 100) / 100;
    if (prob < .9) {
      gameSounds && ion.sound.play(`chicken_3`);
    } else {
      gameSounds && ion.sound.play(`chicken_1`);
    }
    this.scoreView.setScore(this.score);

    if (!this._passIslands) {
      this._passIslands = {};
    }
    let c = {
      _s: this.score.toString(20),
      _f: foxyPosition,
      _p: prob,
      _r: Math.random() * prob,
      _t: new Date().getTime()
    };
    let head = this.getListHead(this._passIslands);
    if (head._t) {
      head._n = c;
    } else {
      deap.extend(head, c);
    }

    if (isWebGLRenderer && game.getFPS() > 45 && Main.CanvasWidth > 2500) {
      let scoreIncrementerView = new ScoreIncrementer();
      scoreIncrementerView.addScore(1, nearestAnimal.animalType, () => {
        this.removeChild(scoreIncrementerView);
        scoreIncrementerView.destroy();
        scoreIncrementerView = null;
      });
      this.addChild(scoreIncrementerView);
    }

    this.animationAttractor.append(nearestAnimal.getRebornNumber(), nearestAnimal, function animate(animal) {
      return animal.explode();
    });
  }

  gameOver() {
    this.isGameOver = true;
    this.foxy.gameOver();
    this.healthView.setHealth(0);

    if (!window.gameMe
      || !window.gameMe._shard
      || window.gameMe.localHighscore >= this.score) {
      return;
    }

    let body = angular.element(document.body);
    let scope = body.scope && body.scope();
    scope.vm.saveResults(this._passIslands);
  }

  destroyHp(hp) {
    gameSounds && this.healthView.getHealth() <= 5 && ion.sound.play(`failure`);
    this.healthView.setHealth(this.healthView.getHealth() - hp);
    if (this.healthView.getHealth() <= 0) {
      game.gameOver();
    }
  }

  getListHead(obj = {}) {
    if (!obj._n) {
      return obj;
    }
    return this.getListHead(obj._n);
  }

  reset() {
    this.animationAttractor.reset();
    this.foxy.reset();
    this.foxy.destroy();
    this.score = 0;
    this._passIslands = null;
    this.scoreView.reset();
    this.scoreView.destroy();

    this.isGameOver = false;

    this.resetMap();
  }
}
