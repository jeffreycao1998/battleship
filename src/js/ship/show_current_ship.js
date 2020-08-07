const colorCurrentShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 1}`).css('background-color', colorRoyalBlue);
};
const unColorPlacedShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 2}`).css('background-color', colorLightBlue);
};