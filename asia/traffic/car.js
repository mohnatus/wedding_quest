import getRandom from "get-random-integer";


class Car {
  constructor() {
    this.element = document.createElement('div');
    this.speed = Car.getRandomSpeed();
    this.element.className = `car car-${Car.getRandomColor()}`;
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

Car.height = 50;
Car.variants = 4;
Car.minSpeed = 0.5;
Car.maxSpeed = 0.5;

Car.getRandomSpeed = () => Math.random() * (Car.maxSpeed - Car.minSpeed) + Car.minSpeed;
Car.getRandomColor = () => getRandom(0, Car.variants);

export default Car;