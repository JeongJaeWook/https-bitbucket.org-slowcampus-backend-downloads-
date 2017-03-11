var config      = require('./knexfile.js');
var env = process.env.NODE_ENV || 'development';
var knex        = require('knex')(config[env]);

module.exports = knex;

// knex.migrate.latest([config]);

knex.migrate.latest()
.then(function() {
    return knex.seed.run();
})
.then(function() {
    // migrations are finished
});