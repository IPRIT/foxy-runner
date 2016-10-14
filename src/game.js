document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  window.game = new Main();
  game.onload(() => {
    game.start();
  });
}