import "./index.css";

import * as player from "../../game/player";

class Tribe extends player.Mover {
  constructor(game) {
    
    let el = document.createElement('div');
    el.id = 'tribe';

    super(el, {
      speed: { up: 0, down: 0, left: 1, right: 1 },

      field: game.field,

      diff: { 
        left: 0, 
        right: 0, 
        top: 0, 
        bottom: 0 
      }
    });

    this.name = "tribe"

    this.game = game;
    this._pause = true;
    this._direction = 'right';

    this.on('boundary', (boundary) => {
      if (boundary === 'right') this.direction = 'left';
      else this.direction = 'right';
    })
  }

  reset() {
    this._direction = 'right';
  }

  get direction() {
    return this._direction;
  }

  set direction(value) {
    this._direction = value;
    if (this._direction === 'left') this.element.classList.add('revert');
    else this.element.classList.remove('revert');
  }

  get left() {
    return parseInt(this.element.style.left) || 0;
  }

  set left(value) {
    this.element.style.left = Number(value) + 'px';
  }

  get top() {
    return parseInt(this.element.style.top) || 0;
  }

  set top(value) {
    this.element.style.top = Number(value) + 'px';
  }

  get pause() {
    return this._pause;
  }

  set pause(value) {
    this._pause = Boolean(value);
    clearInterval(this._moveTimer);
    if (!this._pause) {
      this._moveTimer = setInterval(() => {
        if (this.direction == 'right') {
          this.toRight();
        } else {
          this.toLeft();
        }
      }, 10)
    }
  }

  reset() {
    this.pause = true;
    this.direction = 'right';
  }

  move(direction, speed) {
    this.left = this.left + speed;
  }
}

export default Tribe;