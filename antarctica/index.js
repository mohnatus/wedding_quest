import * as game from "../game";

import Hero from "./hero";
import Snowflake from "./faller/snowflake";
import Penguin from "./faller/penguin";
import Flow from "./faller/flow";

import "./index.css";
import Dispatcher from "events-dispatch";


class AntarcticaGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this.startLives = config.lives || 3;

    this._points = 0;
    this.pointsToWin = 10;
    this._lives = this.startLives;

    this.intersector = new game.Intersector();

    /** Таблица результатов */
    this.table = game.GameTable({
      "points": {
        name: "Снежинки",
        value: 0
      },
      "lives": {
        name: "Жизни",
        value: this._lives
      }
    });

    /** Игровое поле */
    this.field = game.GameField(element, this.table.element);

    let ground = document.createElement('div');
    ground.classList.add('ground');
    this.field.appendChild(ground);

    /** Герой */
    this.hero = new Hero(this);
    this.field.appendChild(this.hero.element);
    this.hero.left = this.field.offsetWidth / 2 - this.hero.element.offsetWidth / 2;

    this.snowfall = new Flow(this, {
      element: Snowflake,
      minTimeout: 800,
      maxTimeout: 3100,
    });
    this.snowfall.on('collision', () => {
      this.points = this.points + 1;
    })

    this.penguins = new Flow(this, {
      element: Penguin,
      minTimeout: 720,
      maxTimeout: 2700
    });
    this.penguins.on('collision', () => {
      this.loseLife();
    })

    this.start();
  }

  get points() {
    return this._points;
  }

  set points(value) {
    this._points = parseInt(value) || 0;
    this.table.update({
      "points": this._points
    });
    if (this._points >= this.pointsToWin) {
      this.win();
    }
  }

  loseLife() {
    this._lives = this._lives - 1;
    this._lives = Math.max(0, this._lives);

    this.table.update({
      "lives": this._lives
    })

    if (this._lives == 0) this.lose();
  }

  win() {
    this.trigger("win", this._lives * 100 + 100);
  }

  lose() {
    this.hero.pause = true;
    this.hero.left = this.field.offsetWidth / 2 - this.hero.offsetWidth / 2;
    
    this.snowfall.stop();
    this.penguins.stop();

    this.field.onLose(() => this.start());

    this.points = 0;
  }


  start() {
    this.hero.pause = false;
    this.snowfall.start();
    this.penguins.start();

    this._lives = this.startLives;
    this.table.update({
      "lives": this._lives
    })
  }

}

export default AntarcticaGame;