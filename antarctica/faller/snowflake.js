import "./snowflake.css";

import Faller from "./faller";

class Snowflake extends Faller {
  constructor(game) {
    super(game, {
      className: 'snowflake',
      speed: 10,
      bottomOffset: -40
    });
  }
}

export default Snowflake;