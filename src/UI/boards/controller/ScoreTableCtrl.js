import deap from 'deap';

export default class ScoreTableCtrl {

  static $inject = [ '$scope', '$rootScope', '$http', '$timeout', 'ApiService' ];

  selectedTable = 'local';

  constructor($scope, $rootScope, $http, $timeout, ApiService) {
    this.ApiService = ApiService;
    deap.extend(this, {
      $http, $timeout
    });

    this.scores = [];
    this.fetchScores(this.selectedTable);
    this.cacheStore = {};
    this.isLoading = false;
  }

  fetchScores(type, force = false) {
    if (this.cacheStore && this.cacheStore[type] && !force) {
      return (this.scores = this.cacheStore[type]);
    }
    this.isLoading = true;
    let promiseFulfilled;
    if (type === 'local') {
      promiseFulfilled = this.ApiService.getLocalLeaderboard();
    } else if (type === 'global') {
      promiseFulfilled = this.ApiService.getGlobalLeaderboard();
    }
    promiseFulfilled.then(result => {
      let { scores = [], lastUpdate = '' } = result || {};
      scores = this.ensureScores(scores);
      this.scores = this.cacheStore[ type ] = scores || [];
      this.lastUpdate = lastUpdate ? new Date(lastUpdate) : this.lastUpdate;
    }).finally(() => {
      this.isLoading = false;
    });
  }

  selectTab(tabId) {
    let oldTableId = this.selectedTable;
    this.selectedTable = tabId;

    this.fetchScores(tabId, oldTableId === tabId && !this.selectingTabTimeout);

    this.selectingTabTimeout = setTimeout(() => {
      this.selectingTabTimeout = null
    }, 300)
  }

  ensureScores(scores) {
    if (!Array.isArray(scores)) {
      return [];
    }
    return scores.map(score => {
      let { first_name, last_name, id } = score || {};
      if (first_name && last_name) {
        score.viewName = `${first_name} ${last_name}`;
      } else if (first_name) {
        score.viewName = `${first_name}`;
      } else if (last_name) {
        score.viewName = `${last_name}`;
      } else if (id) {
        score.viewName = `user:${id}`;
      } else {
        score.viewName = 'Unknown player';
      }
      return score;
    });
  }
}
