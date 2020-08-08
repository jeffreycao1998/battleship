const socket = io('http://localhost:8000');

addButtonEventHandlers();

// Server Event Handlers
socket.on('update view', data => {
  updatePlayerName(data);
  createBoard(data);
  createShips(data);
  colorCurrentShip(data);
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

socket.on('player disconnected', data => {
  updatePlayerName(data);
});

