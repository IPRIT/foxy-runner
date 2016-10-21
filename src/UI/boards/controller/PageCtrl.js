import { GameState } from "../../../Main";
export default class PageCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$timeout' ];
  
  constructor($scope, $rootScope, $timeout) {
    this.$rootScope = $rootScope;
    this.pageType = 'greeting';
    $scope.play = this.play.bind(this);
    $scope.restart = this.restart.bind(this);
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
  }
  
  toggleSounds(ev) {
    let target = angular.element(ev.target);
    window.gameSounds = !window.gameSounds;
    if (window.gameSounds) {
      target.removeClass('music-off');
    } else {
      target.addClass('music-off');
    }
  }
}