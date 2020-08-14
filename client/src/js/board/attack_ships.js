const hitShip = ({ship, cell}) => {
  $(`.${ship}`).css('background-color', colorHitShip);
  $(`.${cell}`).css('background-color', colorHitShip);
  $(`.${cell}`).addClass('hit');
};

const missShip = (cell) => {
  $(`.${cell}`).css('background-color', colorMissShip);
  $(`.${cell}`).addClass('miss');
};

const allowPlayersToAttack = () => {
  $('.board-cell').unbind();
  $('.board-cell').on('click', (event) => {
    const target = $(event.target);
    const cellClicked = target.attr('class').split(' ')[1];

    if (target.hasClass('hit') || target.hasClass('miss')) {
      console.log('this cell was already shot at');
      return;
    }
    socket.emit('shoot', cellClicked);
  });
};