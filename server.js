const io = require('socket.io')(8000);

const { setNumOfTargets, setInitialData, changeSettings } = require('./src/settingsSetup');
const { setTurn, incrementCurrentShip } = require('./src/shipSetup');
const { handleShot } = require('./src/handleShot');
const { resetData, resetBoard } = require('./src/reset');

const { setUpComputerBoard, computerAttack } = require('./src/computer');

let whoseTurn = 'p2';
const players = [];
const shipCoordinates = {
  p1: {},
  p2: {},
}
const computer = {};

io.on('connect', socket => {
  
  socket.on('play friend', name => {
    if (players.length === 0) {
      players.push(socket);
      setInitialData(socket, name, 1);
      io.emit('update view', socket.data);

    } else if (players.length === 1) {
      players.push(socket);
      setInitialData(socket, name, 2);
      resetBoard(io, players);

    } else {
      // check for any previous players that disconnected
      for (let i = 0; i < players.length; i++) {
        if (players[i].data.left) {
          players[i] = socket;
          setInitialData(socket, name, i + 1);
          resetData(players, shipCoordinates);
          resetBoard(io, players);
        }
      }
    }

    io.emit('log move', {
      name,
      player: 'game',
      message: 'connected'
    });
  });

  socket.on('play computer', name => {
    players[0] = socket;
    players[1] = computer;

    setInitialData(socket, name, 1);
    setInitialData(computer, 'Deep Blue', 2);
    resetData(players, shipCoordinates);
    resetBoard(io, players);

    shipCoordinates.p2 = setUpComputerBoard(io, players[1].data);
    players[1].data.ready = true;

    io.emit('log move', {
      name,
      player: 'game',
      message: 'connected'
    });
  });

  socket.on('apply settings', ({ firstShot, newSettings }) => {
    // prevents player from changing settings until both players in game
    if (!players[1]) {
      io.emit('log move', {
        name: socket.data.name,
        player: 'game',
        message: 'please wait for player 2 to join'
      })
      return;
    }
    
    // set new settings
    changeSettings(players, newSettings);
    whoseTurn = firstShot;

    // reset players shot attemps/turns and stuff to default
    resetData(players, shipCoordinates);

    setNumOfTargets(players[0]);
    setNumOfTargets(players[1]);

    resetBoard(io, players);

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `changed the settings`
    });
  });

  socket.on('rematch', name => {
    // reset players shot attemps/turns and stuff to default
    resetData(players, shipCoordinates);
    resetBoard(io, players);

    if (players[1].data.name === 'Deep Blue') {
      shipCoordinates.p2 = setUpComputerBoard(io, players[1].data);
      players[1].data.ready = true;
      console.log('computer ready');
    }

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `wants a rematch!`
    });
  });

  // rotates ship
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

  // changes the ship that is being placed
  socket.on('increment currentShip count', cell => {
    const boardClicked = Number(cell[1]);
    const player = socket.data.player;

    if (player === 1 && boardClicked === 1) {
      incrementCurrentShip(io, socket, players, player);
    }
    if (player === 2 && boardClicked === 2) {
      incrementCurrentShip(io, socket, players, player);
    }
  });

  // stores the coordinates of all ships placed on board
  socket.on('store coordinates', ({cell, ship}) => {
    const player = cell[1];

    if (player == 1) {
      shipCoordinates.p1[cell] = ship;
    }
    if (player == 2) {
      shipCoordinates.p2[cell] = ship;
    }
  });

  // indicates that the player is ready to battle
  socket.on('player ready', data => {
    socket.data.ready = true;
    const readyP1 = players[0].data.ready;
    const readyP2 = players[1].data.ready

    console.log(shipCoordinates.p1);
    if (readyP1 && readyP2) {
      setTurn(whoseTurn, io, players);
      io.emit('start attack');
    }

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: 'finished placing ships'
    });

    if (players[1].data.name === 'Deep Blue' && players[1].data.turnToShoot) {

      for (let i = 0; i < players[1].data.shotsPerTurn; i++) {
        const cell = computerAttack(players[1].data);
        handleShot(1, shipCoordinates, cell, io, players[1], players);
      }
    };
  });

  // returns logic for each shot whether its a hit/miss
  socket.on('shoot', cell => {
    const boardClicked = cell[1];
    const player = socket.data.player;
    const turnToShoot = socket.data.turnToShoot;

    if (!turnToShoot) {
      return;
    }

    // Player 1
    if (boardClicked == 2 && player == 1) {
      handleShot(boardClicked, shipCoordinates, cell, io, socket, players);
    }

    // Player 2
    if (boardClicked == 1 && player == 2) {
      handleShot(boardClicked, shipCoordinates, cell, io, socket, players);
    }

    // Computer
    if (players[1].data.name === 'Deep Blue' && players[1].data.turnToShoot) {
      for (let i = 0; i < players[1].data.shotsPerTurn; i++) {
        const cell = computerAttack(players[1].data);
        handleShot(1, shipCoordinates, cell, io, players[1], players);
      }
    };
  });

  socket.on('concede', (player) => {
    io.emit('won game', socket.data.player === 1 ? players[1].data.name : players[0].data.name);
    io.emit('log move', {
      player: 'won',
      name: socket.data.name,
      message: 'surrendered!??!?!?'
    });
  })

  socket.on('disconnect', () => {
    const i = players.indexOf(socket);
    const player = players[i];

    if (player && players[i].data) {
      io.emit('won game', socket.data.player === 1 ? players[1].data.name : players[0].data.name);
      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: 'left the game...'
      });
    }
    
    if (socket.data) {
      socket.data.left = true;
      socket.data.name = undefined;
      io.emit('player disconnected', socket.data);
    }
  });

});