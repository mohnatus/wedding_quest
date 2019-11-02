import Mover from "furrygame/game-player/mover";


class ElectronicaGameFaller extends Mover {
  constructor(game, config) {
    let element = document.createElement('div');
    element.classList.add(config.className);

    super(element, {
      speed: { up: 0, down: config.speed, left: 0, right: 0 },

      field: game.field.element,

      diff: { bottom: config.bottomOffset }
    });

    this.left = Math.random() * (game.field.element.offsetWidth - this.element.offsetWidth - 10) + 10;

    this.timer = setInterval(() => this.toDown(), 100);

    this.on('boundary', () => this.remove())
  }

  canMove(direction) {
    if (direction !== "down") return false;
    return super.canMove(direction);
  }

  remove() {
    clearInterval(this.timer);
    this.element.remove();
    this.trigger('remove');
  }
}

export default ElectronicaGameFaller;