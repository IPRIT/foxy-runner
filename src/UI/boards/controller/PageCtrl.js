import deap from 'deap';

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
    this.$rootScope.$broadcast('leaderboards.cache.reset');
  }
  
  restart() {
    this.pageType = 'started';
    window.game.restart();
    this.$rootScope.$broadcast('leaderboards.cache.reset');
  }
}