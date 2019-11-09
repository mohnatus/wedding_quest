import "./index.css";

import * as player from "../../game/player";

class Player extends player.Mover {
  constructor(game) {
    let element = document.createElement('div');
    element.id = "hero";

    super(element, {
      speed: { up: 4, down: 4, left: 4, right: 4 },

      field: game.field,

      diff: { 
        left: 0, 
        right: game.field.offsetWidth / 2, 
        top: 0, 
        bottom: 0 
      }
    });

    this.jumpTimer;
    this.jumpHeight = 140;

    this.game = game;
    new player.KeyboardMover(this, 10);

    this.checkTimer = setInterval(() => {
      if (this.jumping) return;
      if (this.canMove("down")) {
        this.top = this.top + this.speed.down;
      }
    }, 10);
  }

  canMove(direction) {
    
    if (!this.game.canMove(this, direction)) {
      this.mapBoundary = true;
      return false;
    }
    this.mapBoundary = false;
    return super.canMove(direction);
  }

  toUp() {
    if (this.pause) return;
    if (this.canMove("up")) {
      this.startJump();
    } else {
      this.trigger("boundary", "up");
    }
  }

  startJump() {
    if (this.jumping) return;
    this.jumping = true;
    let jumpStart = this.top;
    this.jumpTimer = setInterval(() => {
      let canMove = this.canMove("up");
      let maxHeight = this.top <= jumpStart - this.jumpHeight;
      if (!canMove || maxHeight) {
        clearInterval(this.jumpTimer);
        this.jumpTimer = setInterval(() => {
          if (!this.canMove("down")) {
            clearInterval(this.jumpTimer);
            this.jumping = false;
          } else {
            this.top = this.top + this.speed.down;
          }
        }, 10);
      } else {
        this.top = this.top - this.speed.up;
      }
    }, 10);
  }
}

export default Player;