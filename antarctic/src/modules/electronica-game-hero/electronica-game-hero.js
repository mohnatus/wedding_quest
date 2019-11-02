import "./electronica-game-hero.css";

import Mover from "furrygame/game-player/mover";
import KeyboardMover from "furrygame/game-player/keyboard-mover";

class ElectronicaGameHero extends Mover {
  constructor(game) {
    let element = document.createElement('div');
    element.id = "hero";

    super(element, {
      speed: { up: 0, down: 0, left: 5, right: 5 },

      field: game.field.element,

      diff: { left: 10, right: 10 }
    });
    new KeyboardMover(this);
  }

  canMove(direction) {
    if (direction === "up" || direction === "down") return false;
    return super.canMove(direction);
  }
}

export default ElectronicaGameHero;