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
const outlineShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell) => {
  if (shipOrientation === 'horizontal') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorRed);
      }
      return;
    }

    // outlines a ship in red if off board, blue otherwise
    if (columnIndex + shipLength > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorRed);   // red if part of ship is off board
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorBlue);  // blue if entire ship is on board
      }
    }
  }

  if (shipOrientation === 'vertical') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorRed);
      }
      return;
    }

    // outlines a ship in red if off board, blue otherwise
    if (Number(row) + shipLength - 1 > boardSize) {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorRed);
      }
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorBlue);
      }
    }
  }
};

const unOutlineShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell) => {
  if (shipOrientation === 'horizontal') {
    // removes outline for ship when not hovering over that piece anymore
    for (let i = 0; i < 5; i++) {
      if ($(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class')) {
        const hasShip = $(`.p${board}-${letters[columnIndex + i]}${row}`).attr('class').split(' ')[2];

        if (hasShip) {
          $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorBlue);
        } else {
          $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorLightBlue);
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
          $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorBlue);
        } else {
          $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorLightBlue);
        }
      }
    }
  }
};

const placeShipOnBoard = (shipLength, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell, shipClass) => {
  if (shipOrientation === 'horizontal') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      return;
    }

    // stops player from placing ships outside of boundaries
    if (columnIndex + shipLength > boardSize) {
      return //"invalid ship position";
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${letters[columnIndex + i]}${row}`).addClass(`p${player}-ship-${currentShip - 1}-${i + 1}`)
        $(`.p${board}-${letters[columnIndex + i]}${row}`).css('background-color', colorBlue);    //  blue if in bounds
        socket.emit('store coordinates', {
          cell: `p${board}-${letters[columnIndex + i]}${row}`,
          ship: `p${board}-ship-${currentShip - 1}-${i + 1}`,
        });
      }
    }
  }

  if (shipOrientation === 'vertical') {
    // stops player from placing overlapping ships
    if (checkForPlacedShip(shipLength, board, columnIndex, row, shipOrientation, column)) {
      return;
    }

    // stops player from placing ships outside of boundaries
    if (Number(row) + shipLength - 1 > boardSize) {
      return;
    } else {
      for (let i = 0; i < shipLength; i++) {
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).addClass(`p${player}-ship-${currentShip - 1}-${i + 1}`)
        $(`.p${board}-${column}${(Number(row) + i).toString()}`).css('background-color', colorBlue);  // blue if in bounds
        socket.emit('store coordinates', {
          cell: `p${board}-${column}${(Number(row) + i).toString()}`,
          ship: `p${board}-ship-${currentShip - 1}-${i + 1}`,
        });
      }
    }
  }
  socket.emit('increment currentShip count', cell);
}

// givesaccess to info on player and event triggerer
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

// performs 'theFunction' on given arguments
const performFunction = (theFunction, shipClass, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell) => {
  if (player !== Number(board)) {
    return;
  }
  if (shipClass === 'carrier') {
    theFunction(5, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  }
  if (shipClass === 'battleship') {
    theFunction(4, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  }
  if (shipClass === 'cruiser') {
    theFunction(3, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  }
  if (shipClass === 'submarine') {
    theFunction(3, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  }
  if (shipClass === 'destroyer') {
    theFunction(2, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  }
}

const allowPlayerToPlaceShips = ({player, shipsNotPlaced, currentShip, boardSize, shipOrientation}) => {
  // clears previous event listeners before adding the updated event listeners
  $('body').off('keypress');
  $(`.board-p${player}`).children().children('.board-cell').off('mouseover mouseleave click');
  
  if (currentShip > shipsNotPlaced.length) {
    return socket.emit('player ready', player);
  }

  // Rotate ship if press 'r' key;
  $(`body`).on('keypress', (event) => {
    if (event.which == 114 && event.target.nodeName.toLowerCase() !== 'input') {
      socket.emit('rotate piece');
    }
  });

  // Outlines ship on board
  $(`.board-p${player}`).children().children('.board-cell').on('mouseover', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);
    
    performFunction(outlineShipOnBoard, shipClass, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  });

  // Unoutline ship on board
  $(`.board-p${player}`).children().children('.board-cell').on('mouseleave', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);

    performFunction(unOutlineShipOnBoard, shipClass, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  });

  // Place ship onto board
  $(`.board-p${player}`).children().children('.board-cell').on('click', (event) => {
    const { cell, board, column, row, shipClass, columnIndex } = getEventDetails(event, shipsNotPlaced, currentShip);

    performFunction(placeShipOnBoard, shipClass, boardSize, shipOrientation, columnIndex, board, row, column, player, currentShip, cell);
  })
}