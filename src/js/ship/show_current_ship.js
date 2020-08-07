const colorCurrentShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 1}`).css('background-color', 'rgb(68, 68, 172)');
};
const unColorPlacedShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 2}`).css('background-color', 'rgb(235, 235, 255)');
};