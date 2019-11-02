import "./table.css";

/**
 * Results table
 * @class
 * @description Таблица результатов игры
 * 
 * @property {Game} game
 * 
 * @property {HTMLDivElement} html контейнер таблицы для вставки на игровое поле
 * @property {Object} _elements dom-элементы таблицы
 * @property {HTMLDivElement} _elements.element
 * @property {HTMLDivElement} _elements.points
 * @property {HTMLSpanElement} _elements.pointsValue
 * @property {HTMLDivElement} _elements.lifes
 * @property {HTMLSpanElement} _elements.lifesValue
 * 
 * @property {Number} multiplicator значение, на которое умножаются полученные очки
 */
class ResultsTable {
  constructor(game, pointsMultiplicator = 1) {
    this._elements = this.createHTML();

    this.game = game;
    this.game.on('game.events.change', () => this.update());

    this.multiplicator = pointsMultiplicator;

    this.update();
  }

  /**
   * Возвращает dom-элемент таблицы для вставки на игровое поле
   * @returns {HTMLDivElement}
   */
  get html() {
    return this._elements.element;
  }

  /**
   * Получает свежие данные по игре
   */
  setData() {
    this.points = (this.game.points || 0) * this.multiplicator;
    this.lifes = this.game.lifes || 0;
  }

  /**
   * Обновляет данные на странице
   */
  update() {
    this.setData();

    this._elements.pointsValue.textContent = this.points;
    this._elements.lifesValue.textContent = this.lifes;
  }

  /**
   * Создает dom-элемент таблицы
   * @returns {HTMLDivElement}
   */
  createHTML() {
    let element = document.createElement('div');
    element.classList.add(ResultsTable.selectors.container);

    let points = document.createElement('div');
    points.classList.add(ResultsTable.selectors.points);
    points.textContent = "Points: ";

    let pointsValue = document.createElement('span');
    pointsValue.classList.add(ResultsTable.selectors.value);
    points.appendChild(pointsValue);

    let lifes = document.createElement('div');
    lifes.classList.add(ResultsTable.selectors.lifes);
    lifes.textContent = "Lifes: ";

    let lifesValue = document.createElement('span');
    lifesValue.classList.add(ResultsTable.selectors.value);
    lifes.appendChild(lifesValue);

    element.appendChild(points);
    element.appendChild(lifes);

    return {
      element,
      points,
      pointsValue,
      lifes,
      lifesValue
    };
  }
}

ResultsTable.selectors = {
  container: "r-table",
  points: "r-table__points",
  lifes: "r-table__lifes",
  value: "r-table__value",
}

export default ResultsTable;