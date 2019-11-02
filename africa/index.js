import * as game from "../game";

import Player from "./player";
import Map from "./map";
import Tribe from "./tribe";

import "./index.css";
import Dispatcher from "events-dispatch";

class AfricaGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this._points = 0;

    this.intersector = new game.Intersector();

    /** Таблица результатов */
    this.table = game.GameTable({
      "points": {
        name: "Алмазы",
        value: 0
      }
    });

    /** Игровое поле */
    this.field = game.GameField(element, this.table.element);

    /** Герой */
    this.hero = new Player(this);
    this.field.appendChild(this.hero.element);
    this.hero.on('boundary', (boundary) => this._onHeroBoundary(boundary));

    /** Карта платформ */
    this.map = new Map(this);
    this.map.init();
    this.field.appendChild(this.map.element);

    /** Вражеское племя */
    this.tribe = new Tribe(this);
    this.field.appendChild(this.tribe.element);

    /** Пересечение финиша */
    let finish = this.map.finish;
    let finishWatcher = this.intersector.watch(finish, this.hero.element);
     finish.on('intersector.events.collision', data => {
      this.win();
      this.intersector.stopWatcher(finishWatcher);
    });

    /** Столкновение с племенем */
    this.intersector.watch(this.tribe.element, this.hero.element);
    this.tribe.element.on('intersector.events.collision', data => {
      this.lose();
    });

    /** Движение племени при движении карты */
    this.map.on('move', ({direction, speed}) => {
      this.tribe.move(direction, speed);
    });

    this._setHeroStartPosition();
    this._setTribeStartPosition();

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

  win() {
    this.trigger("win");
  }

  lose() {
    this._setHeroStartPosition();
    this._setTribeStartPosition();
    this.points = this.defaultPoints;
    this.tribe.reset();
    this.map.reset();
    this.hero.pause = true;
    this.tribe.pause = true;

    this.field.onLose(() => this.start());
  }


  start() {
    this.hero.pause = false;
    this.tribe.pause = false;
    this.map.start();
  }

  _setHeroStartPosition() {
    let position = this.map.heroStartPosition;

    this.hero.left = position.left;
    this.hero.top = position.top;
  }

  _setTribeStartPosition() {
    let position = this.map.tribeStartPosition;

    this.tribe.left = position.left;
    this.tribe.top = position.top;
  }

  _onHeroBoundary(boundary) {
    if (this.hero.mapBoundary) return;
    this.map.move(boundary, this.hero);
  }

  canMove(mover, direction) {
    let moverStartPosition = mover.element.getBoundingClientRect();
    let moverNextPosition = {
      top: moverStartPosition.top,
      bottom: moverStartPosition.bottom,
      left: moverStartPosition.left,
      right: moverStartPosition.right,
    };

    switch(direction) {
      case "up":
        moverNextPosition.top -= mover.speed.up;
        moverNextPosition.bottom -= mover.speed.up;
        break;
      case "down":
        moverNextPosition.top += mover.speed.down;
        moverNextPosition.bottom += mover.speed.down;
        break;
      case "left":
        moverNextPosition.left -= mover.speed.left;
        moverNextPosition.right -= mover.speed.left;
        break;
      case "right":
        moverNextPosition.left += mover.speed.right;
        moverNextPosition.right += mover.speed.right;
        break;
    }

    let mapPosition = this.map.element.getBoundingClientRect();

    let mapCoordinates = {
      left: moverNextPosition.left - mapPosition.left,
      right: moverNextPosition.right - mapPosition.left,
      top: moverNextPosition.top - mapPosition.top,
      bottom: moverNextPosition.bottom - mapPosition.top,
    };

    let hasObject = this.map.hasObject(mapCoordinates);

    return !hasObject;
  }
}

export default AfricaGame;
