// shows outine of ship on players board
const outlineShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row) => {
  if (shipOrientation === 'horizontal') {
    if (columnIndex + shipLength > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(172, 103, 103)');   // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(102, 102, 168)');  // blue if entire ship is on board
      }
    }

  }
  if (shipOrientation === 'vertical') {
    if (Number(row) + shipLength - 1 > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(172, 103, 103)'); // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(102, 102, 168)');  // blue if entire ship is on board
      }
    }
  }
};

const unOutlineShipOnBoard = (shipOrientation, columnIndex, board, row) => {
  if (shipOrientation === 'horizontal') {
    for (let i = 0; i < 5; i++) {
      if ($(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class')) {
        const hasShip = $(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class').split(' ')[2];
        if (!hasShip) {
          $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(235, 235, 255)'); 
        }
      }
    }
  }
  if (shipOrientation === 'vertical') {
    for (let i = 0; i < 5; i++) {
      if ($(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class')) {
        const hasShip = $(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class').split(' ')[2];
        if (!hasShip) {
          $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(235, 235, 255)');
        }
      }
    }
  }
};

const placeShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) => {

  if (shipOrientation === 'horizontal') {

    // stops player from placing overlapping ships
    for (let i = 0; i < shipLength; i++) {
      const boardCell = $(`.p${board}-${letters[columnIndex + i]}${row}`);
      if (boardCell.attr('class') && boardCell.attr('class').split(' ')[2]) {
        return "invalid ship position";
      }
    }

    if (columnIndex + shipLength > boardSize) {
      return "invalid ship position";
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).addClass(`p${player}-ship-${currentShip}-${i + 1}`)
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(102, 102, 168)');    //  blue if in bounds
      }
    }

  }
  if (shipOrientation === 'vertical') {
    // stops player from placing overlapping ships
    for (let i = 0; i < shipLength; i++) {
      const boardCell = $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`)
      if (boardCell.attr('class') && boardCell.attr('class').split(' ')[2]) {
        return "invalid ship position";
      }
    }

    if (Number(row) + shipLength - 1 > boardSize) {
      return "invalid ship position";
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).addClass(`p${player}-ship-${currentShip}-${i + 1}`)
        $(`.p${board}-${columnIndex}${(Number(row) + i).toString}`).css('background-color', 'rgb(102, 102, 168)');  // blue if in bounds
      }
    }
  }
}

const allowPlayerToPlaceShips = ({player, shipsNotPlaced, currentShip, boardSize, shipOrientation}) => {
  // clears previous event listeners before adding the updated event listeners
  $(`.board-p${player}`).children().children('.board-cell').off('mouseover mouseleave click');

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
      outlineShipOnBoard(5, boardSize, shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'battleship') {
      outlineShipOnBoard(4, boardSize, shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'cruiser') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'submarine') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row);
    }
    if (shipClass === 'destroyer') {
      outlineShipOnBoard(2, boardSize, shipOrientation, columnIndex, board, row);
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

    // stop player from hovering over opponents board during 'placing ship' phase
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
    const cell = target.attr('class').split(' ')[1];   // A1, A2, A3.... J10
    const board = cell.charAt(1);
    const column = cell.charAt(3);   // A, B, C... J
    const row = cell.slice(4).toString();      // 1, 2, 3... 10
    const shipClass = shipsNotPlaced[currentShip - 1];
    const columnIndex = letters.indexOf(column);

    // stops player from placing a part of ship out of boundaries
    if (target.css('background-color') === 'rgb(255, 0, 0)') {
      console.log('invalid ship placement');
      return;
    }

    if (shipClass === 'carrier') {
      if (placeShipOnBoard(5, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'battleship') {
      if (placeShipOnBoard(4, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'cruiser') {
      if (placeShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'submarine') {
      if (placeShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'destroyer') {
      if (placeShipOnBoard(2, boardSize, shipOrientation, columnIndex, board, row, player, currentShip) === "invalid ship position") {
        return;
      };
    }
    socket.emit('place ship', cell);
  })
}