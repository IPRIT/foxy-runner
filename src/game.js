import { Main } from "./Main";

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    entryPoint();
  }, 2000);
});

function entryPoint() {
  window.game = new Main();
  game.onload(() => {
    game.run();
    setTimeout(() => {
      game.start();
    }, 2000);
  });
}