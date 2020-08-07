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