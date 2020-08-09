const makeFullscreen = () => {
  $('#game-page').css("display", "flex");
  // document.documentElement.requestFullscreen().catch((err) => {
  //   console.log(err);
  // });
}

const changeTurn = (player) => {
  const nameP1 = $('#name-p1').text().replace(' (TURN)', '');
  const nameP2 = $('#name-p2').text().replace(' (TURN)', '');

  if (player == 1) {
    $('#name-p1').text(nameP1 + ' (TURN)');
    $('#name-p2').text(nameP2);
  } else {
    $('#name-p2').text(nameP2 + ' (TURN)');
    $('#name-p1').text(nameP1);
  }
};

const addTextToLog = (message, player, name) => {
  const previousLog = $('.log-container').html();
  $('.log-container').html(previousLog + `<p class="p${player}">${name.toUpperCase()} ${message}</p>`);
  $('.log-container').scrollTop($('.log-container').height())
};

const updatePlayerName = ({player, name}) => {
  if (!name) {
    $(`#name-p${player}`).text('Waiting for player...');
  }
  $(`#name-p${player}`).text(name);
};

const clearBoard = () => {
  $('.board-cell').each(function() {
    if ($(this).attr('class').split(' ')[2]) {
      $(this).css('background-color', colorBlue)
    } else {
      $(this).css('background-color', colorLightBlue)
    }
  })
}

const showWinScreen = (player) => {
  $('.board-cell').unbind();
  $('#winning-screen').css('display', 'flex');
  $('.winning-text').text(`${player.toUpperCase()} WON!`)
};

const addEventListenerForSettings = (property) => {
  const numCarriers = Number($('.carrier-nums-num').text());
  const numBattleships = Number($('.battleship-nums-num').text());
  const numCruisers = Number($('.cruiser-nums-num').text());
  const numSubmarines = Number($('.submarine-nums-num').text());
  const numDestroyers = Number($('.destroyer-nums-num').text());
  let max;

  if (property === 'shots-per-turn') {
    max = 100;
  } else if (property === 'board-size') {
    max = 26;
  } else if (property === 'carrier') {
    max = 5;
  } else if (property === 'battleship') {
    max = 5;
  } else if (property === 'cruiser') {
    max = 5;
  } else if (property === 'submarine') {
    max = 5;
  } else if (property === 'destroyer') {
    max = 5;
  }

  $(`.${property}-nums-dec`).on('click', () => {
    let num = $(`.${property}-nums-num`).text();
    console.log(num)
    if (num > max) {
      $(`.${property}-nums-num`).text(`${Number(num) - 1}`)
    }
  });

  $(`.${property}-nums-inc`).on('click', () => {
    let num = $(`.${property}-nums-num`).text();
    console.log(num)
    if (num < max) {  // 3 is max amount of that ship
      $(`.${property}-nums-num`).text(`${Number(num) + 1}`)
    }
  });
};

const getHowManyOfEachShip = () => {
  const result = [];
  const numCarriers = Number($('.carrier-nums-num').text());
  const numBattleships = Number($('.battleship-nums-num').text());
  const numCruisers = Number($('.cruiser-nums-num').text());
  const numSubmarines = Number($('.submarine-nums-num').text());
  const numDestroyers = Number($('.destroyer-nums-num').text());

  for (let i = 0; i < numCarriers; i++) {
    result.push('carrier');
  }
  for (let i = 0; i < numBattleships; i++) {
    result.push('battleship');
  }
  for (let i = 0; i < numCruisers; i++) {
    result.push('cruiser');
  }
  for (let i = 0; i < numSubmarines; i++) {
    result.push('submarine');
  }
  for (let i = 0; i < numDestroyers; i++) {
    result.push('destroyer');
  }
  return result;
};

// button event handlers
const addButtonEventHandlers = () => {
  $('.concede').on('click', () => {
    socket.emit('concede');
  });

  $('#btn-friend').on('click', () => {
    const inputAlias = $('#input-alias').val();
  
    if (!inputAlias || inputAlias.length < 3 || inputAlias.length > 14) {
      return $('.name-error-message').text('Stop! Name must be 3-14 characters in length')
    }
    socket.emit('name', inputAlias);
    makeFullscreen()
  });
  
  $('#btn-computer').on('click', () => {
    makeFullscreen();
  });

  $('#rematch').on('click', () => {
    // hides win screen
    $('#winning-screen').css('display', 'none');

    // removes all event listeners on board
    $('.board-cell').off('mouseover mouseleave click keypress');

    socket.emit('rematch');
  });

  //--- SETTINGS STUFF ---//
  $('.settings').on('click', () => {
    $('#settings-screen').css('display', 'flex');
  });

  $('#apply-settings').on('click', () => {
    $('#settings-screen').css('display', 'none');

    const newShipSettings = getHowManyOfEachShip();
    const shotsPerTurn = Number($('.shots-per-turn-nums-num').text());
    const boardSize = Number($('.board-size-nums-num').text());

    const newSettings = {
      shotsPerTurn,
      boardSize,
      shipsNotPlaced: newShipSettings,
    }
    socket.emit('apply settings', newSettings);
  });

  addEventListenerForSettings('shots-per-turn');
  addEventListenerForSettings('board-size');
  addEventListenerForSettings('carrier');
  addEventListenerForSettings('battleship');
  addEventListenerForSettings('cruiser');
  addEventListenerForSettings('submarine');
  addEventListenerForSettings('destroyer');
};