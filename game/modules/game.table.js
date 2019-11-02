const GameTable = (params) => {
  let table = document.createElement("table");
  table.classList.add("game-table");

  let nodes = {};

  for (let paramName in params) {
    let param = params[paramName];

    let row = document.createElement("tr");

    let name = document.createElement("td");
    name.textContent = param.name;
    row.appendChild(name);

    let value = document.createElement("td");
    value.textContent = param.value || 0;
    row.appendChild(value);

    nodes[paramName] = value;

    table.appendChild(row);
  }

  return {
    element: table,
    update: (data) => {
      for (let param in data) {
        let node = nodes[param];
        if (node) node.textContent = data[param];
      }
    }
  }
};

export default GameTable;