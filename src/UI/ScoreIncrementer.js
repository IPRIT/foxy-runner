class ScoreIncrementer extends PIXI.Container {
  
  constructor() {
    super();
    this.init();
  }
  
  init() {
    this._message = new PIXI.Text(
      this.getMessage(), {
        fontFamily: 'Fredoka One',
        fontSize: '80px',
        fill: 'white'
      }
    );
    
    window.addEventListener('resize', this.resize.bind(this));
    //this.addChild(this._message);
  }
  
  addScore(plus, animalType) {
    this._message.style.fontSize = '380px';
    this._message.text = this.getMessage(plus);
    this._message.position.x -= 550;
    this._message.position.y += 200;
  
    let animal = ScoreAnimalPool.getInstance().borrowAnimal(animalType);
    animal.addChild(this._message);
    animal.scale.set(.12);
    animal.position.set(Main.CanvasWidth / 2 - animal.width / 2 + 50, 50);
    this.addChild(animal);
    
    animal.internalState = {
      startPoint: [ animal.position.x, animal.position.y ],
      startScale: 1,
      endScale: .5,
      endPoint: [ 250, 50 ],
      xVelocity: 0,
      xAcceleration: -.5,
      scaleVelocity: -.002
    };
    let passInterations = 40;
    let currentIteration = 0;
    
    AnimationAttractor.getInstance()
      .append(1, animal, (animal) => {
        let currentPosition = [ animal.position.x, animal.position.y ];
        let fullDistanceX = animal.internalState.startPoint[0] - animal.internalState.endPoint[0];
        let passedDistanceX = animal.internalState.startPoint[0] - currentPosition[0];
        animal.progress = passedDistanceX / fullDistanceX;
        if (++currentIteration > passInterations) {
          animal.position.x += (animal.internalState.xVelocity += animal.internalState.xAcceleration);
          animal.scale.x = Math.max(0, animal.scale.x + animal.internalState.scaleVelocity);
          animal.scale.y = Math.max(0, animal.scale.y + animal.internalState.scaleVelocity);
          animal.alpha -= .01;
        } else {
          if (currentIteration > passInterations / 4) {
            return animal.scale.set(.16);
          }
          animal.scale.x += .16 / passInterations;
          animal.scale.y += .16 / passInterations;
        }
      }, (animal) => {
        animal.progress = animal.progress || 0;
        return animal.progress >= 1;
      }, (animal) => {
        animal.removeChild(this._message);
        this.removeChild(animal);
        animal.progress = 0;
        animal.scale.set(.16);
        animal.alpha = 1;
        ScoreAnimalPool.getInstance().returnAnimal(animal, animalType);
      });
  }
  
  getScore() {
    return this._score;
  }
  
  getMessage(score = 1) {
    return `+${score}`
  }
  
  resize() {
    this._message.position.set(Main.CanvasWidth / 2 - this._message.width / 2, 50);
  }
}