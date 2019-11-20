import Line from "./line";
import Board from "./plant/board";
import SetController from "./set-controller";
import AttackController from "./attack-controller";
import "./index.css";
import Dispatcher from "events-dispatch";
import * as game from "../game";


class AustraliaGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this._startMoney = config.money || 90;
    this._money = 0;

    /** Таблица результатов */
    this.table = game.GameTable({
      "money": {
        name: "Деньги",
        value: 0
      }
    });

    /** Игровое поле */
    this.field = game.GameField(element, this.table.element);

    this.lines = [];
    for (let i = 0; i < 3; i++) {
      let line = new Line(this, {
        index: i
      });
      this.field.appendChild(line.element);
      this.lines.push(line);
    }

    this.plantsBoard = new Board(this);
    this.field.appendChild(this.plantsBoard.element);

    this.setController = new SetController(this);
    this.attackController = new AttackController(this);

    this.on('finishAttacks', () => {
      if (!this._hasEnemies()) {
        this.win();
        return;
      }
      this.monitored = true;
    });
    this.on('killEnemy', () => {
      if (this.monitored) {
        if (!this._hasEnemies()) {
          this.win();
        }
      }
    });

    this.start();
  }

  get money() {
    return this._money || 0;
  }

  set money(value) {
    this._money = value;
    this.table.update({
      "money": this._money
    })
  }
  
  get attacked() {
    return this._attacked;
  }

  set attacked(value) {
    this._attacked = Boolean(value);
    this.lines.forEach(line => {
      line.attacked = this._attacked;
    });
  }

  _hasEnemies() {
    return this.lines.some(line => line.enemies.length > 0);
  }

  start() {
    this.money = this._startMoney;
    this.setController.start();
    this.attackController.start();
  }

  win() {
    this.trigger("win", this.money * 3 / 2 + 100);
  }

  lose() {
    this.monitored = false;
    this.setController.reset();
    this.attackController.reset();
    this.table.update({
      "money": this._startMoney
    })
    this.field.onLose(() => this.start());
  }
}

export default AustraliaGame;
