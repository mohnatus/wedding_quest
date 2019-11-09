class SetController {
  constructor(game) {
    this.game = game;
    this.pause = true;

    this.game.on('selectPlant', () => this._onSelectPlant());
    this.game.on('selectSpot', (spot) => this._onSelectSpot(spot));
  }

  get pause() {
    return this._pause;
  }

  set pause(value) {
    this._pause = Boolean(value);
  }

  start() {
    this.game.plantsBoard.activate();
    this.game.lines.forEach(line => line.activate());
    this.pause = false;
  }

  stop() {
    this.game.lines.forEach(line => line.deactivate());
    this.pause = true;
  }

  reset() {
    this.game.lines.forEach(line => line.reset());
    this.pause = true;
  }

  _onSelectPlant() {
    let plant = this.game.plantsBoard.selected;
    console.log('plant', plant)
  }

  _onSelectSpot(spot) {
    let plant = this.game.plantsBoard.selectedPlant;
    if (!plant) return;

    console.log(plant.price);

    if (plant.price <= this.game.money) {
      this.game.money -= plant.price;
      spot.plant = plant;

      if (this.game.attacked) plant.activate(spot.line);
    } else {
      console.warn('Недостаточно денег')
    }

    
  }
}

export default SetController;