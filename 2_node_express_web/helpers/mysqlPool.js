var config = require('config');
var mysql = require('mysql');

var pool  = mysql.createPool({
  host     : config.get('database.host'),
  user     : config.get('database.user'),
  password : config.get('database.password'),
  database : config.get('database.name'),
  multipleStatements : true
});

module.exports = (function() {
    return pool;
})();