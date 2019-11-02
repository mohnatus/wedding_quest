import KeyboardListener from "listen-keyboard";

class KeyboardMover {
  constructor(mover, period) {
    this.mover = mover;
    this.listener = new KeyboardListener(period);

    this.listener.on('LEFT', () => this.mover.toLeft());
    this.listener.on('RIGHT', () => this.mover.toRight());
    this.listener.on('UP', () => this.mover.toUp());
    this.listener.on('DOWN', () => this.mover.toDown());
  }
}

export default KeyboardMover;