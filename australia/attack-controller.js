import Enemy from "./enemy";

const attacks = [
  {
      delay: 3000,
      speed: 0.1,
      interval: 5000,
      count: 3
  },{
    delay: 3000,
    speed: 0.2,
    interval: 5000,
    count: 3
  },{
    delay: 3000,
    speed: 0.4,
    interval: 5000,
    count: 3
  }
];

class AttackController {
  constructor(game) {
    this.game = game;
    this.index = -1;
    this.timer;
    this.pause = true;
  }

  get count() {
    return this._count || 0;
  }

  set count(value) {
    this._count = value;
  }

  start() {
    this.pause = false;
    this.startAttackTimer();
  }

  startAttackTimer() {
    this.index++;
    let attack = attacks[this.index];
    if (!attack) {
      this.game.trigger('finishAttacks');
      return;
    }
    this.timer = setTimeout(() => {
      this.game.attacked = true;
      this.startAttack();
    }, attack.delay);
  }

  stop() {
    this.pause = true;
    this.game.attacked = false;
    clearTimeout(this.timer);
  }

  reset() {
    this.stop();
    this.index = 0;
  }

  startAttack() {
    this.game.trigger('startAttack');
    let attack = attacks[this.index];
    
    let count = 0;

    let attackInterval = setInterval(() => {
      if (this.pause) {
        clearInterval(attackInterval);
        return;
      }

      if (count >= attack.count) {
        clearInterval(attackInterval);
        this.game.trigger('finishAttack');
        this.startAttackTimer();
        return;
      }

      let lineIndex = Math.floor(Math.random() * 3);
      let line = this.game.lines[lineIndex];

      let enemy = new Enemy();

      count++;

      enemy.right = -120;
      enemy.el.style.right = enemy.right + 'px';
      line.element.appendChild(enemy.el);
      line.enemies.push(enemy);

      let enemyInterval = setInterval(() => {
        if (enemy.removed || enemy.right >= 600) {
          clearInterval(enemyInterval);
          
        } else {
          enemy.right += attack.speed;
          enemy.el.style.right = enemy.right + 'px';
        }
        
      }, 10);

    }, attack.interval);
  }

}

export default AttackController;