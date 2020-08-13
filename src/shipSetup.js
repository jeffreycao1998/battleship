// randomly chooses which player starts
const randomPlayerStarts = (io, players) => {
  const randNum = Math.round(Math.random());

  players[randNum].data.turnToShoot = true;

  io.emit('turn', randNum + 1);
};

// allows the specified player to start firing
const setTurn = (whoseTurn, io, players) => {
  if (whoseTurn === 'random') {
    randomPlayerStarts(io, players);
  } else if (whoseTurn === 'p1') {
    players[0].data.turnToShoot = true;
    io.emit('turn', 1);
  } else if (whoseTurn === 'p2') {
    players[1].data.turnToShoot = true;
    io.emit('turn', 2);
  }
};

const incrementCurrentShip = (io, socket, players, player) => {
  socket.data.currentShip += 1;
  io.emit('update current ship', socket.data);
  io.to(players[player - 1].id).emit('place ship', socket.data);
}

module.exports = {
  setTurn,
  incrementCurrentShip,
}