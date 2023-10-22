import { Main } from "./Main";
import * as app from './UI/boards/app';
import ds from 'fm-localstorage';
import { typeCheck as isType } from 'type-check';
import { Utils } from "./Utils";

let cons = console.log;
console.log = (...args) => {
  cons.apply(console, args);
};

document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  setupSettings();
  attachEvents();

  window.game = new Main();
  game.onload(() => game.run());
}

function setupSettings() {
  window.bgType = Utils.getRandomInt(1, 4);
  angular.element(document.body).addClass(`bg${window.bgType}`);

  let settings = ds.get('settings') || {};
  let { gameMusic2, gameSounds } = settings || {};
  window.gameMusic = isType('Boolean', gameMusic2) ? gameMusic2 : false;
  window.gameSounds = isType('Boolean', gameSounds) ? gameSounds : true;

  console.log('gameMusic, gameSounds', gameMusic, gameSounds)
  if (!window.gameMusic) {
    angular.element(document.querySelector('.button-music')).addClass('music-off');
  }
  if (!window.gameSounds) {
    angular.element(document.querySelector('.button-sounds')).addClass('music-off');
  }
  window.score = 0;
}

function attachEvents() {
  window.addEventListener('resize', resize);
  setTimeout(resize, 500);
}

function resize() {
  let [ layer, boards ] = [ document.body, Array.from(document.querySelectorAll('.score-table__board')) ];
  if (!layer || !boards || !boards.length || !layer.offsetHeight) {
    return;
  }
  for (let board of boards) {
    board.style.maxHeight = `${layer.offsetHeight / 2}px`;
  }
}
