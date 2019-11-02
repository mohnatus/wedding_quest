import EuropeGame from "../../europe";
import AfricaGame from "../../africa";

const createPlayground = (gameName) => {
  let el = document.createElement('div');
  el.classList.add(`game-${gameName}`);
  el.style.position = "relative";
  return el;
};

const initGame = (gameName, callback) => {
  let playground = createPlayground(gameName);
  document.body.appendChild(playground);
  let game;

  switch(gameName) {
    case "europe":
      game = new EuropeGame(playground);
      break;
    case "africa":
      game = new AfricaGame(playground);
      break;
  }

  if (game) {
    game.on("win", () => {
      playground.remove();
      callback();
    });
  }
};

export default initGame;