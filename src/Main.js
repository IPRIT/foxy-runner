import { Scroller } from "./background/Scroller";
import { AnimationAttractor } from "./Animation/Attractor";
import { Settings } from "./Settings";
import { Utils } from "./Utils";
import * as ionModule from 'ion-sound';

export class GameState {
  
  static get Started() {
    return 1;
  }
  
  static get Greeting() {
    return 2;
  }
  
  static get LeaderBoard() {
    return 3;
  }
}

export class Main {
  
  static get CanvasWidth() {
    return Settings.Width;
  }
  
  static get CanvasHeight() {
    return Settings.Height;
  }
  
  static get CanvasRatio() {
    return Main.CanvasWidth / Main.CanvasHeight;
  }
  
  constructor() {
    this.init();
    this.gameState = GameState.Greeting;
  }
  
  init() {
    let [width, height] = Utils.getBodyBounds();
    this.ratio = Main.CanvasRatio;
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(
      width, height, {
        view: document.getElementById(Settings.CanvasDomId)
      }
    );
    this.renderer.roundPixels = true;
    window.isWebGLRenderer = this.renderer instanceof PIXI.WebGLRenderer;
    this.loadResources();
  }
  
  resize() {
    this.ratio = Main.CanvasRatio;
    let [ width, height ] = Utils.getBodyBounds();
    if (width / height >= this.ratio) {
      var w = height * this.ratio;
      var h = height;
    } else {
      w = width;
      h = width / this.ratio;
    }
    window.bounds = [ width, height ];
    window.isCached = true;
  
    let devicePixelRatio = window.devicePixelRatio;
    2 < devicePixelRatio && (devicePixelRatio = 2);
    this.renderer.resize(w * devicePixelRatio, h * devicePixelRatio);
    let canvas = document.getElementById('game-canvas');
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
  
    let widthScale = w / Main.CanvasWidth;
    let heightScale = h / Main.CanvasHeight;
    this.stage.scale.x = widthScale * devicePixelRatio;
    this.stage.scale.y = heightScale * devicePixelRatio;
    
    if (this.gameState === GameState.Started) {
      this.scroller.hardViewUpdate();
    }
  }
  
  loadResources() {
    this.loadSpriteSheet(() => {
      this.spriteSheetLoaded();
  
      this.isResourcesLoaded = true;
      if (this._onloadCallback) {
        this._onloadCallback();
      }
    });
  }
  
  loadSpriteSheet(callback) {
    var loader = PIXI.loader;
    if (bgType === 5) {
      loader.add('islands', 'resources/bg/foreground/halloween-islands.json');
    } else {
      loader.add('islands', 'resources/bg/foreground/islands.json');
    }
    loader.add('foxy', './resources/models/foxy/foxy.json');
    loader.add('foxy-died', './resources/models/foxy/died/foxy-died.png');
    loader.add('foxy-flying', './resources/models/foxy/flying/foxy-flying.png');
    loader.add('foxy-ghost', './resources/models/foxy/died/ghost-all.json');
    if (bgType === 5) {
      loader.add('chicken', './resources/models/chicken/pumpkin-chicken-all.json');
    } else {
      loader.add('chicken', './resources/models/chicken/chicken-all.json');
    }
    loader.add('chicken-particle', './resources/models/chicken/particle/chicken-particle-all.json');
    loader.add('dirt', './resources/models/dirt/dirt.png');
    loader.add('health', './resources/models/health/health.png');
    if (window.bgType === 1) {
      window.bgSpritesNumber = 4;
    } else if (window.bgType === 2) {
      window.bgSpritesNumber = 5;
    } else if (window.bgType === 3) {
      window.bgSpritesNumber = 5;
    } else if (window.bgType === 4) {
      window.bgSpritesNumber = 6;
    } else if (window.bgType === 5) {
      window.bgSpritesNumber = 7;
    } else {
      window.bgType = 3;
      window.bgSpritesNumber = 5;
      console.error('Unexpected behavior');
    }
    for (let i = 1; i <= window.bgSpritesNumber; ++i) {
      loader.add(`bg-0${i}`, `./resources/bg/${window.bgType}/bg-0${i}.png`);
    }
    
    loader.once('complete', callback);
    loader.load();
    let progressInterval = setInterval(() => {
      this.onLoaderProgress(Math.min(100, loader.progress));
      if (Math.min(100, loader.progress) >= 100) {
        clearInterval(progressInterval);
      }
    }, 10);
    
    ion.sound({
      sounds: [{
        name: "fall"
      }, {
        name: "failure",
        volume: .7
      }, {
        name: "chicken_1",
        volume: .7
      }, {
        name: "chicken_3",
        volume: .7
      }, {
        name: "music",
        volume: .65,
        loop: true,
        multiplay: false,
        ready_callback: () => {
          setTimeout(() => {
            gameMusic && ion.sound.play(`music`);
          }, 200);
        }
      }],
      volume: 1,
      path: `./resources/sounds/${window.bgType === 5 ? 'halloween/' : ''}`,
      preload: true,
      multiplay: true
    });
  }
  
  spriteSheetLoaded() {
    this.scroller = new Scroller(this.stage);
    this.scroller.setScrollSpeed(Settings.ScrollSpeed);
    this.attachEventsAfterLoad();
    
    this.scroller.alpha = 0;
  }
  
  update() {
    if (this.isPaused) {
      return requestAnimationFrame(this.update.bind(this));
    }
    this.frame++;
    
    if (this.gameState === GameState.Started) {
      this.scroller.setScrollSpeed(
        Math.min(this.scroller.getScrollSpeed() + Settings.ScrollSpeedAcceleration, Settings.MaxScrollSpeed)
      );
      this.scroller.shiftViewportX(this.scroller.getScrollSpeed());
    }
    
    this.renderer.render(this.stage);
    requestAnimationFrame(this.update.bind(this));
  }
  
  attachEventsAfterLoad() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    
    window.addEventListener('keydown', (ev) => {
      if (ev.keyCode === 80 && this.gameState === GameState.Started) {
        (Array.from(
          document.querySelectorAll('.button-pause:not(.button-hidden),.button-resume:not(.button-hidden)')
        ) || []).forEach(element => element.click());
      }
    });
  }
  
  run() {
    if (!this.isResourcesLoaded) {
      return console.error('Resources not loaded yet');
    }
    this.firstFrameStartedAt = new Date();
    this.frame = 45;
    window.__1.setThrottle(.3);
    requestAnimationFrame(this.update.bind(this));
  }
  
  onload(cb) {
    this._onloadCallback = cb;
  }
  
  gameOver() {
    if (this.isGameOver) {
      return;
    }
    gameSounds && ion.sound.play("fall");
    this.isGameOver = true;
    this.scroller.gameOver();
    let totalScore = this.scroller.getScore();
    window.__1.setThrottle(.3);
    console.log('Game over');

    angular.element(document.querySelectorAll('.button-pause, .button-resume')).addClass('button-hidden');
    setTimeout(() => {
      this.showGameoverOverlay(totalScore);
      gameMusic && ion.sound.play(`music`);
    }, 1500);
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.firstFrameStartedAt = new Date();
    this.frame = 45;
    this.isPaused = false;
  }
  
  getFPS() {
    return (this.frame / ((new Date().getTime() - this.firstFrameStartedAt.getTime()) / 1000));
  }
  
  restart() {
    window.score = 0;
    this.reset();
    this.gameState = GameState.Started;
    this.resize();
    this.scroller.alpha = 1;
    this.hideGreetingOverlay();
    this.hideGameoverOverlay();
    bgType !== 5 && ion.sound.stop(`music`);
    angular.element(document.querySelectorAll('.button-pause')).removeClass('button-hidden');
    angular.element(document.querySelectorAll('.button-resume')).addClass('button-hidden');
  }
  
  reset() {
    this.pause();
    
    if (this.stage.filters && this.stage.filters.length) {
      this.stage.filters[0].saturate(0);
    }
    this.scroller.reset();
    this.scroller = null;
    
    this.scroller = new Scroller(this.stage);
    this.scroller.setScrollSpeed(Settings.ScrollSpeed);
    this.isGameOver = false;
    
    this.resume();
  }
  
  start() {
    this.gameState = GameState.Started;
    this.resize();
    window.__1.setThrottle(.9);
    this.scroller.alpha = 1;
    this.hideGreetingOverlay();
    bgType !== 5 && ion.sound.stop(`music`);
  
    angular.element(document.querySelectorAll('.button-pause')).removeClass('button-hidden');
    angular.element(document.querySelectorAll('.button-resume')).addClass('button-hidden');
  }
  
  hideGreetingOverlay() {
    let greetingOverlay = angular.element(document.querySelector('.greeting-overlay'));
    greetingOverlay.addClass('overlay__hidden');
    setTimeout(() => {
      greetingOverlay.remove();
      angular.element(document.body).addClass(`bg${window.bgType}`);
    }, 200);
  }
  
  showGreetingOverlay() {
    let greetingOverlay = angular.element(document.querySelector('.greeting-overlay'));
    let canvasLayout = angular.element(document.querySelector('.page'));
    greetingOverlay.css({display: 'block'});
    setTimeout(() => greetingOverlay.removeClass('overlay__hidden'), 50);
    setTimeout(() => canvasLayout.css({display: 'block'}), 300);
  }
  
  hideGameoverOverlay() {
    let gameoverOverlay = angular.element(document.querySelector('.gameover-overlay'));
    gameoverOverlay.addClass('overlay__hidden');
    setTimeout(() => {
      gameoverOverlay.css({display: 'none'});
    }, 200);
  }
  
  showGameoverOverlay(totalScore = 0) {
    let gameoverOverlay = angular.element(document.querySelector('.gameover-overlay'));
    gameoverOverlay.css({display: 'block'});
    setTimeout(() => gameoverOverlay.removeClass('overlay__hidden'), 50);
    let totalScoreLayout = angular.element(document.querySelector('.gameover-overlay__total-score'));
    totalScoreLayout.text(`You scored ${totalScore}`);
    let tableLayout = angular.element(document.querySelector('.score-table'));
    let targetScope = tableLayout.scope();
    targetScope.vm.cacheStore = null;
    targetScope.vm.cacheStore = {};
    targetScope.vm.selectedTable = 'local';
    targetScope.vm.fetchScores('local', true);
  }
  
  onLoaderProgress(progress = 0) {
    let progressLine = document.querySelector('.progress__line-loaded');
    let progressLineText = document.querySelector('.progress__line-loading');
    progressLine.style.width = `${progress || 0}%`;
    
    if (progress === 100) {
      progressLineText.innerHTML = `Rendering chickens...`;
      setTimeout(() => {
        let overlay = document.querySelector('.loading-overlay');
        angular.element(overlay).addClass('overlay__hidden');
        setTimeout(() => {
          angular.element(overlay).remove();
        }, 300);
        //document.body.style.background = '#B2D0D0';
        this.showGreetingOverlay();
      }, 2000)
    } else {
      progressLineText.innerHTML = `Loading... ${progress.toFixed(0) || 0}%`;
    }
  }
  
  destroyHp(hp = 1) {
    this.scroller.destroyHp(hp);
  }
}