import cards from "./cards";
import "./index.css";

import Dispatcher from "events-dispatch";

class EuropeGame {
  constructor(element, config = {}) {
    new Dispatcher(this);

    this.field = element;

    this.cards = [];

    let width = config.width || 5;
    let height = config.height || 4;
  
    this.map = this.createRandomMap(cards, width, height);
    this.renderMap();

    this.selected = null;
    this.inProcess = false;
  }

  createRandomMap(cards, width, height) {
    let combinations = [];
    let map = [];

    for (let y = 0; y < height; y++) {
      map.push([]);
      for (let x = 0; x < width; x++) {
        combinations.push([y, x]);
        map[y][x] = null;
      }
    }
    
    let counter = 0;
    
    while(combinations.length) {
      let card = cards[counter];
      if (!card) break;

      let random = Math.floor(Math.random() * combinations.length);
      let position = combinations[random];
      map[position[0]][position[1]] = card;
      combinations.splice(random, 1);

      counter++;
    }

    return map;
  }

  renderMap() {
    for (let y = 0; y < this.map.length; y++) {
      let row = document.createElement('div');
      row.className = 'row';
      for (let x = 0; x < this.map[0].length; x++) {
        let cell = document.createElement('div');
        cell.className = 'cell';

        let card = this.map[y][x];

        let $card = document.createElement('div');
        $card.className = "card";

        let text = document.createElement('span');
        text.textContent = card.text;

        $card.appendChild(text);
        $card.value = card.value;
        $card.clicks = 0;

        $card.setAttribute('data-value', card.value);
        $card.setAttribute('data-state', card.state);

        this.cards.push($card);

        $card.addEventListener('click', () => this.onCardClick($card));

        cell.appendChild($card);
        row.appendChild(cell);
      }
      this.field.appendChild(row);
    }
  }

  onCardClick(card) {
    if (card == this.selected || this.inProcess) return;
    if (card.removed) return;

    card.classList.add('show');
    card.clicks++;

    this.inProcess = true;

    setTimeout(() => {
      if (this.selected) {
        if (this.selected.value == card.value) {

          this.selected.classList.add('right');
          card.classList.add('right');

          let index = this.cards.indexOf(this.selected);
          this.cards.splice(index, 1);

          index = this.cards.indexOf(card);
          this.cards.splice(index, 1);

          let points = Math.max(1, 15 - card.clicks - this.selected.clicks);
          this.points = this.points + points;

          if (!this.cards.length) this.win();

          setTimeout(() => {
            this.selected.removed = true;
            card.removed = true;
            this.selected.setAttribute('data-removed', '');
            card.setAttribute('data-removed', '');

            this.selected = null;

            this.inProcess = false;
          }, 400);

        } else {

          this.selected.classList.add('wrong');
          card.classList.add('wrong');
          
          setTimeout(() => {
            this.selected.classList.remove('selected');
            this.selected.classList.remove('show');
            this.selected.classList.remove('wrong');
            card.classList.remove('show');
            card.classList.remove('wrong');

            this.selected = null;

            this.inProcess = false;
          }, 400);

        }
      } else {

        this.selected = card;
        this.selected.classList.add('selected');
        this.selected.classList.add('show');

        this.inProcess = false;

      }
      
    }, 600)
  }

  win() {
    this.trigger("win");
  }
}

export default EuropeGame;
