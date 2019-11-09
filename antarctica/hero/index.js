
import * as player from "../../game/player";

class Hero extends player.Mover {
  constructor(game) {
    let element = document.createElement('div');
    element.id = "player";

    super(element, {
      speed: { up: 0, down: 0, left: 5, right: 5 },

      field: game.field.element,

      diff: { left: 10, right: 10 }
    });
    new player.KeyboardMover(this);
  }

  canMove(direction) {
    if (direction === "up" || direction === "down") return false;
    return super.canMove(direction);
  }
}

export default Hero;