const checkForPlacedShip = (shipLength, board, columnIndex, row, shipOrientation, column) => {
  if (shipOrientation === 'horizontal') {
    for (let i = 0; i < shipLength; i++) {
      const boardCell = $(`.p${board}-${letters[columnIndex + i]}${row}`);
      if (boardCell.attr('class') && boardCell.attr('class').split(' ')[2]) {
        return true;
      }
    }
    return false;
  } else {
    for (let i = 0; i < shipLength; i++) {
      const boardCell = $(`.p${board}-${column}${(Number(row) + i).toString()}`)

      if (boardCell.attr('class') && boardCell.attr('class').split(' ')[2]) {
        return true;
      }
    }
    return false;
  }
};

// shows outine of ship on players board
const outlineShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, column) => {
  if (shipOrientation === 'horizontal') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(172, 103, 103)');
      }
      return;
    }

    // outlines a ship in red if off board, blue otherwise
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
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(172, 103, 103)');
      }
      return;
    }

    // outlines a ship in red if off board, blue otherwise
    if (Number(row) + shipLength - 1 > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(172, 103, 103)'); // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(102, 102, 168)');  // blue if entire ship is on board
      }
    }
  }
};

const unOutlineShipOnBoard = (shipOrientation, columnIndex, board, row, column) => {
  if (shipOrientation === 'horizontal') {
    // removes outline for ship when not hovering over that piece anymore
    for (let i = 0; i < 5; i++) {
      if ($(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class')) {
        const hasShip = $(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class').split(' ')[2];

        if (hasShip) {
          $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(102, 102, 168)');
        } else {
          $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(235, 235, 255)');
        }
      }
    }
  }
  if (shipOrientation === 'vertical') {
    // removes outline for ship when not hovering over that piece anymore
    for (let i = 0; i < 5; i++) {
      if ($(`.p${board}-${column}${(Number(row) + i).toString()}`).attr('class')) {
        const hasShip = $(`.p${board}-${column}${(Number(row) + i).toString()}`).attr('class').split(' ')[2];

        if (hasShip) {
          $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(102, 102, 168)');
        } else {
          $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(235, 235, 255)');
        }
      }
    }
  }
};

const placeShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) => {
  if (shipOrientation === 'horizontal') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      return 'invalid ship position';
    }

    // stops player from placing ships outside of boundaries
    if (columnIndex + shipLength > boardSize) {
      return "invalid ship position";
    } else {
      // if not out of bounds, then place ship on board
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).addClass(`p${player}-ship-${currentShip}-${i + 1}`)
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', 'rgb(102, 102, 168)');    //  blue if in bounds
      }
    }
  }

  if (shipOrientation === 'vertical') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      return 'invalid ship position';
    }

    // stops player from placing ships outside of boundaries
    if (Number(row) + shipLength - 1 > boardSize) {
      return "invalid ship position";
    } else {
      // if not out of bounds then place ship on board
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).addClass(`p${player}-ship-${currentShip}-${i + 1}`)
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', 'rgb(102, 102, 168)');  // blue if in bounds
      }
    }
  }
}

const getEventDetails = (event, shipsNotPlaced, currentShip) => {
  const target = $(event.target);
  const cell = target.attr('class').split(' ')[1];  // A1, A2, A3.... J10
  const board = cell.charAt(1);
  const column = cell.charAt(3);  // A, B, C... J
  const row = cell.slice(4).toString();  // 1, 2, 3... 10
  const shipClass = shipsNotPlaced[currentShip - 1];
  const columnIndex = letters.indexOf(column);
  
  return {
    cell,
    board,
    column,
    row,
    shipClass,
    columnIndex
  }
}

const allowPlayerToPlaceShips = ({player, shipsNotPlaced, currentShip, boardSize, shipOrientation}) => {
  // clears previous event listeners before adding the updated event listeners
  $('body').off('keypress');
  $(`.board-p${player}`).children().children('.board-cell').off('mouseover mouseleave click');

  // Rotate ship if press 'r' key;
  $(`body`).on('keypress', (event) => {
    if (event.which == 114 && event.target.nodeName.toLowerCase() !== 'input') {
      socket.emit('rotate piece');
    }
  });

  // Outlines ship on board
  $(`.board-p${player}`).children().children('.board-cell').on('mouseover', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);
    
    if (player !== Number(board)) {
      return;
    }
    if (shipClass === 'carrier') {
      outlineShipOnBoard(5, boardSize, shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'battleship') {
      outlineShipOnBoard(4, boardSize, shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'cruiser') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'submarine') {
      outlineShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'destroyer') {
      outlineShipOnBoard(2, boardSize, shipOrientation, columnIndex, board, row, column);
    }

  });

  // Unoutline ship on board
  $(`.board-p${player}`).children().children('.board-cell').on('mouseleave', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);

    if (player !== Number(board)) {
      return;
    }
    
    if (shipClass === 'carrier') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'battleship') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'cruiser') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'submarine') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row, column);
    }
    if (shipClass === 'destroyer') {
      unOutlineShipOnBoard(shipOrientation, columnIndex, board, row, column);
    }
  });

  // Place ship onto board
  $(`.board-p${player}`).children().children('.board-cell').on('click', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);

    if (shipClass === 'carrier') {
      if (placeShipOnBoard(5, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'battleship') {
      if (placeShipOnBoard(4, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'cruiser') {
      if (placeShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'submarine') {
      if (placeShipOnBoard(3, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) === "invalid ship position") {
        return;
      };
    }
    if (shipClass === 'destroyer') {
      if (placeShipOnBoard(2, boardSize, shipOrientation, columnIndex, board, row, player, currentShip, column) === "invalid ship position") {
        return;
      };
    }
    socket.emit('place ship', cell);
  })
}