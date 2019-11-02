import Game from "furrygame";
import ElectronicaGameHero from "./electronica-game-hero/electronica-game-hero";
import ElectronicaGameSnowflake from "./electronica-game-faller/electronica-game-snowflake";
import ElectronicaGamePenguin from "./electronica-game-faller/electronica-game-penguin";
import ElectronicaGameFlow from "./electronica-game-faller/electronica-game-flow";

import "./electronica-game.css";

class ElectronicaGame extends Game {
  constructor(config) {
    super(config);

    let ground = document.createElement('div');
    ground.classList.add('ground');
    this.field.addElement(ground);

    this.hero = new ElectronicaGameHero(this);
    this.field.addElement(this.hero.element);

    this.hero.left = this.field.element.offsetWidth / 2 - this.hero.element.offsetWidth / 2;

    this.snowfall = new ElectronicaGameFlow(this, {
      element: ElectronicaGameSnowflake,
      minTimeout: 800,
      maxTimeout: 3100,
    });
    this.snowfall.on('collision', () => {
      this.points = this.points + 1;
    })

    this.penguins = new ElectronicaGameFlow(this, {
      element: ElectronicaGamePenguin,
      minTimeout: 720,
      maxTimeout: 2700
    });
    this.penguins.on('collision', () => {
      this.lifes = this.lifes - 1;
    })
  }

  _onStart() {
    this.hero.pause = false;
    
    this.snowfall.start();
    this.penguins.start();
  }

  _onReset() {
    this.hero.pause = true;
    this.hero.left = this.field.element.offsetWidth / 2 - this.hero.element.offsetWidth / 2;
    
    this.snowfall.stop();
    this.penguins.stop();
  }
}

export default ElectronicaGame;
