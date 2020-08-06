const letters = [
  'A', 'B', 'C', 'D', 'E', 
  'F', 'G', 'H', 'I', 'J'
];

const createRows = (player, boardSize) => {
  let rowsHTML = '';

  for (let y = 1; y <= boardSize; y++) {
    rowsHTML += `<div class="board-row p${player}-board-row-${y}"></div>`;
  }

  $(`.board-p${player}`).html(rowsHTML);
};

const createColumns = (player, boardSize) => {
  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  for (let y = 1; y <= boardSize; y++) {
    let columnsHTML = '';

    for (let x = 1; x <= boardSize; x++) {
      columnsHTML += `<div class="board-cell p${player}-${alphabets[x - 1]}${y}"></div>`
    }

    $(`.p${player}-board-row-${y}`).html(columnsHTML);
  }
};

const createCoordinates = (player, boardSize) => {
  const gridHTML = $(`.board-p${player}`).html();
  let rowHTML = '';
  let columnHTML = '';

  const alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  
  for (let y = 1; y <= boardSize; y++) {
    rowHTML += `<div class="identifier">${y}</div>`;
  }
  for (let x = 1; x <= boardSize; x++) {
    columnHTML += `<div class="identifier">${alphabets[x - 1]}</div>`;
  }

  const completedHTML = `<div class="identifier-row">${rowHTML}</div><div class="identifier-column">${columnHTML}</div>`;

  $(`.board-p${player}`).html(completedHTML + gridHTML);
};

// Create the board grid
const createBoard = ({player, boardSize}) => {
  createRows(player, boardSize);
  createColumns(player, boardSize);
  createCoordinates(player, boardSize);
};

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

// shows outine of ship on players board
const outlineShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced) => {
  if (shipOrientation === 'horizontal') {
    if (columnIndex + shipLength > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'red');   // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(68, 68, 172)');  // blue if entire ship is on board
      }
    }

  }
  if (shipOrientation === 'vertical') {
    if (Number(row) + shipLength - 1 > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'red'); // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(68, 68, 172)');  // blue if entire ship is on board
      }
    }
  }
};

const unOutlineShipOnBoard = (shipOrientation, columnIndex, board, row) => {
  if (shipOrientation === 'horizontal') {
    for (let i = 0; i < 5; i++) {
      $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(235, 235, 255)'); 
    }
  }
  if (shipOrientation === 'vertical') {
    for (let i = 0; i < 5; i++) {
      $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(235, 235, 255)');
    }
  }
};



const addBoardHoverEffects = ({player, shipsNotPlaced, currentShip, boardSize, shipOrientation}) => {
  $(`.board-p${player}`).children().children('.board-cell').off('mouseover mouseleave click');
  if (shipsNotPlaced.length === 0) {
    console.log('all ship placed');
    return;
  }

  // Change background color of cell
  $(`.board-p${player}`).children().children('.board-cell').on('mouseover', (event) => {
    const target = $(event.target);
    const cell = target.attr('class').split(' ')[1];   // A1, A2, A3.... J10
    const board = cell.charAt(1);
    const column = cell.charAt(3);   // A, B, C... J
    const row = cell.slice(4).toString();      // 1, 2, 3... 10
    const shipClass = shipsNotPlaced[currentShip - 1];
    const columnIndex = letters.indexOf(column);
    
    if (player !== Number(board)) {
      return;
    }
    if (shipClass === 'carrier') {
      outlineShipOnBoard(5, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced);
    }
    if (shipClass === 'battleship') {
      outlineShipOnBoard(4, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced);
    }
    if (shipClass === 'cruiser') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced);
    }
    if (shipClass === 'submarine') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced);
    }
    if (shipClass === 'destroyer') {
      outlineShipOnBoard(2, boardSize, shipOrientation, columnIndex, board, row, shipsNotPlaced);
    }

  });

  // Change background color of cell back to default color
  $(`.board-p${player}`).children().children('.board-cell').on('mouseleave', (event) => {
    const target = $(event.target);
    const cell = target.attr('class').split(' ')[1];   // A1, A2, A3.... J10
    const board = cell.charAt(1);
    const column = cell.charAt(3);   // A, B, C... J
    const row = cell.slice(4).toString();      // 1, 2, 3... 10
    const shipClass = shipsNotPlaced[currentShip - 1];
    const columnIndex = letters.indexOf(column);

    if (player !== Number(board)) {
      return;
    }
    if (shipClass === 'carrier') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'battleship') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'cruiser') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'submarine') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'destroyer') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row);
    }
  });

  // click a cell on the board
  $(`.board-p${player}`).children().children('.board-cell').on('click', (event) => {
    const target = $(event.target);
    const clickedCell = target.attr('class').split(' ').slice(1);
    socket.emit('click cell', clickedCell);
  })
}