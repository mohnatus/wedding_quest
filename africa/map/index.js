import { map, legend } from './map';
import Dispatcher from 'events-dispatch';

import "./index.css";

class Map {
  constructor(game) {
    new Dispatcher(this);

    this.pointSize = 50;
    this.objects = [];

    this.map = [];

    this.game = game;
    this.element = this.render();
  }

  get width() {
    return this.pointSize * map[0].length;
  }

  get height() {
    return this.pointSize * map.length;
  }

  get left() {
    return parseInt(this.element.style.left) || 0;
  }

  set left(value) {
    this.element.style.left = Number(value) + 'px';
  }

  get heroStartPosition() {
    return this._heroStartPosition;
  }

  get tribeStartPosition() {
    return this._tribeStartPosition;
  }

  init() {
    this.initialLeft = this.left;
    this.minLeft = -1 * (this.width);
  }

  render() {
    let el = document.createElement('div');
    el.id = 'map';

    for (let y = 0, rows = map.length; y < rows; y++) {
      this.map.push([]);
      for (let x = 0, cols = map[0].length; x < cols; x++) {
        let point = this.drawPoint(y, x);
        if (point) {
          el.appendChild(point.element);
        }

        this.map[y][x] = point || null;
      }
    }

    el.style.width = map[0].length * this.pointSize + "px";
    el.style.height = map.length * this.pointSize + "px";

    return el;
  }

  drawPoint(row, col) {
    let symbol = map[row][col];
    let object = legend[symbol];

    if (!object) return;

    switch(object) {
      case "ground":
      case "platform":
          let el = document.createElement('div');
          el.style.width = this.pointSize + 'px';
          el.style.height = this.pointSize + 'px';
          el.classList.add(object);
          el.style.position = "absolute";
          el.style.top = this.pointSize * row + 'px';
          el.style.left = this.pointSize * col + 'px';

          return {
            object: object, 
            element: el
          };
      case "hero": 
          this._heroStartPosition = { top: this.pointSize * row,  left: this.pointSize * col };
          break;
      case "coin":
          let coin = document.createElement('div');
          coin.style.width = this.pointSize + 'px';
          coin.style.height = this.pointSize + 'px';
          coin.classList.add(object);
          coin.style.position = "absolute";
          coin.style.top = this.pointSize * row + 'px';
          coin.style.left = this.pointSize * col + 'px';
          this.game.intersector.watch(coin, this.game.hero.element);
          coin.on('intersector.events.collision', data => {
            this.game.points = this.game.points + 1;
            coin.remove();
          })
          return {
            object: object, 
            element: coin
          };
      case "tribe":
          this._tribeStartPosition = { top: this.pointSize * row,  left: this.pointSize * col };
          break;
      
      case "exit":
          let finish = document.createElement('div');
          finish.style.width = this.pointSize + 'px';
          finish.style.height = this.pointSize + 'px';
          finish.classList.add("finish");
          finish.style.position = "absolute";
          
          finish.style.top = this.pointSize * row + 'px';
          finish.style.left = this.pointSize * col + 'px';

          this.finish = finish;

          return {
            object: "exit", 
            element: finish
          };
    }
  }

  start() {
    this.pause = false;
  }

  move(direction, hero) {
    
    if (this.pause) return;

    let newPosition, speed;
    if (direction === "left") {
      speed = hero.speed.left / 2;
    } else if (direction === "right") {
      speed = -1 * hero.speed.right / 2;
    }

    newPosition = this.left + speed;
    
    if (newPosition > this.initialLeft) return;
    if (newPosition < this.minLeft) return;

    this.left = newPosition;
    this.trigger('move', { direction, speed });
  }

  reset() {
    this.left = this.initialLeft;
    this.map.forEach(row => {
      row.forEach(point => {
        if (point && point.object == 'coin') {
          this.element.appendChild(point.element);
        }
      })
    })
  }

  hasObject(coords) {
    for (let y = 0, rows = this.map.length; y < rows; y++) {
      for (let x = 0, cols = this.map[0].length; x < cols; x++) {

        let point = this.map[y][x];
        if (!point) continue;

        if (point.object !== 'platform' && point.object !== 'ground') continue;

        let pointCoords = {
          left: this.pointSize * x,
          right: this.pointSize * x + this.pointSize,
          top: this.pointSize * y,
          bottom: this.pointSize * y + this.pointSize
        };

        let isMoreLeft = coords.right <= pointCoords.left;
        let isMoreRight = coords.left >= pointCoords.right;
        let isMoreUp = coords.bottom <= pointCoords.top;
        let isMoreDown = coords.top >= pointCoords.bottom;

        if (isMoreLeft || isMoreRight || isMoreUp || isMoreDown) continue;
        return true;
      }
    }

    return false;
  }
} 

export default Map;