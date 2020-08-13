const resetData = (players, shipCoordinates) => {
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
}

const resetBoard = (io, players) => {
  io.emit('update view', players[0].data);
  io.emit('update view', players[1].data);
  
  io.to(players[0].id).emit('players place ships', players[0].data);
  io.to(players[1].id).emit('players place ships', players[1].data);
}

module.exports = {
  resetData,
  resetBoard,
}