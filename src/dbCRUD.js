
const incrementWin = (client, username, tableName) => {
  client.query(`SELECT username FROM public."${tableName}" WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (res.rows[0]) {
        client.query(`UPDATE public."${tableName}" SET win = win + 1 WHERE username = '${username}'`, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log('incremented win for', username);
          }
        });
      } else {
        client.query(`INSERT INTO public."${tableName}" (username, win, lose) VALUES ('${username}', 1, 0)`, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log(`Added ${username} to ${tableName}`);
          }
        });
      }
    }
  })
};

const incrementLose = (client, username, tableName) => {
  client.query(`SELECT username FROM public."${tableName}" WHERE username = '${username}'`, (err, res) => {
    if (err) {
      console.log(err.stack);
    } else {
      if (res.rows[0]) {
        client.query(`UPDATE public."${tableName}" SET lose = lose + 1 WHERE username = '${username}'`, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log('incremented lose for', username);
          }
        });
      } else {
        client.query(`INSERT INTO public."${tableName}" (username, win, lose) VALUES ('${username}', 0, 1)`, (err, res) => {
          if (err) {
            console.log(err.stack);
          } else {
            console.log(`Added ${username} to ${tableName}`);
          }
        });
      }
    }
  })
};

module.exports = {
  incrementWin,
  incrementLose,
}