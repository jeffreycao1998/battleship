const socket = io();

addButtonEventHandlers();

// Server Event Handlers
socket.on('update view', data => {
  updatePlayerName(data);
  createBoard(data);
  createShips(data);

  if (data.name === 'Deep Blue') return;
  colorCurrentShip(data);
});

socket.on('log move', ({player, name, message}) => {
  addTextToLog(message, player, name);
});

socket.on('update current ship', data => {
  colorCurrentShip(data);
  unColorPlacedShip(data);
});

socket.on('players place ships', data => {
  allowPlayerToPlaceShips(data);
});

socket.on('place ship', data => {
  colorCurrentShip(data);
  unColorPlacedShip(data);
  allowPlayerToPlaceShips(data);
});

socket.on('turn', player => {
  changeTurn(player);
});

socket.on('clear board', () => {
  clearBoard();
});

socket.on('start attack', data => {
  allowPlayersToAttack(data);
});

socket.on('hit ship', ship => {
  hitShip(ship);
});

socket.on('miss ship', cell => {
  missShip(cell);
});

socket.on('won game', player => {
  showWinScreen(player);
});

socket.on('load data', (data) => {
  setLeaderboardData(data)
});

socket.on('load replays', (data) => {
  setReplayHistory(data);
});

socket.on('player disconnected', data => {
  updatePlayerName(data);
});

