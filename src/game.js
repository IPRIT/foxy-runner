import { Main } from "./Main";
import * as app from './UI/boards/app';
import ds from 'fm-localstorage';
import { typeCheck as isType } from 'type-check';

document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  setupSettings();
  
  window.game = new Main();
  game.onload(() => {
    game.run();
    setTimeout(() => {
      //game.start();
    }, 5000);
  });
}

function setupSettings() {
  let settings = ds.get('settings') || {};
  let { gameMusic, gameSounds } = settings;
  window.gameMusic = isType('Boolean', gameMusic) ? gameMusic : true;
  window.gameSounds = isType('Boolean', gameSounds) ? gameSounds : true;
  if (!window.gameMusic) {
    angular.element(document.querySelector('.button-music')).addClass('music-off');
  }
  if (!window.gameSounds) {
    angular.element(document.querySelector('.button-sounds')).addClass('music-off');
  }
}