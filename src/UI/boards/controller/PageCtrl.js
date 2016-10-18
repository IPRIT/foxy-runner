import deap from 'deap';

export default class PageCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$timeout' ];
  
  constructor($scope, $rootScope, $timeout) {
    deap.extend(this, {
      $timeout
    });
    this.pageType = 'greeting';
  }
  
  play() {
    window.game.start();
  }
}