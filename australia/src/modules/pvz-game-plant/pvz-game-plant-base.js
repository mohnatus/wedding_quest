import PvZGamePlant from "./pvz-game-plant";


class PvZGamePlantBase extends PvZGamePlant {
  constructor(shot = 1, ...data) {
    super(...data);

    this.shot = shot;
  }

  execute(line) {
    console.log('iteration', this.index);
    this.line = line;

    this._iterate();
  }

  _iterate() {
    let bullet = this._createBullet();
    this.line.element.appendChild(bullet);

    this._moveBullet(bullet);
    this.line.bullets.push(bullet);

    this.timeout = setTimeout(() => {
      if (this.stopped) return;
      this._iterate();
    }, PvZGamePlantBase.executeInterval)
  }

  _createBullet() {
    let el = document.createElement('div');
    el.className = "plant-bullet " + this.constructor.plantName;

    el.left = this.view.parentElement.offsetLeft + this.view.offsetWidth - 30;
    el.style.left = el.left + 'px';

    el.shot = this.shot;

    return el;
  }

  _moveBullet(bullet) {
    bullet.timer = setInterval(() => {
      bullet.left = bullet.left + 4;
      bullet.style.left = bullet.left + 'px';

      if (bullet.left > 600) {
        clearInterval(bullet.timer);
        bullet.remove();
        let index = this.line.bullets.indexOf(bullet);
        if (index !== -1) this.line.bullets.splice(index, 1);
      }
    }, 10);
  }
}

PvZGamePlantBase.plantName = "base";
PvZGamePlantBase.price = 100;
PvZGamePlantBase.executeInterval = 2000;

export default PvZGamePlantBase;