import "./electronica-game-penguin.css";

import ElectronicaGameFaller from "./electronica-game-faller";

class ElectronicaGamePenguin extends ElectronicaGameFaller {
  constructor(game) {
    super(game, {
      className: 'penguin',
      speed: 15,
      bottomOffset: -40
    });
  }
}

export default ElectronicaGamePenguin;