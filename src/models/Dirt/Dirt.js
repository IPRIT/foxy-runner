class Dirt extends PIXI.particles.ParticleContainer {
  
  constructor() {
    super(isWebGLRenderer ? 50 : 10, {
      scale: true,
      position: true,
      rotation: true,
      uvs: true,
      alpha: true
    });
    
    this.init();
  }
  
  init() {
    let totalDust = isWebGLRenderer ? 50 : 10;
    this.dust = [];
    for (let i = 0; i < totalDust; ++i) {
      let texture = PIXI.loader.resources[`dirt`].texture;
      let dustParticle = new PIXI.Sprite(texture);
      dustParticle.tint = 0x187082;
      dustParticle.blendMode = PIXI.BLEND_MODES.MULTIPLY;
      dustParticle.position.x = Math.random() * 512;
      dustParticle.position.y = Math.random() * 10;
      dustParticle.anchor.y = -.5;
      let startScale = 0.03 + Math.random() / 30;
      dustParticle.internalState = {
        startScale,
        startX: dustParticle.position.x,
        startY: dustParticle.position.y,
        accelerationX: -Math.random() * 30,
        accelerationY: Math.random() - 3,
        maxDeviationX: 300 + Math.random() * 200,
        maxDeviationY: 50 + Math.random() * 50,
        maxScale: startScale * 1.5
      };
      this.dust.push(dustParticle);
      this.addChild(dustParticle);
    }
  }
  
  animate() {
    this.dust.forEach(particle => {
      let progress = Math.max(
        Math.abs(particle.internalState.startX - particle.position.x) / particle.internalState.maxDeviationX,
        Math.abs(particle.internalState.startY - particle.position.y) / particle.internalState.maxDeviationY
      );
      if (progress >= 1) {
        particle.position.x = particle.internalState.startX;
        particle.position.y = particle.internalState.startY;
        particle.scale.set(particle.internalState.startScale);
        particle.alpha = 1;
      } else {
        particle.position.x += particle.internalState.accelerationX;
        particle.position.y += particle.internalState.accelerationY;
        particle.scale.set(Math.min(particle.internalState.maxScale, progress / 30 + particle.internalState.startScale));
        particle.alpha = 1 - progress;
      }
    });
  }
}