import "./field.css";
/**
 * @class GameField
 * @description Игровое поле
 * 
 * @property {Game} game Объект игры
 * 
 * @property {Object} elements
 * @property {HTMLElement} elements.element Корневой элемент
 * @property {HTMLElement} elements.start Кнопка Начать игру
 * @property {HTMLElement} elements.replay Кнопка Переиграть
 * @property {HTMLElement} elements.win Экран Победа
 * @property {HTMLElement} elements.lose Экран Поражение
 * @property {HTMLElement} elements.loseDisplay Экран Потеря жизни
 */
class GameField {
  /**
   * @constructor
   * @param {Game} game 
   */
  constructor(game) {
    this.game = game;
    this.elements = this._createHTML();

    this.game.on('game.events.start', () => this._onStart());
    this.game.on('game.events.loseLife', () => this._onLoseLife());
    this.game.on('game.events.lose', () => this._onLose());
    this.game.on('game.events.win', () => this._onWin());
    this.game.on('game.events.reset', () => this._onReset());
  }

  get element() {
    return this.elements.element;
  }

  /**
   * Генерирует html-код игрового поля
   */
  _createHTML() {
    let element = document.createElement('div');
    element.id = GameField.selectors.rootId;

    let start = document.createElement('div');
    start.id = GameField.selectors.startId;
    start.textContent = "Начать игру";
    element.appendChild(start);
    start.addEventListener('click', () => this.game.start());

    let replay = document.createElement('div');
    replay.id = GameField.selectors.replayId;
    replay.innerHTML = '<svg fill="currentColor" width="96" height="96" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>';
    replay.style.display = "none";
    element.appendChild(replay);
    replay.addEventListener('click', () => this.game.replay());

    let win = document.createElement('div');
    win.id = GameField.selectors.winId;
    win.textContent = "Победа!";
    win.style.display = "none";
    element.appendChild(win);

    let lose = document.createElement('div');
    lose.id = GameField.selectors.loseId;
    lose.textContent = "Поражение!";
    lose.style.display = "none";
    element.appendChild(lose);

    let loseDisplay = document.createElement('div');
    loseDisplay.id = GameField.selectors.loseDisplayId;
    loseDisplay.style.display = "none";
    element.appendChild(loseDisplay);

    return {
      element,
      start,
      replay,
      win,
      lose,
      loseDisplay
    };
  }

  /**
   * Старт игры
   */
  _onStart() {
    this._hideElements('start')
  }

  /**
   * Потеря жизни
   */
  _onLoseLife() {
    this._showElements('loseDisplay');
    setTimeout(() => this._hideElements('loseDisplay'), 200);
  }

  /**
   * Поражение в игре
   */
  _onLose() {
    this._showElements('lose', 'replay');
  }

  /**
   * Победа в игре
   */
  _onWin() {
    this._showElements('win');
  }

  /**
   * Сброс игры к началу 
   */
  _onReset() {
    this._hideElements('lose', 'replay', 'win')
  }

  /**
   * Отображает элементы игрового поля
   * @param  {...string} elements 
   */
  _showElements(...elements) {
    elements.forEach(element => {
      let el = this.elements[element];
      if (el) el.style.display = "";
    })
  }

  /**
   * Скрывает элементы игрового поля
   * @param  {...string} elements 
   */
  _hideElements(...elements) {
    elements.forEach(element => {
      let el = this.elements[element];
      if (el) el.style.display = "none";
    })
  }

  addElement(element) {
    this.element.appendChild(element);
  }
}

GameField.selectors = {
  rootId: "field",

  startId: "start",
  replayId: "replay",
  winId: "win",
  loseId: "lose",
  loseDisplayId: "loseDisplay",
};

export default GameField;