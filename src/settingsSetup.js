// calculates total number of cells the battleships take up
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
    left: false,
    ai: false,
  }
  setNumOfTargets(socket);
}

const changeSettings = (players, newSettings) => {
  for (let property in newSettings) {
    players[0].data[property] = newSettings[property];
    players[1].data[property] = newSettings[property];
  }
};

module.exports = {
  setNumOfTargets,
  setInitialData,
  changeSettings,
}