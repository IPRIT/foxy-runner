import { Main } from "./Main";
import * as app from './UI/boards/app';

document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  window.gameMusic = true;
  window.gameSounds = true;
  window.game = new Main();
  game.onload(() => {
    game.run();
    setTimeout(() => {
      //game.start();
    }, 5000);
  });
}