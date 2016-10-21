import { GreetingScroller } from "./background/GreetingScroller";
import { Scroller } from "./background/Scroller";
import { AnimationAttractor } from "./Animation/Attractor";
import { Settings } from "./Settings";
import { Utils } from "./Utils";

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
    window.gameFullScreenNeeded = true;
    let [width, height] = Utils.getBodyBounds();
    this.ratio = Main.CanvasRatio;
    this.stage = new PIXI.Container();
    this.renderer = PIXI.autoDetectRenderer(
      width, height, {
        view: document.getElementById(Settings.CanvasDomId),
        antialias: true
      }
    );
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
    /*U.resize(d, f);
    ga.width = d * J;
    ga.height = f * J;
    ga.style.width = d + "px";
    ga.style.height = f + "px";*/
  
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
    loader.add('islands', 'resources/bg/foreground/islands.json');
    loader.add('foxy', './resources/models/foxy/foxy.json');
    loader.add('foxy-died', './resources/models/foxy/died/foxy-died.png');
    loader.add('foxy-ghost', './resources/models/foxy/died/ghost-all.json');
    loader.add('chicken', './resources/models/chicken/chicken-all.json');
    loader.add('chicken-particle', './resources/models/chicken/particle/chicken-particle-all.json');
    loader.add('dirt', './resources/models/dirt/dirt.png');
    loader.add('bg-01', './resources/bg/bg-01.png');
    loader.add('bg-02', './resources/bg/bg-02.png');
    loader.add('bg-03', './resources/bg/bg-03.png');
    loader.add('bg-04', './resources/bg/bg-04.png');
    loader.add('bg-05', './resources/bg/bg-05.png');
    loader.once('complete', callback);
    loader.load();
    let progressInterval = setInterval(() => {
      this.onLoaderProgress(Math.min(100, loader.progress));
      if (Math.min(100, loader.progress) >= 100) {
        clearInterval(progressInterval);
      }
    }, 10);
  }
  
  spriteSheetLoaded() {
    this.scroller = new Scroller(this.stage);
    this.scroller.setScrollSpeed(Settings.ScrollSpeed);
    this.attachEventsAfterLoad();
    
    this.scroller.alpha = 0;
  }
  
  update() {
    if (this.isPaused) {
      return;
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
  }
  
  run() {
    if (!this.isResourcesLoaded) {
      return console.error('Resources not loaded yet');
    }
    this.firstFrameStartedAt = new Date();
    this.frame = 45;
    requestAnimationFrame(this.update.bind(this));
  }
  
  onload(cb) {
    this._onloadCallback = cb;
  }
  
  gameOver() {
    if (this.isGameOver) {
      return;
    }
    this.isGameOver = true;
    this.scroller.gameOver();
    let totalScore = this.scroller.getScore();
    console.log('Game over');
    
    var colorMatrix = new PIXI.filters.ColorMatrixFilter();
    this.stage.filters = [colorMatrix];
    let saturation = 0;
    AnimationAttractor.getInstance()
      .append(1, this.stage, (stage) => {
        colorMatrix.saturate(saturation);
        saturation -= .02;
      }, (stage) => {
        return saturation < -1;
      }, (stage) => {
        console.log('Done');
      });
  
    angular.element(document.body).addClass('bg1-gray');
    setTimeout(() => {
      this.showGameoverOverlay(totalScore);
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
    this.reset();
    this.gameState = GameState.Started;
    this.resize();
    this.scroller.alpha = 1;
    this.hideGreetingOverlay();
    this.hideGameoverOverlay();
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
    this.scroller.alpha = 1;
    this.hideGreetingOverlay();
  }
  
  hideGreetingOverlay() {
    let greetingOverlay = angular.element(document.querySelector('.greeting-overlay'));
    greetingOverlay.addClass('overlay__hidden');
    setTimeout(() => {
      greetingOverlay.remove();
      angular.element(document.body).addClass('bg1');
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
    angular.element(document.body).removeClass('bg1-gray');
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
        document.body.style.background = '#B2D0D0';
        this.showGreetingOverlay();
      }, 2000)
    } else {
      progressLineText.innerHTML = `Loading... ${progress.toFixed(0) || 0}%`;
    }
  }
}