import './pvz-game-line.css';

import PvZGameLineSpot from "./pvz-game-line-spot";
import Dispatcher from 'events-dispatch';

class PvZGameLine {
  constructor(game, config) {
    new Dispatcher(this);

    this.game = game;

    this.index = config.index + 1;
    this.spots = [];
    this.element = this.render();

    this.game.on('startAttack', () => this._onAttack());

    this.enemies = [];
    this.bullets = [];

    this.checkTimer;
  }

  render() {
    let element = document.createElement('div');
    element.classList.add('line');
    element.setAttribute('data-index', this.index);
    element.style.bottom = (this.index - 1) * 100 + 'px';

    for (let i = 0; i < 5; i++) {
      let spot = new PvZGameLineSpot(i, this);
      this.spots.push(spot);
      spot.element.addEventListener('click', () => {
        if (this.active) {
          this._onSelectSpot(spot);
        }
      })
      element.appendChild(spot.element);
    }
    return element;
  }

  get active() {
    return this._active;
  }

  set active(value) {
    this._active = Boolean(value);
  }
 
  activate() {
    this.active = true;
    this._run();
    this._startCheck();
  }

  deactivate() {
    this.active = false;
    this._stopCheck();
    this.spots.forEach(spot => {
      if (spot.plant) spot.plant.stop();
    })

    this.enemies.length = 0;

    this.bullets.length = 0;
  }

  reset() {
    this.active = false;
    this._stopCheck();
    this.bullets.forEach(bullet => {
      bullet.removed = true;
    });
    this.bullets.length = 0;
    this.spots.forEach(spot => {
      if (spot.plant) spot.plant.remove();
    })
    this.enemies.forEach(enemy => {
      enemy.remove();
    });
    this.enemies.length = 0;
    
  }

  _onSelectSpot(spot) {
    if (spot.plant) return;

    this.game.trigger('selectSpot', spot);
  } 

  _onAttack() {
    this.spots.forEach((spot) => {
      if (spot.plant) {
        spot.plant.activate(this);
      }
    })
  }

  _run() {
    this.cycleTimer = setInterval(() => {
      this.enemies.forEach(enemy => {
        if (enemy.el.offsetLeft <= 0) {
          this.game.lose();
          clearInterval(this.cycleTimer);
        }
        let enemyRect = enemy.el.getBoundingClientRect();
        
        this.bullets.forEach(bullet => {
          let bulletRect = bullet.getBoundingClientRect();  
          if (bulletRect.right > enemyRect.left) {
            enemy.lifes = enemy.lifes - bullet.shot;
            bullet.remove();
            bullet.removed = true;
            if (enemy.lifes <= 0) {
              enemy.kill();
              let index = this.enemies.indexOf(enemy);
              if (index !== -1) this.enemies.splice(index, 1);
              this.game.trigger('killEnemy');
              
              this.game.points = this.game.points + 1;
            }
          }
        });
        this.bullets = this.bullets.filter(bullet => !bullet.removed);
      })
    }, 10);
  }

  _startCheck() {
    this.checkTimer = setInterval(() => {
      let plants = this.spots.filter(spot => spot.plant).map(spot => spot.plant);
      this.enemies.forEach(enemy => {
        let enemyRect = enemy.el.getBoundingClientRect();
        plants.forEach(plant => {
          let plantRect = plant.view.getBoundingClientRect();
          if (enemyRect.left >= plantRect.right) return;
          plant.kill();
          this.game.points = this.game.points - 0.5;
        })
      })
      
    }, 1000)
  }

  _stopCheck() {
    clearInterval(this.checkTimer);
  }
}

export default PvZGameLine;