import deap from 'deap';

export default class ScoreTableCtrl {
  
  static $inject = [ '$scope', '$rootScope', '$http', '$timeout' ];
  
  selectedTable = 'local';
  
  constructor($scope, $rootScope, $http, $timeout) {
    deap.extend(this, {
      $http, $timeout
    });
    
    this.scores = [];
    this.fetchScores(this.selectedTable);
    this.cacheStore = {};
    this.isLoading = false;
    this.attachEvents.call($scope);
  }
  
  fetchScores(type, force = false) {
    if (this.cacheStore && this.cacheStore[type] && !force) {
      return (this.scores = this.cacheStore[type]);
    }
    this.isLoading = true;
    this.$http.get('https://predictor.yandex.net/suggest.json/complete?lang=ru&sid=3b61d69f&q=%D0%BF%D0%B8&limit=1&callback=invoke=frame_7').then(() => {
      this.scores = this.cacheStore[type] = [{
        id: 121212,
        rate: 1,
        worldRate: 1023,
        name: 'Alexander Belov',
        score: 66
      }, {
        id: 32324234,
        rate: 2,
        worldRate: 10024,
        name: 'Foxy fox',
        score: 21
      }, {
        id: 121212,
        rate: 3,
        worldRate: 1023,
        name: 'ﺾ	ﻀ	ﺿ	ﺽ',
        score: 66
      }, {
        id: 32324234,
        rate: 4,
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
      if (type === 'global') {
        this.scores.reverse();
      }
      this.$timeout(() => {
        this.isLoading = false;
      }, 100);
      return this.scores;
    });
  }
  
  selectTab(tabId) {
    let oldTableId = this.selectedTable;
    this.selectedTable = tabId;
    this.fetchScores(tabId, oldTableId === tabId);
  }
  
  attachEvents() {
    this.$on('leaderboards.cache.reset', (ev, args) => {
      console.log('Cache resetting...');
      this.vm.cacheStore = null;
      this.vm.cacheStore = {};
      this.vm.fetchScores('local');
    });
  }
}