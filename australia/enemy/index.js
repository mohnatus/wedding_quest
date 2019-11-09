class Enemy {
  constructor(lifes) {
    this.el = this.render();
    this.lifes = 4;
  }

  get lifes() {
    return this._lifes;
  }

  set lifes(value) {
    let oldLifes = this.lifes;

    this._lifes = value;
    this.el.setAttribute('data-lifes', value);

    if (this._lifes < oldLifes) {
      this.el.classList.add('shot');
      setTimeout(() => this.el.classList.remove('shot'), 150);
    }
  }

  render() {
    let el = document.createElement('div');
    el.classList.add('enemy');
    return el;
  }

  remove() {
    this.el.remove();
  }

  kill() {
    this.removed = true;
    this.remove();
  }
}

export default Enemy;