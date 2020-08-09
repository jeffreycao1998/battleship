const io = require('socket.io')(8000);

const randomPlayerStarts = (io) => {
  const randNum = Math.round(Math.random());

  players[randNum].data.turnToShoot = true;

  io.emit('turn', randNum + 1);
};

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

const incrementCurrentShip = (socket, players, player) => {
  if (players[0].data.currentShip > players[0].data.currentShip && players[1].data.currentShip > players[1].data.currentShip) {
    io.emit('start attack');
  }
  
  socket.data.currentShip += 1;
  io.emit('update current ship', socket.data);
  io.to(players[player - 1].id).emit('place ship', socket.data);

  
}

const changePlayerTurn = (socket) => {
  players[0].data.turnToShoot = !players[0].data.turnToShoot;
  players[1].data.turnToShoot = !players[1].data.turnToShoot;
  socket.data.shotsTaken = 0;

  io.emit('turn', players[0].data.turnToShoot ? 1 : 2);
}

const players = [];
const shipCoordinates = {
  p1: {},
  p2: {},
}

io.on('connect', socket => {

  socket.on('name', name => {
    if (players.length === 0) {
      setInitialData(socket, name, 1);
      players.push(socket);

      io.emit('update view', socket.data);
      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: 'connected'
      });
    } else if (players.length === 1) {
      setInitialData(socket, name, 2);
      players.push(socket);

      io.emit('update view', socket.data);
      io.emit('update view', players[0].data);

      io.to(players[0].id).emit('players place ships', players[0].data);
      io.to(players[1].id).emit('players place ships', players[1].data);

      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: 'connected'
      });
    }
  });

  socket.on('apply settings', ({ boardSize, shotsPerTurn, shipsNotPlaced }) => {
    if (!players[1]) {
      return;
    }
    
    // new settings
    players[0].data.boardSize = boardSize;
    players[0].data.shotsPerTurn = shotsPerTurn;
    players[0].data.shipsNotPlaced = shipsNotPlaced;
    
    players[1].data.boardSize = boardSize;
    players[1].data.shotsPerTurn = shotsPerTurn;
    players[1].data.shipsNotPlaced = shipsNotPlaced;

    // reset to default
    players[0].data.targetsHit = 0;
    players[0].data.currentShip = 1;
    players[0].data.turnToShoot = false;
    players[0].data.shotsTaken = 0;
    players[0].data.ready = false;
    shipCoordinates.p1 = {};

    players[1].data.targetsHit = 0;
    players[1].data.currentShip = 1;
    players[1].data.turnToShoot = false;
    players[1].data.shotsTaken = 0;
    players[1].data.ready = false;
    shipCoordinates.p2 = {};

    setNumOfTargets(players[0]);
    setNumOfTargets(players[1]);

    io.emit('update view', players[0].data);
    io.emit('update view', players[1].data);
    
    io.to(players[0].id).emit('players place ships',  players[0].data);
    io.to(players[1].id).emit('players place ships', players[1].data);

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `changed the settings`
    });
  });

  socket.on('rematch', name => {
    players[0].data.targetsHit = 0;
    players[0].data.currentShip = 1;
    players[0].data.turnToShoot = false;
    players[0].data.shotsTaken = 0;
    players[0].data.ready = false;
    shipCoordinates.p1 = {};

    players[1].data.targetsHit = 0;
    players[1].data.currentShip = 1;
    players[1].data.turnToShoot = false;
    players[1].data.shotsTaken = 0;
    players[1].data.ready = false;
    shipCoordinates.p1 = {};

    io.emit('update view', players[0].data);
    io.emit('update view', players[1].data);
    
    io.to(players[0].id).emit('players place ships', players[0].data);
    io.to(players[1].id).emit('players place ships', players[1].data);

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `wants a rematch!`
    });
  });

  socket.on('rotate piece', () => {
    if (socket.data.shipOrientation === 'horizontal') {
      socket.data.shipOrientation = 'vertical';
    } else {
      socket.data.shipOrientation = 'horizontal';
    }
    io.to(players[0].id).emit('players place ships', players[0].data);
    io.to(players[1].id).emit('players place ships', players[1].data);
    io.emit('clear board');
  });

  socket.on('increment currentShip count', cell => {
    const boardClicked = Number(cell[1]);
    const player = socket.data.player;

    if (player === 1 && boardClicked === 1) {
      incrementCurrentShip(socket, players, player);
    }
    if (player === 2 && boardClicked === 2) {
      incrementCurrentShip(socket, players, player);
    }
  });

  socket.on('store coordinates', ({cell, ship}) => {
    if (cell[1] == 1) {
      shipCoordinates.p1[cell] = ship;
    }
    if (cell[1] == 2) {
      shipCoordinates.p2[cell] = ship;
    }
  });

  socket.on('player ready', data => {
    socket.data.ready = true;
    if (players[0].data.ready && players[1].data.ready) {
      io.emit('start attack');

      randomPlayerStarts(io);
    }
    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: 'finished placing ships'
    });
  });

  socket.on('shoot', cell => {
    const boardClicked = cell[1];
    const player = socket.data.player;

    if (boardClicked == 1 && player == 2) {
      if (!socket.data.turnToShoot) {
        return;
      }
      socket.data.shotsTaken += 1;

      if (shipCoordinates.p1.hasOwnProperty(cell)) {
        const ship = shipCoordinates.p1[cell];
        socket.data.targetsHit += 1;
        io.emit('hit ship', { ship, cell });
        io.emit('log move', {
          player: socket.data.player,
          name: socket.data.name,
          message: `shot ${cell[3] + cell[4]}! HIT!`
        });

        if (socket.data.targetsHit === socket.data.targets) {
          shipCoordinates.p1 = {ready: false};
          shipCoordinates.p2 = {ready: false};
          io.emit('won game', socket.data.name);
          io.emit('log move', {
            player: 'won',
            name: socket.data.name,
            message: 'won the game!??!?!?'
          });
          return;
        }

        if (socket.data.shotsTaken >= socket.data.shotsPerTurn) {
          changePlayerTurn(socket);
          return;
        }
      } else {
        io.emit('miss ship', cell);
        io.emit('log move', {
          player: socket.data.player,
          name: socket.data.name,
          message: `shot ${cell[3] + cell[4]}! MISS :(`
        });

        if (socket.data.shotsTaken >= socket.data.shotsPerTurn) {
          changePlayerTurn(socket);
          return;
        }
      }
    }
    if (boardClicked == 2 && player == 1) {
      if (!socket.data.turnToShoot) {
        return;
      }
      if (socket.data.shotsTaken >= socket.data.shotsPerTurn) {
        players[0].data.turnToShoot = !players[0].data.turnToShoot;
        players[1].data.turnToShoot = !players[1].data.turnToShoot;
        socket.data.shotsTaken = 0;
        return;
      }
      socket.data.shotsTaken += 1;

      if (shipCoordinates.p2.hasOwnProperty(cell)) {
        const ship = shipCoordinates.p2[cell];
        socket.data.targetsHit += 1;
        io.emit('hit ship', { ship, cell });
        io.emit('log move', {
          player: socket.data.player,
          name: socket.data.name,
          message: `shot ${cell[3] + cell[4]}! HIT!`
        });

        if (socket.data.targetsHit === socket.data.targets) {
          shipCoordinates.p1 = {ready: false};
          shipCoordinates.p2 = {ready: false};
          io.emit('won game', socket.data.name);
          io.emit('log move', {
            player: 'won',
            name: socket.data.name,
            message: 'won the game!??!?!?'
          });
          return;
        }

        if (socket.data.shotsTaken >= socket.data.shotsPerTurn) {
          changePlayerTurn(socket);
          return;
        }
      } else {
        io.emit('miss ship', cell);
        io.emit('log move', {
          player: socket.data.player,
          name: socket.data.name,
          message: `shot ${cell[3] + cell[4]}! MISS :(`
        });

        if (socket.data.shotsTaken >= socket.data.shotsPerTurn) {
          changePlayerTurn(socket);
          return;
        }
      }
    }
  });

  socket.on('disconnect', () => {
    const i = players.indexOf(socket);
    if (i && i.data) {
      players.splice(i, 1);
      socket.data.name = undefined;
      io.emit('player disconnected', socket.data);
    }
  });

  socket.on('concede', (player) => {
    io.emit('won game', socket.data.player === 1 ? players[1].data.name : players[0].data.name);
    io.emit('log move', {
      player: 'won',
      name: socket.data.name,
      message: 'surrendered!??!?!?'
    });
  })

});


const unlockButtons = (currentUser) => {

}