document.addEventListener('DOMContentLoaded', () => {
  entryPoint();
});

function entryPoint() {
  var game = new Main();
  game.onload(() => {
    game.start();
  });
}