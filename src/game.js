document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
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