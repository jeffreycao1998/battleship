const setNumOfTargets = (socket) => {
  socket.data.targets = 0;
  socket.data.shipsNotPlaced.forEach( ship => {
    switch (ship) {
      case 'carrier':
        socket.data.targets += 5;
        break;
      case 'battleship':
        socket.data.targets += 4;
        break;
      case 'cruiser':
        socket.data.targets += 3;
        break;
      case 'submarine':
        socket.data.targets += 3;
        break;
      case 'destroyer':
        socket.data.targets += 2;
        break;
    }
  })
}

// sets player.data to default settings
const setInitialData = (socket, name, player) => {
  socket.data = {
    player,
    name,
    shipsNotPlaced: ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'],
    currentShip: 1,
    shipOrientation: 'horizontal',
    boardSize: 10,
    shotsPerTurn: 5,
    ready: false,
    targets: 0,
    targetsHit: 0,
    turnToShoot: false,
    shotsTaken: 0,
  }
  setNumOfTargets(socket);
}


module.exports = {
  setNumOfTargets,
  setInitialData,
}