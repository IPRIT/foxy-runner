import deap from 'deap';

export default class PageCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$timeout' ];
  
  constructor($scope, $rootScope, $timeout) {
    this.pageType = 'greeting';
    this.logoSize = 50;
    
    $timeout(() => {
      this.logoSize = 30;
    }, 1500);
  
    /*deap.extend($scope, {
      vm: this
    });*/
  }
  
  test() {
    console.log('Works');
    return this.test2();
  }
  
  test2() {
    return 'Another fn works'
  }
}