import angular from 'angular';
import * as controller from './controller';
import * as directive from './directive';

let app = angular.module('FoxyRunnerApp', [
  'ng'
]);

app.controller('PageCtrl', controller.PageCtrl);
app.controller('ScoreTableCtrl', controller.ScoreTableCtrl);

app.directive('scoreTable', directive.ScoreTable);

export {
  angular,
  app
};
