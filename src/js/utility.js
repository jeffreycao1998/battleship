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


// button event handlers
const addButtonEventHandlers = () => {
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

  $('#rematch').on('click', () => {
    // resets board to default state
    $('.boardCell').each(function() {
      const defaultClasses = $(this).attr('class').split(' ').slice(0, 2);
      $(this).removeClass('');
      $(this).addClass(defaultClasses[0]);
      $(this).addClass(defaultClasses[1]);
      $(this).css('background-color', colorLightBlue);
    });

    $('.pieceCell').each(function() {
      const defaultClasses = $(this).attr('class').split(' ').slice(0, 2);
      $(this).removeClass('');
      $(this).addClass(defaultClasses[0]);
      $(this).addClass(defaultClasses[1]);
      $(this).css('background-color', colorLightBlue);
    })
  });
};