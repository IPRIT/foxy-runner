import angular from 'angular';
import * as controller from './controller';
import * as directive from './directive';

let app = angular.module('FoxyRunnerApp', [
  'ng'
]);

app.controller('PageCtrl', controller.PageCtrl);
app.controller('ScoreTableCtrl', controller.ScoreTableCtrl);

app.directive('scoreTable', directive.ScoreTable);

app.run(() => {
  window.addEventListener('resize', resize);
  resize();
  let checks = 0;
  let checkInterval = setInterval(() => {
    resize();
    checks++;
    if (checks > 10) {
      clearInterval(checkInterval);
    }
  }, 100);
});

export {
  angular,
  app
};

function resize(ev) {
  let width = document.querySelector('#game-canvas').width;
  document.querySelector('.canvas-overlay').style.width = width + 'px';
}