var config = require('config');

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host : config.get('database.host'),
        user : config.get('database.user'),
        password : config.get('database.password'),
        database : config.get('database.name')
    },
    pool: { min: 2, max: 10 }
});

module.exports = (function() {
    return knex;
})();