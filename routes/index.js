var express = require('express');
var router = express.Router();

var mysql = require('mysql');
/* GET home page. */
router.get('/index', function (req, res, next) {
  const connection = mysql.createConnection(process.env.DB_STRING);
  connection.connect();
  connection.query(`select * from realTargeta where ID = 1997`,
    function (err, rows, fields) {
      if (err) {
        console.log(err)
        connection.end();
        res.render('error', {
          message:err
        });
      } else {
        var informacionTarjeta = rows[0];
        connection.end();
        res.render('index', {
          helpers: {
            likeTotal: function () {
              var likes = informacionTarjeta.meGusta;
              return likes;
            }
          },
          tarjeta: informacionTarjeta
        });
      }
    });
});
module.exports = router;