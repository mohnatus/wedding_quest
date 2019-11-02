import "./race-game-car.css";
import getRandom from "get-random-integer";


class RaceGameCar {
  constructor() {
    this.element = document.createElement('div');
    this.speed = RaceGameCar.getRandomSpeed();
    this.element.className = `car car-${RaceGameCar.getRandomColor()}`;
  }

  set left(value) {
    this.element.style.left = Number(value) + 'px';
  }

  get bottom() {
    return parseFloat(this.element.style.bottom) || 0;
  }

  set bottom(value) {
    this.element.style.bottom = Number(value) + 'px';
  }

  remove() {
    this.removed = true;
    this.element.remove();
  }
}

RaceGameCar.height = 50;
RaceGameCar.variants = 4;
RaceGameCar.minSpeed = 0.5;
RaceGameCar.maxSpeed = 0.5;

RaceGameCar.getRandomSpeed = () => Math.random() * (RaceGameCar.maxSpeed - RaceGameCar.minSpeed) + RaceGameCar.minSpeed;
RaceGameCar.getRandomColor = () => getRandom(0, RaceGameCar.variants);

export default RaceGameCar;