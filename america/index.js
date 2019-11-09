import * as game from "../game";

import "./index.css";
import Dispatcher from "events-dispatch";

class AmericaGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this._points = 0;

    this.intersector = new game.Intersector();

    /** Таблица результатов */
    this.table = game.GameTable({
      "time": {
        name: "Время",
        value: 0
      },
      "lives": {
        name: "Жизни",
        value: 3
      }
    });

    /** Игровое поле */
    this.field = game.GameField(element, this.table.element);

    this.width = 50;
    this.height = 20;
    this.step = 20;
    this.currentPosition = [0, 0];
    this.walls = [];

    this.$maze = this._createMaze();
    this.maze = this._fillMaze();
    this.amaze(this.currentPosition[0], this.currentPosition[1], true);

    while (this.walls.length != 0) {
      var randomWall = this.walls[Math.floor(Math.random() * this.walls.length)],
        host = randomWall[2],
        opposite = [(host[0] + (randomWall[0] - host[0]) * 2), (host[1] + (randomWall[1] - host[1]) * 2)];

      if (this.valid(opposite[0], opposite[1])) {
        if (this.maze[opposite[0]][opposite[1]] == 'maze') {
          this.walls.splice(this.walls.indexOf(randomWall), 1);
        } else {
          this.amaze(randomWall[0], randomWall[1], false), this.amaze(opposite[0], opposite[1], true);
        }
      } else {
        this.walls.splice(this.walls.indexOf(randomWall), 1);
      }
    }

    document.getElementById('0-0').className = 'block me';
    document.getElementById((this.height - 2) + '-' + (this.width - 2)).className = 'block finish';
    document.body.onkeydown = (e) => {
      this._onKeydown(e)
    }
  }

  _createMaze() {
    let el = document.createElement("div");
    el.style.width = this.width * this.step + 'px';
    el.style.height = this.height * this.step + 'px';
    
    this.field.appendChild(el);
    return el;
  }

  _onKeydown(e) {
    var newPosition = [this.currentPosition[0] + ((e.keyCode - 39) % 2), this.currentPosition[1] + ((e.keyCode - 38) % 2)];
    if (this.valid(newPosition[0], newPosition[1]) && this.maze[newPosition[0]][newPosition[1]] != 'wall') {
      document.getElementById(this.currentPosition[0] + '-' + this.currentPosition[1]).className = 'block';
      this.currentPosition = newPosition;
      document.getElementById(this.currentPosition[0] + '-' + this.currentPosition[1]).className = 'block me';
      if (this.currentPosition[0] == this.height - 2 && this.currentPosition[1] == this.width - 2)  {
        this.win();
      }
    }
  }

  valid(a, b) {
    return (a < this.height && a >= 0 && b < this.width && b >= 0) ? true : false;
  }

  amaze(y, x, addBlockWalls) {
    this.maze[y][x] = 'maze';
    document.getElementById(y + '-' + x).className = 'block';
    if (addBlockWalls && this.valid(y + 1, x) && (this.maze[y + 1][x] == 'wall')) this.walls.push([y + 1, x, [y, x]]);
    if (addBlockWalls && this.valid(y - 1, x) && (this.maze[y - 1][x] == 'wall')) this.walls.push([y - 1, x, [y, x]]);
    if (addBlockWalls && this.valid(y, x + 1) && (this.maze[y][x + 1] == 'wall')) this.walls.push([y, x + 1, [y, x]]);
    if (addBlockWalls && this.valid(y, x - 1) && (this.maze[y][x - 1] == 'wall')) this.walls.push([y, x - 1, [y, x]]);
  }

  _fillMaze() {
    let maze = [];
    for (var y = 0; y < this.height; y++) {
      maze[y] = [];
      for (var x = 0; x < this.width; maze[y][x++] = 'wall') {
        let el = document.createElement("div");
        this.$maze.appendChild(el);
        el.className = 'block wall';
        el.setAttribute('id', y + '-' + x);
      }
    }

    return maze;
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
    window.onkeydown = null;
    this.trigger("win");
  }
  
}

export default AmericaGame;
