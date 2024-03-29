import { Island } from "./Island";
import { IslandsOffset } from "./IslandsOffset";
import { BounceMovableFunction } from "./MovableFunctions";
import { SinMovableFunction } from "./MovableFunctions";
import { Utils } from "../Utils";

export class MovableIsland extends Island {

  constructor(type, sprite) {
    super(type, sprite);

    this.reset();
    this.ySurfaceOffset = IslandsOffset.getIslandYOffset(type);
  }

  move() {
    this.sinArg += this.sinArgAcceleration * game.multiplier;
    this.yPosition = this.yMiddle + this.offset * this.transformFunction.compute(this.sinArg) * 2;
    this.sprite.position.y = this.yPosition;
  }

  reset() {
    this.sinArg = Math.random() * 100;
    this.sprite.position.y = this.yPosition = this.generateY();
    this.selectTransformFunction();
  }

  selectTransformFunction() {
    let functions = [ BounceMovableFunction, SinMovableFunction ];
    this.transformFunction = new functions[ Utils.getRandomInt(0, functions.length - 1) ]();
    this.sinArgAcceleration = this.transformFunction.accelerator * (Math.random() + 0.5);
  }
}
