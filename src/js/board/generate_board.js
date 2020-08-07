const createRows = (player, boardSize) => {
  let rowsHTML = '';

  for (let y = 1; y <= boardSize; y++) {
    rowsHTML += `<div class="board-row p${player}-board-row-${y}"></div>`;
  }
  $(`.board-p${player}`).html(rowsHTML);
};

const createColumns = (player, boardSize) => {
  for (let y = 1; y <= boardSize; y++) {
    let columnsHTML = '';

    for (let x = 1; x <= boardSize; x++) {
      columnsHTML += `<div class="board-cell p${player}-${letters[x - 1]}${y}"></div>`
    }
    $(`.p${player}-board-row-${y}`).html(columnsHTML);
  }
};

const createCoordinateMarkers = (player, boardSize) => {
  const gridHTML = $(`.board-p${player}`).html();
  let rowHTML = '';
  let columnHTML = '';
  
  for (let y = 1; y <= boardSize; y++) {
    rowHTML += `<div class="identifier">${y}</div>`;
  }
  for (let x = 1; x <= boardSize; x++) {
    columnHTML += `<div class="identifier">${letters[x - 1]}</div>`;
  }

  const completedHTML = `<div class="identifier-row">${rowHTML}</div><div class="identifier-column">${columnHTML}</div>`;

  $(`.board-p${player}`).html(completedHTML + gridHTML);
};

// Create the board grid
const createBoard = ({player, boardSize}) => {
  createRows(player, boardSize);
  createColumns(player, boardSize);
  createCoordinateMarkers(player, boardSize);
};