import deap from 'deap';

class ScoreTable {
  
  settings = {
    templateUrl: 'template/score-table.html',
    restrict: 'EA'
  };
  
  constructor() {
    deap.extend(this, this.settings);
  }
}

export default () => new ScoreTable();