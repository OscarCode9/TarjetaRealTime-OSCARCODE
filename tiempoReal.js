var express = require('express');
var mysql = require('mysql');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

function socketIO(socket) {
  socket.on('new-like', function (data) {
    console.log(process.env.DB_STRING);
    const connection = mysql.createConnection(process.env.DB_STRING);
    connection.connect();
    connection.query('update realTargeta set meGusta = ? where ID = ?;', [data.likes, data.ID],
      function (err, rows, fields) {
        if (!err) {
          connection.query('select meGusta from realTargeta where ID = ?;', [data.ID],
            function (err, rows, fields) {
              if (!err) {
                connection.end();
                var newLike = {
                  ID:data.ID,
                  likes: rows[0].meGusta
                };
                io.sockets.emit('newLike', newLike);
              } else {
                connection.end();
                console.log('Error al enviar los nuevos datos')
              }
            })
        } else {
          connection.end();
          console.log('Error while performing Query.' + err);
        }
      });

  });
  console.log('Un cliente conectado')
}

module.exports = {
  socketIO,
  app,
  server, 
  io,
  express
}