import "./race-game-hero.css";

import Mover from "furrygame/game-player/mover";
import KeyboardMover from "furrygame/game-player/keyboard-mover";

class RaceGameHero extends Mover {
  constructor(game) {
    let element = document.createElement('div');
    element.id = "hero";

    super(element, {
      speed: { up: 9, down: 9, left: 12, right: 12 },

      field: game.field.element,

      diff: { left: 0, right: 0, top: 120, bottom: 150 }
    });
    new KeyboardMover(this);
  }

  canMove(direction) {
    return super.canMove(direction);
  }
}

export default RaceGameHero;