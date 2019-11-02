import Game from "furrygame";
import RaceGameHero from "./race-game-hero/race-game-hero";
import RaceGameTrack from "./race-game-track/race-game-track";
import RaceGameTraffic from "./race-game-traffic/race-game-traffic";

import "./race-game.css";

class RaceGame extends Game {
  constructor(config = {}) {
    super(config);

    this.hero = new RaceGameHero(this);
    this.field.addElement(this.hero.element);
    this.hero.on('boundary', (boundary) => this._onHeroBoundary(boundary));

    RaceGameTrack.finish = config.distance || 4000;
    this.track = new RaceGameTrack(this);
    this.field.addElement(this.track.element);
    this.track.init();
    this.track.on('check-mark', data => {
      this.points = data.distance;
    });

    let finish = this.track.finish;
    this.intersector.watch(finish, this.hero.element);
    finish.on('intersector.events.collision', data => {
      this.win();
    });

    this._setHeroStartPosition();

    this.traffic = new RaceGameTraffic(this, {

    });
    this.traffic.on('accident', () => this.loseLife());
  }

  _onStart() {
    this.hero.pause = false;

    this.track.start();
    this.traffic.start();
  }

  _setHeroStartPosition() {
    this.hero.left = this.field.element.offsetWidth / 2 - this.hero.element.offsetWidth / 2;
    this.hero.top = this.field.element.offsetHeight + this.track.startOffset - this.hero.element.offsetHeight / 2;
  }

  _onHeroBoundary(boundary) {
    if (boundary !== "up" && boundary !== "down") return;

    this.track.move(boundary, this.hero);
  }

  _onReset() {
    this.hero.pause = true;
    
    this.track.reset();
    this.traffic.stop();
  }

  _onLose() {
    this._setHeroStartPosition();
    this.points = this.defaultPoints;
  }
}

export default RaceGame;
