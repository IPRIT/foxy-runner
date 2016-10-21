import { GameState } from "../../../Main";
import ds from 'fm-localstorage';
import deap from 'deap';

export default class PageCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$timeout' ];
  
  constructor($scope, $rootScope, $timeout) {
    this.$rootScope = $rootScope;
    this.init();
    
    $scope.play = this.play.bind(this);
    $scope.restart = this.restart.bind(this);
  }
  
  init() {
    this.pageType = 'greeting';
    let settings = ds.get('settings');
    this.isRulesAccepted = settings.isRulesAccepted || false;
  }
  
  play() {
    this.pageType = 'started';
    window.game.start();
  }
  
  restart() {
    this.pageType = 'started';
    window.game.restart();
  }
  
  toggleMusic(ev) {
    let target = angular.element(ev.target);
    window.gameMusic = !window.gameMusic;
    if (window.gameMusic) {
      target.removeClass('music-off');
      game.gameState === GameState.Started && ion.sound.play(`music`);
    } else {
      target.addClass('music-off');
      ion.sound.stop(`music`);
    }
    let settings = ds.get('settings') || {};
    window.ds.set('settings', deap.extend(settings, {
      gameMusic: window.gameMusic
    }));
  }
  
  toggleSounds(ev) {
    let target = angular.element(ev.target);
    window.gameSounds = !window.gameSounds;
    if (window.gameSounds) {
      target.removeClass('music-off');
    } else {
      target.addClass('music-off');
    }
    let settings = ds.get('settings') || {};
    window.ds.set('settings', deap.extend(settings, {
      gameSounds: window.gameSounds
    }));
  }
  
  acceptRules() {
    this.isRulesAccepted = true;
    let settings = ds.get('settings');
    ds.set('settings', deap.extend(settings, {
      isRulesAccepted: this.isRulesAccepted
    }));
  }
  
  gamePause(ev) {
    let target = angular.element(ev.target);
    let buttonResume = angular.element(document.querySelector('.button-resume'));
    target.addClass('button-hidden');
    buttonResume.removeClass('button-hidden');
    window.game.pause();
  }
  
  gameResume(ev) {
    let target = angular.element(ev.target);
    let buttonPause = angular.element(document.querySelector('.button-pause'));
    target.addClass('button-hidden');
    buttonPause.removeClass('button-hidden');
    window.game.resume();
  }
}