import random from "get-random-integer";
import Dispatcher from "events-dispatch";

class Flow {
  constructor(game, config) {
    new Dispatcher(this);

    this.game = game;

    this.elements = {};

    this.element = config.element;
    this.minTimeout = config.minTimeout;
    this.maxTimeout = config.maxTimeout;

    this.timer = null;
  }

  _generateElement() {
    let flowElement = new this.element(this.game);
    this.game.field.appendChild(flowElement.element);

    let watcher = this.game.intersector.watch(flowElement.element, this.game.hero.element);
    this.elements[watcher] = flowElement;

    flowElement.element.on('intersector.events.collision', data => {
      flowElement.remove();
      this.trigger('collision');
    });
    flowElement.on('remove', () => {
      this.game.intersector.stopWatcher(watcher);
      delete this.elements[watcher];
    });

    flowElement.pause = false;

    this.timer = setTimeout(() => this._generateElement(), random(this.minTimeout, this.maxTimeout));
  }

  start() {
    this._generateElement();
  }

  stop() {
    clearTimeout(this.timer);
    for (let watcher in this.elements) 
      this.elements[watcher].remove();
  }
}

export default Flow;