import * as player from "../../game/player";

class Player extends player.Mover {
  constructor(game) {
    let element = document.createElement('div');
    element.id = "hero";

    super(element, {
      speed: { up: 9, down: 9, left: 12, right: 12 },

      field: game.field,

      diff: { left: 0, right: 0, top: 120, bottom: 150 }
    });

    this.jumpTimer;
    this.jumpHeight = 140;

    this.game = game;
    new player.KeyboardMover(this, 10);
  }
}

export default Player;