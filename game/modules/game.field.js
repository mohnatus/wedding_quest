import "./game.field.css";

const createMask = () => {
  let el = document.createElement("div");
  el.classList.add("game-field__mask");
  el.style.display = "none";
  return el;
}

const createField = () => {
  let el = document.createElement("div");
  el.style.position = "relative";
  el.classList.add("game-field");

  return el;
}

const GameField = (el, table) => {
  el.classList.add('game-wrapper');
  if (table) {
    el.appendChild(table);
  }
  
  let clickCallback;

  let field = createField();
  el.appendChild(field);

  let mask = createMask();
  mask.addEventListener("click", () => field.start())
  field.appendChild(mask);

  field.onLose = (callback) => {
    clickCallback = callback;
    mask.style.display = "";
  }

  field.start = () => {
    mask.style.display = "none";
    if (typeof clickCallback === "function") clickCallback();
  }

  return field;
};

export default GameField;