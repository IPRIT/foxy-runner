class AnimationAttractor {
  
  static getInstance() {
    return window._animationAttractor || (window._animationAttractor = new AnimationAttractor());
  }
  
  constructor() {
    this._animationCore = [];
  }
  
  nextFrame() {
    this._animationCore.forEach((element, index) => {
      let [ reborn, object, animate, check, done ] = element;
      if (check && check(object, reborn)) {
        if (done) {
          done(object);
        }
        return this._animationCore.splice(index, 1);
      }
      if (animate(object)) {
        if (done) {
          done(object);
        }
        return this._animationCore.splice(index, 1);
      }
    });
  }
  
  append(...args) {
    this._animationCore.push(args);
  }
  
  remove(animalToRemove) {
    this._animationCore.forEach((object, index) => {
      if (object[1].id == animalToRemove.id) {
        this._animationCore.splice(index, 1);
      }
    });
  }
}