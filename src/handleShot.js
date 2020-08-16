const { incrementWin, incrementLose, storeGameData } = require('./dbCRUD');

const changePlayerTurn = (io, socket, players) => {
  players[0].data.turnToShoot = !players[0].data.turnToShoot;
  players[1].data.turnToShoot = !players[1].data.turnToShoot;

  socket.data.shotsTaken = 0;

  io.emit('turn', players[0].data.turnToShoot ? 1 : 2);
}

const emitEndGame = (io, socket) => {
  io.emit('won game', socket.data.name);
  io.emit('log move', {
    player: 'won',
    name: socket.data.name,
    message: 'won the game!??!?!?'
  });
};

const emitShotHit = (io, socket, cell, ship) => {
  io.emit('hit ship', { ship, cell });
  io.emit('log move', {
    player: socket.data.player,
    name: socket.data.name,
    message: `shot at ${cell[3] + cell[4]}! HIT!`
  });
};

const emitShotMissed = (io, socket, cell) => {
  io.emit('miss ship', cell);
  io.emit('log move', {
    player: socket.data.player,
    name: socket.data.name,
    message: `shot at ${cell[3] + cell[4]}! MISS :(`
  });
};

const handleShot = (boardClicked, shipCoordinates, cell, io, socket, players, client, moveSequence) => {
  const shotsPerTurn = socket.data.shotsPerTurn;
  const totalTargets = socket.data.targets;

  socket.data.shotsTaken += 1;

  // checks if cell fired at contains a ship
  if (shipCoordinates[`p${boardClicked}`].hasOwnProperty(cell)) {
    const ship = shipCoordinates[`p${boardClicked}`][cell];
    socket.data.targetsHit += 1;
    
    emitShotHit(io, socket, cell, ship);

    if (!socket.data.ai) {
      moveSequence.push({ cell, result: 'hit'});
    }
    // ends game if all ships shot
    if (socket.data.targetsHit === totalTargets) {
      shipCoordinates.p1 = {ready: false};
      shipCoordinates.p2 = {ready: false};

      if (players[1].data.ai) {
        const difficulty = players[1].data.difficulty;

        if (socket.data.ai) {
          const loserName = players[0].data.name;

          incrementLose(client, players[0].data.name, `${difficulty}Stats`)
        } else {
          const winnerName = players[0].data.name;

          incrementWin(client, winnerName, `${difficulty}Stats`)
        }
      } else {
        const gamePlayers = { 
          p1: {
            name: players[0].data.name, 
            result: 'lose',
          },
          p2: {
            name: players[1].data.name,
            result: 'lose',
          },
        }

        if (socket.data.player === 1) {
          gamePlayers.p1.result = 'win';
        } else {
          gamePlayers.p2.result = 'win';
        }

        storeGameData(client, JSON.stringify(moveSequence), JSON.stringify(gamePlayers));
      }
        
      moveSequence = [];
      emitEndGame(io, socket);
    }

  } else {
    emitShotMissed(io, socket, cell);
    if (!socket.data.ai) {
      moveSequence.push({ cell, result: 'miss'});
    }
  }
  
  // change turns when all shots taken
  if (socket.data.shotsTaken >= shotsPerTurn) {
    changePlayerTurn(io, socket, players);
  }
};

module.exports = {
  handleShot,
}