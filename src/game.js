import { Main } from "./Main";
import * as app from './UI/boards/app';
import ds from 'fm-localstorage';
import { typeCheck as isType } from 'type-check';
import { Utils } from "./Utils";

document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  setupSettings();
  
  window.game = new Main();
  game.onload(() => game.run());
}

function setupSettings() {
  window.bgType = Utils.getRandomInt(1, 4);
  angular.element(document.body).addClass(`bg${window.bgType}`);
  
  let settings = ds.get('settings') || {};
  let { gameMusic, gameSounds } = settings || {};
  window.gameMusic = isType('Boolean', gameMusic) ? gameMusic : true;
  window.gameSounds = isType('Boolean', gameSounds) ? gameSounds : true;
  if (!window.gameMusic) {
    angular.element(document.querySelector('.button-music')).addClass('music-off');
  }
  if (!window.gameSounds) {
    angular.element(document.querySelector('.button-sounds')).addClass('music-off');
  }
}