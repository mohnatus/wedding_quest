import Car from "./car";
import getRandom from "get-random-integer";
import Dispatcher from "events-dispatch";

class Traffic {
  constructor(game, config) {
    new Dispatcher(this);

    this.config = Object.assign({
      minDelay: 1100,
      maxDelay: 2500,
      maxCars: 7,
      minCarSpeed: 0.6,
      maxCarSpeed: 1.6
    }, config);

    Car.maxSpeed = this.config.maxCarSpeed;
    Car.minSpeed = this.config.minCarSpeed;
    
    this.game = game;

    this.track = this.game.track;
    this.width = this.track.element.offsetWidth;
    this.intersector = this.game.intersector;

    this.cars = [];
    this.flowTimer;
    this.generationTimer;
  }

  get startBottomPosition() {
    return this.game.field.offsetHeight - this.track.bottom + Car.height;
  }

  get finishBottomPosition() {
    return -2 * Car.height;
  }

  get startLeftPosition() {
    return getRandom(20, this.width - 40);
  }

  get delay() {
    return getRandom(this.config.minDelay, this.config.maxDelay);
  }

  start() {
    this.startFlow();
    this.startMoving();
  }

  stop() {
    clearInterval(this.flowTimer);
    clearTimeout(this.generationTimer);

    this.cars.forEach(car => {
      this.game.intersector.stopWatcher(car.watcher);
      car.remove();
    });

    this.cars.length = 0;
  }

  startMoving() {
    this.flowTimer = setInterval(() => {
      
      this.cars = this.cars.filter(car => !car.removed);

      this.cars.forEach(car => {
          let newPosition = car.bottom - car.speed;
          
          if (newPosition < this.finishBottomPosition) {
            
            car.remove();
            this.game.intersector.stopWatcher(car.watcher);
            return;
          }
          car.bottom = newPosition;
        })
    }, 0)
  }

  startFlow() {
    let iteration = () => {
      let delay = 100;
      if (this.cars.length < this.config.maxCars) {
        this.createCar();
        delay = this.delay;
      }
      this.generationTimer = setTimeout(() => iteration(), delay);
    }
    
    iteration();
  }

  createCar() {
    let car = new Car();
    this.cars.push(car);
    car.bottom = this.startBottomPosition;
    car.left = this.startLeftPosition;
    this.track.addCar(car);

    let watcher = this.game.intersector.watch(car.element, this.game.hero.element);
    car.watcher = watcher;

    car.element.on('intersector.events.collision', () => this._onCollision(car));
  }

  _onCollision(car) {
    car.remove();
    this.trigger('accident');
  }
}

export default Traffic;