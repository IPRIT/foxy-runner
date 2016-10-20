import angular from 'angular';
import * as ngTouch from 'ngtouch';
import * as controller from './controller';
import * as directive from './directive';

let app = angular.module('FoxyRunnerApp', [
  'ng',
  'ngTouch'
]);

app.controller('PageCtrl', controller.PageCtrl);
app.controller('ScoreTableCtrl', controller.ScoreTableCtrl);

app.directive('scoreTable', directive.ScoreTable);

export {
  angular,
  app
};
