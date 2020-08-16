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
  // $('.log-container').scrollTop($('.log-container').height())
  $('.log-container').scrollTop(35 * $('.log-container').children().length);
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
  let min;
  let max;

  if (property === 'shots-per-turn') {
    min = 1;
  } else if (property === 'board-size') {
    min = 2;
  } else if (property === 'carrier') {
    min = 0;
  } else if (property === 'battleship') {
    min = 0;
  } else if (property === 'cruiser') {
    min = 0;
  } else if (property === 'submarine') {
    min = 0;
  } else if (property === 'destroyer') {
    min = 0;
  }

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
    if (num > min) {
      $(`.${property}-nums-num`).text(`${Number(num) - 1}`)
    }
  });

  $(`.${property}-nums-inc`).on('click', () => {
    let num = $(`.${property}-nums-num`).text();
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
    const inputAlias = $('#input-alias').val().trim();
  
    if (!inputAlias || inputAlias.length < 3 || inputAlias.length > 14) {
      return $('.name-error-message').text('Stop! Name must be 3-14 characters in length')
    }
    socket.emit('play friend', inputAlias);
    makeFullscreen()
  });
  
  $('#btn-computer').on('click', () => {
    const inputAlias = $('#input-alias').val();

    if (!inputAlias || inputAlias.length < 3 || inputAlias.length > 14) {
      return $('.name-error-message').text('Stop! Name must be 3-14 characters in length')
    }
    socket.emit('play computer', inputAlias);
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

  $('#settings-normal-tab').on('click', () => {
    $('#settings-normal-tab').css('background-color', '#4444ac')
    $('#settings-computer-tab').css('background-color', 'rgb(61, 61, 61)')
    $('.computer-settings').css('display', 'none');
    $('.normal-settings').css('display', 'block');
  });

  $('#settings-computer-tab').on('click', () => {
    $('#settings-computer-tab').css('background-color', '#4444ac')
    $('#settings-normal-tab').css('background-color', 'rgb(61, 61, 61)')
    $('.normal-settings').css('display', 'none');
    $('.computer-settings').css('display', 'block');
  });

  $('#apply-settings').on('click', () => {
    $('#settings-screen').css('display', 'none');

    const newShipSettings = getHowManyOfEachShip();
    const shotsPerTurn = Number($('.shots-per-turn-nums-num').text());
    const boardSize = Number($('.board-size-nums-num').text());
    const firstShot = $("input[name='first-shot']:checked").val();

    const newSettings = {
      shotsPerTurn,
      boardSize,
      shipsNotPlaced: [...newShipSettings],
    }
    socket.emit('apply settings', {firstShot, newSettings});
  });

  $('#apply-settings-difficulty').on('click', () => {
    $('#settings-screen').css('display', 'none');

    const newDifficulty = $("input[name='difficulty']:checked").val();

    socket.emit('apply ai difficulty settings', newDifficulty);
  });

  $('.close-settings').on('click', () => {
    $('#settings-screen').css('display', 'none');
  });


  //--- LEADERBOARD TABS ---//
  $('#easy-tab').on('click', () => {
    const tab = $('#easy-tab');
    const allTabs = $('.leaderboard-tab');
    const replays = $('.replays');
    const leaderboard = $('.leaderboard');

    // set a "loading data" image
    // get info from DB
    // replace image with data

    allTabs.css('background-color', '#3d3d3d');
    tab.css('background-color', '#4444ac');

    replays.css('display','none');
    leaderboard.css('display', 'block');
  });

  $('#medium-tab').on('click', () => {
    const tab = $('#medium-tab');
    const allTabs = $('.leaderboard-tab');
    const replays = $('.replays');
    const leaderboard = $('.leaderboard');

    // set a "loading data" image
    // get info from DB
    // replace image with data

    allTabs.css('background-color', '#3d3d3d');
    tab.css('background-color', '#4444ac');

    replays.css('display','none');
    leaderboard.css('display', 'block');
  });

  $('#hard-tab').on('click', () => {
    const tab = $('#hard-tab');
    const allTabs = $('.leaderboard-tab');
    const replays = $('.replays');
    const leaderboard = $('.leaderboard');

    // set a "loading data" image
    // get info from DB
    // replace image with data

    allTabs.css('background-color', '#3d3d3d');
    tab.css('background-color', '#4444ac');

    replays.css('display','none');
    leaderboard.css('display', 'block');
  });

  $('#replays-tab').on('click', () => {
    const tab = $('#replays-tab');
    const allTabs = $('.leaderboard-tab');
    const replays = $('.replays');
    const leaderboard = $('.leaderboard');

    // set a "loading data" image
    // get info from DB
    // replace image with data

    allTabs.css('background-color', '#3d3d3d');
    tab.css('background-color', '#4444ac');

    leaderboard.css('display', 'none');
    replays.css('display','block');
  });

  addEventListenerForSettings('shots-per-turn');
  addEventListenerForSettings('board-size');
  addEventListenerForSettings('carrier');
  addEventListenerForSettings('battleship');
  addEventListenerForSettings('cruiser');
  addEventListenerForSettings('submarine');
  addEventListenerForSettings('destroyer');
};

addButtonEventHandlers();