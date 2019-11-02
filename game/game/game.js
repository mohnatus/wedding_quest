import "../css/base.css";

import Dispatcher from "events-dispatch";

import ResultsTable from "../results-table/table";
import GameField from "../game-field/field";

import Intersector from "../intersector";

/**
 * @typedef {Object} GameConfig
 * @description Объект конфигурации игры
 * @property {Number} [lifes] Количество жизней
 * @property {Number} [pointsMultiplicator] Множитель заработанных очков
 * @property {Number} [pointsTarget] Целевое количество очков
 * @property {Number} [defaultPoints] Начальное количество очков
 */

/**
 * Game
 * @class
 * @description Базовый класс игры
 * @property {ResultsTable} Таблица результатов
 * @property {GameField} Игровое поле
 * 
 * @property {Intersector} intersector
 * 
 * @property {Number} pointsTarget Целевое количество очков
 * @property {Number} defaultPoints Начальное количество очков
 * 
 * @property {HTMLElement} root Корневой элемент игры
 * 
 * @property {Boolean} pause Игра на паузе
 */
class Game {
  /**
   * @constructor
   * @param {GameConfig} config 
   */
  constructor(config = {}) {
    new Dispatcher(this);
    this.intersector = new Intersector();

    this.root = document.querySelector(config.root || Game.selectors.root);
    
    this.table = new ResultsTable(this, config.pointsMultiplicator);
    this.root.appendChild(this.table.html);

    this.field = new GameField(this);
    this.root.appendChild(this.field.element);
   
    this.lifesCount = config.lifes || 3;

    this.pointsTarget = config.pointsTarget / (config.pointsMultiplicator || 1);
    this.defaultPoints = config.defaultPoints || 0;

    this.pause = true;
  }

  get points() {
    return this._points || 0;
  }

  set points(value) {
    this._points = value;
    this.trigger(Game.events.change);
    if (this._points >= this.pointsTarget) this.win();
  }

  get lifes() {
    return this._lifes || 0;
  }

  set lifes(value) {
    let isLose = this.lifesCount > value;
    this._lifes = value;
    this.trigger(Game.events.change);
    if (isLose) this.trigger(Game.events.loseLife);
    if (this.lifes === 0) this.lose();
  }

  /**
   * Начало игры
   */
  start() {
    this.pause = false;
    this.points = this.defaultPoints;
    this.lifes = this.lifesCount;
    
    this._onStart();
    this.trigger(Game.events.start);
  }

  /**
   * Дополнительные действия перед стартом 
   */
  _onStart() {

  }

  /**
   * Сброс игры без завершения
   */
  reset() {
    this.pause = true;

    this._onReset();
    this.trigger(Game.events.reset);
  }

  /**
   * Дополнительные действия при сбросе игры
   */
  _onReset() {

  }

  /**
   * Победа в игре
   */
  win() {
    this.reset();
    
    this._onWin();

    this.trigger(Game.events.win);
  }

  /**
   * Дополнительные действия при победе
   */
  _onWin() {

  }

  /**
   * Потеря жизни
   * @param {*} data 
   */
  loseLife(data) {
    this._onLoseLife(data);

    this.lifes--;
  }

  /**
   * Дополнительные действия при потере жизни
   * @param {*} data 
   */
  _onLoseLife(data) {

  }

  /**
   * Поражение в игре
   */
  lose() {
    this.reset();
    this._onLose();
    this.trigger(Game.events.lose);
  }

  /**
   * Дополнительные действия при поражении в игре
   */
  _onLose() {

  }

  replay() {
    this.reset();
    this.start();
  }

  destroy() {
    
  }
}

Game.selectors = {
  root: ".game", // корневой элемент игры
}

Game.events = {
  start: "game.events.start",
  change: "game.events.change",
  win: "game.events.win",
  lose: "game.events.lose",
  loseLife: "game.events.loseLife",
  reset: "game.events.reset",
};

export default Game;