class Spot {
  constructor(index, line) {
    this.index = index;
    this.line = line;
    this.element = this.render();
  }

  get plant() {
    return this._plant;
  }

  set plant(plant) {
    
    this._plant = plant;
    if (this._plant) {
      let view = this._plant.view;
      this.element.appendChild(view);

      this._plant.on('killed', () => {
        this._plant = null;
        view.remove();
      })
    }
    
  }
  
  render() {
    let spot = document.createElement('div');
    spot.classList.add('spot');
    spot.setAttribute('data-index', this.index + 1);
    spot.style.left = this.index * 100 + 50 + 'px';

    return spot;
  }
}

export default Spot;