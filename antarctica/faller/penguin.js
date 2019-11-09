import "./penguin.css";

import Faller from "./faller";

class Penguin extends Faller {
  constructor(game) {
    super(game, {
      className: 'penguin',
      speed: 15,
      bottomOffset: -40
    });
  }
}

export default Penguin;