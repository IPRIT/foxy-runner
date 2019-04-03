import deap from 'deap';

class ApiService {
  
  static $inject = [ '$http', '$q' ];
  
  constructor($http, $q) {
    deap.extend(this, {
      $http, $q
    });
    this._cache = {};
  }
  
  getMe(fromCache = false) {
    if (fromCache && this._cache && this._cache.hasOwnProperty('getMe')) {
      return this.$q.when(this._cache[ 'getMe' ]);
    }
    return this.apiRequest('getMe');
  }
  
  getLocalLeaderboard(fromCache = false) {
    let method = 'getLocalLeaderboard';
    if (fromCache && this._cache && this._cache.hasOwnProperty(method)) {
      return this.$q.when(this._cache[ method ]);
    }
    return this.apiRequest(method);
  }
  
  getGlobalLeaderboard(fromCache = false) {
    let method = 'getGlobalLeaderboard';
    if (fromCache && this._cache && this._cache.hasOwnProperty(method)) {
      return this.$q.when(this._cache[ method ]);
    }
    return this.apiRequest(method);
  }
  
  setScore(hash) {
    console.log(hash);
    let method = 'expandScore';
    return this.apiRequest(method, { hash }, { method: 'post' });
  }
  
  apiRequest(method, data = {}, params = {}) {
    let apiEndpoint = `http://play.alexbelov.xyz/game-api/${method}`;
    let defaultData = {
      session: this.getSession()
    };
    let defaultParams = {
      method: 'get'
    };
    deap.extend(data, defaultData);
    deap.merge(params, defaultParams);
    
    return this.$http({
      url: apiEndpoint,
      method: params.method,
      [params.method === 'get' ? 'params' : null]: data,
      [params.method === 'post' ? 'data' : null]: data
    }).then(result => {
      return (this._cache[ method ] = result.data);
    });
  }
  
  getSession() {
    let { initParams } = window.TelegramGameProxy || {};
    let { session = '' } = initParams || {};
    return session;
  }
}

export default ApiService;