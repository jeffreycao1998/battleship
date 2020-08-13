// randomly chooses which player starts
const randomPlayerStarts = (io, players) => {
  const randNum = Math.round(Math.random());

  players[randNum].data.turnToShoot = true;

  io.emit('turn', randNum + 1);
};

// shooting all your shots makes it the other player's turn to shoot
const changePlayerTurn = (socket) => {
  players[0].data.turnToShoot = !players[0].data.turnToShoot;
  players[1].data.turnToShoot = !players[1].data.turnToShoot;
  socket.data.shotsTaken = 0;

  io.emit('turn', players[0].data.turnToShoot ? 1 : 2);
}

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
  }
  setNumOfTargets(socket);
}

const incrementCurrentShip = (io, socket, players, player) => {
  if (players[0].data.currentShip > players[0].data.currentShip && players[1].data.currentShip > players[1].data.currentShip) {
    io.emit('start attack');
  }
  
  socket.data.currentShip += 1;
  io.emit('update current ship', socket.data);
  io.to(players[player - 1].id).emit('place ship', socket.data);
}


module.exports = {
  setNumOfTargets,
  setInitialData,
  incrementCurrentShip,
  randomPlayerStarts,
  changePlayerTurn,
}