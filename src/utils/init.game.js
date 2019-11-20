import EuropeGame from "../../europe";
import AfricaGame from "../../africa";
import AsiaGame from "../../asia";
import AustraliaGame from "../../australia";
import AntarcticaGame from "../../antarctica";
import AmericaGame from "../../america";

const createPlayground = (gameName) => {
  let el = document.createElement('div');
  el.classList.add(`game-${gameName}`);
  el.style.position = "relative";
  return el;
};

window.points = 0;

const initGame = (gameName, callback) => {
  let playground = createPlayground(gameName);
  document.body.appendChild(playground);
  let game;

  switch(gameName) {
    case "asia":
      game = new AsiaGame(playground);
      break;
    case "europe":
      game = new EuropeGame(playground);
      break;
    case "africa":
      game = new AfricaGame(playground);
      break;
    case "australia":
      game = new AustraliaGame(playground);
      break;
    case "antarctica":
      game = new AntarcticaGame(playground);
      break;
    case "america":
      game = new AmericaGame(playground);
      break;
  }

  if (game) {
    game.once("win", (gamePoints) => {
      points += gamePoints;
      console.log('new points', points);
      game = null;
      playground.remove();
      callback();
    });
  }
};

export default initGame;