import "./index.css";

import screens from "./screens";
import updateScreen from "./utils/update.screen";
import initGame from "./utils/init.game";

let currentScreen = 0;

const showScreen = (index) => {
  currentScreen = index;
  let screen = screens[currentScreen];

  updateScreen(screen, () => {
    if (screen.game) {
      updateScreen(null);
      initGame(screen.game, () => {
        showScreen(index + 1);
      });
    } else {
      showScreen(index + 1);
    }
  });
}

showScreen(43);