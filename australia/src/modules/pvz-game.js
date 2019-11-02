import Game from "furrygame";
import PvZGameLine from "./pvz-game-line/pvz-game-line";
import PvZGamePlantsBoard from "./pvz-game-plant/pvz-game-plants-board";
import PvZGameSetController from "./pvz-game-set-controller";
import PvZGameAttackController from "./pvz-game-attack-controller";
import "./pvz-game.css";


class PvZGame extends Game {
  constructor(config = {}) {
    super(config);

    this.startMoney = config.money;
    this._money = 0;

    this.lines = [];
    for (let i = 0; i < 3; i++) {
      let line = new PvZGameLine(this, {
        index: i
      });
      this.field.addElement(line.element);
      this.lines.push(line);
    }

    this.plantsBoard = new PvZGamePlantsBoard(this);
    this.field.addElement(this.plantsBoard.element);

    this.setController = new PvZGameSetController(this);
    this.attackController = new PvZGameAttackController(this);

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

    this.upgradeTable();
  }

  get money() {
    return this._money || 0;
  }

  set money(value) {
    this._money = value;
    this.trigger('game.events.change');
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

  upgradeTable() {
    let money = document.createElement('div');
    money.classList.add('r-table__money');
    money.textContent = 'Money: ';

    let moneyValue = document.createElement('span');
    moneyValue.classList.add('r-table__value');
    moneyValue.textContent = this.money;
    money.appendChild(moneyValue);

    this.table.html.appendChild(money);

    this.table.update = (function(base, _this) {
      return function() {
        console.log(_this.money);
        base.call(_this.table);
        moneyValue.textContent = _this.money;
      }
      
    })(this.table.update, this);
  }

  _onStart() {
    this.money = this.startMoney;
    this.setController.start();
    this.attackController.start();
  }

  _onReset() {
    this.monitored = false;
    this.setController.reset();
    this.attackController.reset();
  }

  _onLose() {
    
  }
}

export default PvZGame;
