function PAUSE() {
  ig.game.paused = true;
  ig.game.pauseGame();
  ig.soundHandler.muteSFX(true);
  ig.soundHandler.muteBGM(true);
}

function RESUME() {
  ig.game.paused = false;
  ig.game.resumeGame();
  ig.soundHandler.unmuteSFX(true);
  ig.soundHandler.unmuteBGM(true);
}