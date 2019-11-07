import "./index.css";
import Dispatcher from "events-dispatch";

class Track {
  constructor(game) {
    new Dispatcher(this);

    this.game = game;
    this.element = this.render();
    this.pause = true;
  }

  get finish() {
    return this.element.querySelector('.finish');
  }

  get startOffset() {
    return -1 * Track.step;
  }

  get bottom() {
    return parseInt(this.element.style.bottom) || 0;
  }

  set bottom(value) {
    this.element.style.bottom = Number(value) + 'px';
  }

  init() {
    this.initialBottom = this.bottom;
    this.minBottom = -1 * (this.element.offsetHeight - this.game.field.offsetHeight);
  }

  start() {
    this._setPosition();

    this.pause = false;
  }

  _setPosition() {
    this.bottom = this.initialBottom;
  }


  reset() {
    this._setPosition();

    this.pause = true;
  }

  render() {
    let track = document.createElement('div');
    track.id = 'track';

    track.style.height = Track.finish + Track.step * 2 + 'px';

    let finish = document.createElement('div');
    finish.className = 'finish';
    finish.style.top = Track.step + 'px';
    track.appendChild(finish);

    let counter = 1;
    let signValue = Track.step * counter;

    while (signValue <= Track.finish) {
      let signPosition = signValue + Track.step + 'px';
      let signElement = document.createElement('div');
      signElement.className = `sign`;
      signElement.textContent = signValue / 1000 + 'km';
      signElement.style.top = signPosition;
      signElement.value = signValue;
      track.appendChild(signElement);

      this.game.intersector.watch(signElement, this.game.hero.element);

      signElement.on('intersector.events.collision', () => {
        this._onCheckMark(signElement.value);
      });

      counter++;
      signValue = Track.step * counter;
    }

    return track;
  }

  _onCheckMark(markValue) {
    if (this.pause) return;

    this.trigger('check-mark', { distance: markValue });
  }

  move(direction, hero) {
    if (this.pause) return;

    let newPosition;
    if (direction === "up") {
      newPosition = this.bottom - hero.speed.up / 2;
    } else if (direction === "down") {
      newPosition = this.bottom + hero.speed.up / 2;
    }
    
    if (newPosition > this.initialBottom) return;
    if (newPosition < this.minBottom) return;

    this.bottom = newPosition;
  }

  addCar(car) {
    this.element.appendChild(car.element);
  }
}

Track.finish = 2000;
Track.step = 250;

export default Track;