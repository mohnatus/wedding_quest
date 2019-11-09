import Dispatcher from "events-dispatch";

import Base from "./plant.base";
import Power from "./plant.power";
import Money from "./plant.money";

class Board {
  constructor(game) {
    new Dispatcher(this);
    this.game = game;

    this.plants = [
      Money,
      Base,
      Power,
    ];

    this.element = this.render();

    
  }

  render() {
    let element = document.createElement('div');
    element.classList.add('plants-board');

    this.plants.forEach((plant, index) => {
      let preview = plant.getPreview();
      plant.preview = preview;
      preview.addEventListener('click', () => {
        if (this.active) {
          console.log('select plant', plant)
          this._onSelect(plant);
        }
      })
      element.appendChild(preview);
    })

    return element;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = Boolean(value);

    this.element.classList.toggle('active', this._active);
  }

  activate() {
    console.log('activate plants board');
    this.active = true;
  }

  deactivate() {
    console.log('deactivate plants board')
    this.active = false;
  }

  _onSelect(plant) {
    if (this.selected) {
      this.selected.preview.classList.remove("active");
    }

    this.selected = plant;
    plant.preview.classList.add("active");
    this.game.trigger('selectPlant');
  }

  get selected() {
    return this._selected;
  }

  set selected(plantClass) {
    this._selected = plantClass;
  }

  get selectedPlant() {
    if (this._selected) {
      return new this._selected()
    }
  }
}

export default Board;