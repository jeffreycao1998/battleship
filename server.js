const io = require('socket.io')(8000);

const setInitialData = (socket, name, player) => {
  socket.data = {
    player,
    name,
    shipsNotPlaced: ['carrier', 'battleship', 'cruiser', 'submarine', 'destroyer'],
    currentShip: 1,
    shipOrientation: 'horizontal',
    boardSize: 10,
    shotsPerTurn: 1,
  }
}

const players = [];

io.on('connect', socket => {

  socket.on('name', name => {
    if (players.length === 0) {
      setInitialData(socket, name, 1);
      players.push(socket);

      io.emit('player joined', socket.data);
      io.to(players[0].id).emit('load-hover-effects', socket.data);
    } else if (players.length === 1) {
      setInitialData(socket, name, 2);
      players.push(socket);


      io.emit('player joined', socket.data);
      io.emit('player joined', players[0].data);
      io.to(players[0].id).emit('load-hover-effects', players[0].data);
      io.to(players[1].id).emit('load-hover-effects', players[1].data);
    }
  });

  socket.on('place ship', data => {
    // console.log(socket.data);
    // console.log(data);
    const boardClicked = Number(data[1]);
    const player = socket.data.player;

    if (player === 1 && boardClicked === 1) {
      if (socket.data.currentShip > socket.data.shipsNotPlaced.length) {
        return console.log(`Player ${socket.data.player} ships ready for battle!`)
      }
      socket.data.currentShip += 1;
      io.emit('place ship', socket.data);
    }
    if (player === 2 && boardClicked === 2) {
      if (socket.data.currentShip > socket.data.shipsNotPlaced.length) {
        return console.log(`Player ${socket.data.player} ships ready for battle!`)
      }
      socket.data.currentShip += 1;
      io.emit('place ship', socket.data);
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



});


const unlockButtons = (currentUser) => {

}