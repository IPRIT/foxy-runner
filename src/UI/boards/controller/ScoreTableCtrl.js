export default class ScoreTableCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$http' ];
  
  selectedTable = 'local';
  
  constructor($scope, $rootScope, $http) {
    this.$http = $http;
    this.test = 'works';
    this.scores = [];
    this.fetchScores(this.selectedTable);
  }
  
  fetchScores(type) {
    this.$http.get('http://localhost:63342/foxy-runner/dist/index.html').then(() => {
      this.scores = [{
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }, {
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Хитрый Лис',
        score: 21
      }];
    });
  }
  
  
  selectTab(tabId) {
    console.log(tabId);
    this.selectedTable = tabId;
  }
}