# BATTLESHIP

## Live Server

[Battleship](https://dashboard.heroku.com/apps/battleship-multiplayer-jeff/settings)

# ABOUT

Having a dispute with a co-worker? Instead of taking it to the parking lot like the old days let me suggest a new solution. Settle things with an intense game of battleship. The first two players to connect will battle each other, all the rest will become spectators. 

The first phase of the game allows players to strategically place their ships. Once both players are ready, the 'shooting phase' will commence. The first player is chosen at random (default setting). Settings can only be changed before the 'shooting phase' begings. After players have both placed their ships down, settings can not be altered.
Default settings that can be manipulated include:

  - player with first shot (random)
  - shots per turn (3)
  - board size (10x10)
  - quantity of each ship (1 of each)
  - computer difficulty (easy and only if facing computer)
  
Upon victory, 2 dancing bears will be displayed next to your name colored with rainbow and fun. From this winning screen you will also be able to save a replay of the game. As of right now saving a replay will allow your accuracy in the 'replays' tab at the top right (full game step through to be implemented in the future). 

## CONTROLS

Click 'R' key to rotate your pieces when placing battleship

# Technology Used

- NodeJS
- Express
- Socket.io
- PostgreSQL
