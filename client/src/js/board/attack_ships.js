const hitShip = ({ship, cell}) => {
  $(`.${ship}`).css('background-color', colorHitShip);
  $(`.${cell}`).css('background-color', colorHitShip);
  $(`.${cell}`).addClass('hit');
};

const missShip = (cell) => {
  $(`.${cell}`).css('background-color', colorMissShip);
  $(`.${cell}`).addClass('miss');
};

const allowPlayersToAttack = ({ player }) => {
  $('.board-cell').unbind();
  $('.board-cell').on('mouseenter', (event) => {
    const target = $(event.target);
    const cell = target.attr('class').split(' ')[1];
    const cellBoard = cell[1];

    if (player == 1 && cellBoard == 2 && target.css('background-color') === colorLightBlue) {
      target.css('background-color', colorBoardHover);
    }
    if (player == 2 && cellBoard == 1 && target.css('background-color') === colorLightBlue) {
      target.css('background-color', colorBoardHover);
    }
  });

  $('.board-cell').on('mouseleave', event => {
    const target = $(event.target);

    if (target.css('background-color') === colorBoardHover) {
      target.css('background-color', colorLightBlue);
    };
  });

  $('.board-cell').on('click', (event) => {
    const target = $(event.target);
    const cellClicked = target.attr('class').split(' ')[1];

    if (target.hasClass('hit') || target.hasClass('miss')) return;
    socket.emit('shoot', cellClicked);
  });
};