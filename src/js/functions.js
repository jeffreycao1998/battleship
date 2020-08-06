const makeFullscreen = () => {
  $('#game-page').css("display", "flex");
  // document.documentElement.requestFullscreen().catch((err) => {
  //   console.log(err);
  // });
}

const updatePlayerName = ({player, name}) => {
  if (!name) {
    $(`#name-p${player}`).text('Waiting for player...');
  }
  $(`#name-p${player}`).text(name);
};

const applyBoardHoverEffects = (hoveredCell, currentPiece) => {
  switch (currentPiece) {
    case 'carrier':
      // hovering over the player's board should eluminate 5 board-cells
      return;
    case 'battleship':
      // hovering over the player's board should eluminate 4 board-cells
      return;
    case 'cruiser':
      // hovering over the player's board should eluminate 3 board-cells
      return;
    case 'submarine':
      // hovering over the player's board should eluminate 3 board-cells
      return;
    case 'destroyer':
      // hovering over the player's board should eluminate 2 board-cells
      return;
  }
}