import * as game from "../game";

import "./index.css";
import Dispatcher from "events-dispatch";

import Player from "./player";
import Track from "./track";
import Traffic from "./traffic";

class AsiaGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this.intersector = new game.Intersector();

    this._distance = config.distance || 4000;
    this._lives = 3;

    /** Таблица результатов */
    this.table = game.GameTable({
      "points": {
        name: "Метры",
        value: this._distance
      },
      "lives": {
        name: "Жизни",
        value: this._lives
      }
    });

    /** Игровое поле */
    this.field = game.GameField(element, this.table.element);

    /** Герой */
    this.hero = new Player(this);
    this.field.appendChild(this.hero.element);
    this.hero.on('boundary', (boundary) => this._onHeroBoundary(boundary));

  
    Track.finish = this._distance;
    this.track = new Track(this);
    this.field.appendChild(this.track.element);
    this.track.init();
    this.track.on('check-mark', data => {
      this.points = data.distance;
    });

    let finish = this.track.finish;
    this.intersector.watch(finish, this.hero.element);
    finish.on('intersector.events.collision', data => {
      this.win();
    });

    this._setHeroStartPosition();

    this.traffic = new Traffic(this, {

    });
    this.traffic.on('accident', () => this.loseLife());

    this.start();
  }

  get points() {
    return this._points;
  }

  set points(value) {
    this._points = parseInt(value) || 0;
    this.table.update({
      "points": this._points
    })
  }

  get lives() {
    return this._lives;
  }

  set lives(value) {
    this._lives = parseInt(value) || 0;
    this._lives = Math.max(this._lives, 0);
    this.table.update({
      "lives": this._lives
    });

    if (this._lives === 0) this.lose();
  }

  win() {
    this.trigger("win");
  }

  lose() {
    this.hero.pause = true;
    
    this.track.reset();
    this.traffic.stop();
    this._setHeroStartPosition();
    
    this.points = this._distance;
    this.lives = 3;

    this.field.onLose(() => this.start());
  }

  loseLife() {
    this.lives = this.lives - 1;
  }

  start() {
    this.hero.pause = false;

    this.track.start();
    this.traffic.start();
  }

  _setHeroStartPosition() {
    this.hero.left = this.field.offsetWidth / 2 - this.hero.element.offsetWidth / 2;
    this.hero.top = this.field.offsetHeight + this.track.startOffset - this.hero.element.offsetHeight / 2;
  }

  _onHeroBoundary(boundary) {
    if (boundary !== "up" && boundary !== "down") return;

    this.track.move(boundary, this.hero);
  }
}

export default AsiaGame;
