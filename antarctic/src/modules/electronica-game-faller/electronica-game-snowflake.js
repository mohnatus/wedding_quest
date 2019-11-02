import "./electronica-game-snowflake.css";

import ElectronicaGameFaller from "./electronica-game-faller";

class ElectronicaGameSnowflake extends ElectronicaGameFaller {
  constructor(game) {
    super(game, {
      className: 'snowflake',
      speed: 10,
      bottomOffset: -40
    });
  }
}

export default ElectronicaGameSnowflake;