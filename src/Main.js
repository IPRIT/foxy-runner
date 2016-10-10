class Main {
  
  static get CanvasWidth() {
    return Settings.Width;
  }
  
  static get CanvasHeight() {
    return Settings.Height;
  }
  
  static get CanvasRatio() {
    return Main.CanvasWidth / Main.CanvasHeight;
  }
  
  static get Ratio() {
    return Utils.getBodyBounds()[0] / Main.CanvasWidth;
  }
  
  constructor() {
    this.init();
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
    this.loadResources();
  }
  
  resize() {
    this.ratio = Main.CanvasRatio;
    let [width, height] = Utils.getBodyBounds();
    if (width / height >= this.ratio) {
      var w = height * this.ratio;
      var h = height;
    } else {
      w = width;
      h = width / this.ratio;
    }
    let widthScale = w / Main.CanvasWidth;
    let heightScale = h / Main.CanvasHeight;
    this.stage.scale.x = widthScale;
    this.stage.scale.y = heightScale;
    this.renderer.resize(w, h);
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
    loader.add('bg-01', './resources/bg/bg-01.png');
    loader.add('bg-02', './resources/bg/bg-02.png');
    loader.add('bg-03', './resources/bg/bg-03.png');
    loader.add('bg-04', './resources/bg/bg-04.png');
    loader.add('bg-05', './resources/bg/bg-05.png');
    loader.once('complete', callback);
    loader.load();
  }
  
  spriteSheetLoaded() {
    this.scroller = new Scroller(this.stage);
    this.scroller.setScrollSpeed(Settings.ScrollSpeed);
    this.attachEventsAfterLoad();
  }
  
  update() {
    this.frame++;
    //console.info('FPS:', (this.frame / ((new Date().getTime() - this.firstFrameStartedAt.getTime()) / 1000)));
    
    this.scroller.setScrollSpeed(
      Math.min(this.scroller.getScrollSpeed() + Settings.ScrollSpeedAcceleration, Settings.MaxScrollSpeed)
    );
    this.scroller.shiftViewportX(this.scroller.getScrollSpeed());
    this.renderer.render(this.stage);
    requestAnimationFrame(this.update.bind(this));
  }
  
  attachEventsAfterLoad() {
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }
  
  start() {
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
}