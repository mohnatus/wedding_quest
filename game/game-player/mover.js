import Dispatcher from "events-dispatch";

class Mover {
  constructor(element, config) {
    new Dispatcher(this);

    this.element = element;

    this._speed = { left: 0, right: 0, up: 0, down: 0 };
    Object.assign(this._speed, config.speed);

    this.field = config.field;

    this.diff = { top: 0, bottom: 0, left: 0, right: 0 };
    Object.assign(this.diff, config.diff);

    this.pause = true;
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

  get speed() {
    return this._speed;
  }

  set speed(speed) {
    if (speed.left) this._speed.left = speed.left;
    if (speed.right) this._speed.right = speed.right;
    if (speed.up) this._speed.up = speed.up;
    if (speed.down) this._speed.down = speed.down;
  }

  canMove(direction) {
    if (this.field) {
      let moverRect = this.element.getBoundingClientRect();
      let fieldRect = this.field.getBoundingClientRect();

      switch(direction) {
        case "left":
          if (moverRect.left - this.speed.left < fieldRect.left + this.diff.left) return false;
          break;
        case "right":
          if (moverRect.right + this.speed.right > fieldRect.right - this.diff.right) return false;
          break;
        case "up":
          if (moverRect.top - this.speed.up < fieldRect.top + this.diff.top) return false;
          break;
        case "down":
          if (moverRect.bottom + this.speed.down > fieldRect.bottom - this.diff.bottom) return false;
      } 
    }

    return true;
  }

  toLeft() {
    if (this.pause) return;
    if (this.canMove("left")) {
      this.left = this.left - this.speed.left;
    } else {
      this.trigger("boundary", "left");
    }
  }

  toRight() {
    if (this.pause) return;
    if (this.canMove("right")) {
      this.left = this.left + this.speed.right;
    } else {
      this.trigger("boundary", "right");
    }
  }

  toUp() {
    if (this.pause) return;
    if (this.canMove("up")) {
      this.top = this.top - this.speed.up;
    } else {
      this.trigger("boundary", "up");
    }
  }

  toDown() {
    if (this.pause) return;
    if (this.canMove("down")) {
      this.top = this.top + this.speed.down;
    } else {
      this.trigger("boundary", "down");
    }
  }
}

export default Mover;