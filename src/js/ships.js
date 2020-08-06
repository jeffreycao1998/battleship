const createShips = ({player, shipsNotPlaced}) => {
  let shipHTML = '';

  for (let i = 0; i < shipsNotPlaced.length; i++) {
    switch (shipsNotPlaced[i]) {
      case 'carrier':
        shipHTML += 
        `<div class="ship p${player}-ship-${i}">
          <div class="piece-cell p${player}-ship-${i}-1"></div>
          <div class="piece-cell p${player}-ship-${i}-2"></div>
          <div class="piece-cell p${player}-ship-${i}-3"></div>
          <div class="piece-cell p${player}-ship-${i}-4"></div>
          <div class="piece-cell p${player}-ship-${i}-5"></div>
        </div>`
        break;
      case 'battleship':
        shipHTML +=  
        `<div class="ship p${player}-ship-${i}">
          <div class="piece-cell p${player}-ship-${i}-1"></div>
          <div class="piece-cell p${player}-ship-${i}-2"></div>
          <div class="piece-cell p${player}-ship-${i}-3"></div>
          <div class="piece-cell p${player}-ship-${i}-4"></div>
        </div>`
        break;
      case 'cruiser':
        shipHTML +=  
        `<div class="ship p${player}-ship-${i}">
          <div class="piece-cell p${player}-ship-${i}-1"></div>
          <div class="piece-cell p${player}-ship-${i}-2"></div>
          <div class="piece-cell p${player}-ship-${i}-3"></div>
        </div>`
        break;
      case 'submarine':
        shipHTML += 
        `<div class="ship p${player}-ship-${i}">
          <div class="piece-cell p${player}-ship-${i}-1"></div>
          <div class="piece-cell p${player}-ship-${i}-2"></div>
          <div class="piece-cell p${player}-ship-${i}-3"></div>
        </div>`
        break;
      case 'destroyer':
        shipHTML += 
        `<div class="ship p${player}-ship-${i}">
          <div class="piece-cell p${player}-ship-${i}-1"></div>
          <div class="piece-cell p${player}-ship-${i}-2"></div>
        </div>`
        break;
    }
  }
  $(`.all-pieces-p${player}`).html(shipHTML);
}

const colorCurrentShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 1}`).css('background-color', 'rgb(68, 68, 172)');
};
const unColorPlacedShip = ({player, currentShip}) => {
  $(`.p${player}-ship-${currentShip - 2}`).css('background-color', 'rgb(235, 235, 255)');
};