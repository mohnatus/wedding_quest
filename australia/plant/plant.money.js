import Plant from ".";

class PlantMoney extends Plant {
  constructor(...data) {
    super(...data);

    this.moneyTimer;
  }

  get ready() {
    return this._ready;
  }

  set ready(value) {
    this._ready = value;
    if (this._ready) {
      this.view.setAttribute('data-ready', '');
    } else {
      this.view.removeAttribute('data-ready');
    }
  }

  renderView() {
    let view = super.renderView();
    let bg = document.createElement('div');
    bg.className = 'bg';
    view.appendChild(bg);
    this.bg = bg;
    view.addEventListener('click', () => {
      if (this.ready) {
        this.line.game.money = this.line.game.money + PlantMoney.price;
        this.ready = false;
        this.bg.style.height = 0;
        this._startTimer();
      }
    });
    return view;
  }

  execute(line) {
    this.line = line;
    this._startTimer();
  }

  _startTimer() {
    this.startTime = Date.now();
    this.moneyTimer = setTimeout(() => {
      
      clearInterval(this.updateTimer);
      this.ready = true;
    }, PlantMoney.executeInterval)

    this.updateTimer = setInterval(() => {
      let now = Date.now();
      let percent = (now - this.startTime) * 100 / (PlantMoney.executeInterval - 5);
      this.bg.style.height = percent + '%';
    }, 100);
    

      
    
  }


}

PlantMoney.plantName = "money";
PlantMoney.price = 50;
PlantMoney.executeInterval = 5000;

export default PlantMoney;