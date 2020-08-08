const socket = io('http://localhost:8000');

// Client Event Handlers

// When game start button is clicked, checks if username entered is 3-14 characters long
$('#btn-friend').on('click', () => {
  const inputAlias = $('#input-alias').val();

  if (!inputAlias || inputAlias.length < 3 || inputAlias.length > 14) {
    return $('.name-error-message').text('Stop! Name must be 3-14 characters in length')
  }
  socket.emit('name', inputAlias);
  makeFullscreen()
});

$('#btn-computer').on('click',() => {
  makeFullscreen();
});

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

