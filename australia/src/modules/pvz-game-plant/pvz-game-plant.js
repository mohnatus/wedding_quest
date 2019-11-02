import "./pvz-game-plant.css";
import Dispatcher from "events-dispatch";

let counter = 0;

class PvZGamePlant {
  constructor() {
    this.index = ++counter;
    new Dispatcher(this);
  }

  static getPreview() {
    let el = document.createElement('div');
    el.classList.add('plant-preview');
    el.classList.add('plant');
    el.setAttribute('data-plant', this.plantName);
    
    let price = document.createElement('div');
    price.classList.add('plant-preview__price');
    price.textContent = this.price;
    el.appendChild(price);

    return el;
  }

  get view() {
    if (!this._view) {
      this._view = this.renderView();
    }

    return this._view;
  }

  get price() {
    return this.constructor.price;
  }

  renderView() {
    let view = document.createElement('div');
    view.className = 'plant-view plant';
    view.setAttribute('data-plant', this.constructor.plantName);
    return view;
  }

  execute(line) {
  }

  activate(line) {
    console.log('ACTIVATE', this.executed)
    if (this.executed) return;
    this.executed = true;
    this.execute(line);
  }

  stop() {
    this.stopped = true;
    clearInterval(this.executeTimer);
  }

  kill() {
    this.stop();
    this.trigger('killed');
  }

  remove() {
    this.stop();
    this.view.remove();
  }
}

PvZGamePlant.plantName = "plant";

export default PvZGamePlant;