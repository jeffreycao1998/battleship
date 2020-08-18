require('dotenv').config();
const io = require('socket.io')(process.env.PORT || 8000);
const express = require('express');
const http = require('http');
const server = http.Server(app);
const { Pool, Client } = require('pg');

const { setNumOfTargets, setInitialData, changeSettings } = require('./src/settingsSetup');
const { setTurn, incrementCurrentShip } = require('./src/shipSetup');
const { handleShot, incrementLose } = require('./src/handleShot');
const { resetData, resetBoard } = require('./src/reset');
const { setUpComputerBoard, computerAttack } = require('./src/computer');
const { storeGameData, getStats, getReplays } = require('./src/dbCRUD');


const app = express();
app.use(express.static('client'));

server.listen(process.env.PORT, () => {
  console.log('listening...')
});

// connect to postgres server

const client = new Client({
  connectionString: process.env.PGCONNECTIONSTRING,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect()

// init global variables
const players = [];
const shipCoordinates = {
  p1: {},
  p2: {},
}
const computer = {};
let whoseTurn = 'random'; // valid values are 'random', 'p1', 'p2'
let moveSequence = [];

io.on('connect', socket => {
  getStats(client, 'easy', (data) => {
    io.to(socket.id).emit('load data', {data, difficulty: 'easy'});
  });

  getStats(client, 'medium', (data) => {
    io.to(socket.id).emit('load data', {data, difficulty: 'medium'});
  });

  getStats(client, 'hard', (data) => {
    io.to(socket.id).emit('load data', {data, difficulty: 'hard'});
  });

  getReplays(client, (data) => {
    io.to(socket.id).emit('load replays', data);
  });

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
          return;

        } else if (players[1].data.ai) {
          players[1] = socket;
          setInitialData(socket, name, 2);
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

    io.emit('log move', {
      name,
      player: 'game',
      message: 'connected'
    });

    shipCoordinates.p2 = setUpComputerBoard(io, players[1].data);
    players[1].data.ready = true;
    players[1].data.cellsAttacked = {};
    players[1].data.ai = true;
    players[1].data.difficulty = 'easy';
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

    if (players[0].data.ready && players[1].data.ready) {
      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: "you can't change the settings in the middle of a game!"
      });
      return;
    }

    if (players[1].data.ai) {
      io.emit('log move', {
        player: '2',
        name: 'Deep Blue',
        message: `used UNO REVERSE!, couldn't change settings...`
      });

      io.emit('log move', {
        player: '2',
        name: 'Deep Blue',
        message: `try changing the settings in the middle of a game again, see what happens.`
      });
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

  socket.on('apply ai difficulty settings', difficulty => {
    if (!players[1].data.ai) {
      return;
    }

    if (players[0].data.ready && players[1].data.ready) {
      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: "you can't change the settings in the middle of a game!"
      });
      return;
    }
    
    players[1].data.difficulty = difficulty;
    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `changed AI difficulty to ${difficulty}`
    });
  });

  socket.on('rematch', name => {
    if (socket.data.player !== 1 && socket.data.player !== 2) {
      return;
    }

    // reset players shot attemps/turns and stuff to default
    resetData(players, shipCoordinates);
    resetBoard(io, players);
    socket.data.wantRematch = true;

    io.emit('log move', {
      player: 'game',
      name: socket.data.name,
      message: `wants a rematch!`
    });

    if (players[1].data.ai) {
      shipCoordinates.p2 = setUpComputerBoard(io, players[1].data);
      players[1].data.ready = true;
      players[1].data.cellsAttacked = {};
      players[1].data.wantRematch = true;
    }
  });

  socket.on('save replay', () => {
    if (moveSequence.length === 0 || players[1].data.ai) {
      return;
    }

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

    if (players[0].data.targetsHit === players[0].data.targets) {
      gamePlayers.p1.result = 'win';
    } else {
      gamePlayers.p2.result = 'win';
    }

    storeGameData(client, JSON.stringify(moveSequence), JSON.stringify(gamePlayers), socket.data.boardSize);

    moveSequence = [];
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
    const readyP2 = players[1].data.ready;
    const rematchP1 = players[0].data.wantRematch;
    const rematchP2 = players[1].data.wantRematch;

    if (readyP1 && readyP2) {
      setTurn(whoseTurn, io, players);
      io.to(players[0].id).emit('start attack', players[0].data);
      io.to(players[1].id).emit('start attack', players[1].data);
    }

    if (rematchP1 && rematchP2) {
      io.emit('log move', {
        player: 'game',
        name: socket.data.name,
        message: 'finished placing ships'
      });
    }

    if (players[1].data.ai && players[1].data.turnToShoot) {

      for (let i = 0; i < players[1].data.shotsPerTurn; i++) {
        const cell = computerAttack(players[1].data, shipCoordinates.p1);
        handleShot(1, shipCoordinates, cell, io, players[1], players, client);
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
      handleShot(boardClicked, shipCoordinates, cell, io, socket, players, client, moveSequence);
    }

    // Player 2
    if (boardClicked == 1 && player == 2) {
      handleShot(boardClicked, shipCoordinates, cell, io, socket, players, client, moveSequence);
    }

    // Computer
    if (players[1].data.ai && players[1].data.turnToShoot) {
      for (let i = 0; i < players[1].data.shotsPerTurn; i++) {
        const cell = computerAttack(players[1].data, shipCoordinates.p1);
        handleShot(1, shipCoordinates, cell, io, players[1], players, client);
        if (players[1].data.targetsHit === players[1].data.targets) {
          return;
        }
      }
    };
  });

  socket.on('concede', (player) => {
    if (!players[0].data.ready || !players[1].data.ready) return;

    if (players[1].data.ai) {
      incrementLose(client, players[0].data.name, `${players[1].data.difficulty}stats`)
    }

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