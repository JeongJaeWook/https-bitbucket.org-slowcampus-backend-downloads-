var bcrypt = require('bcrypt-nodejs');

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {

      var password = bcrypt.hashSync('1234', bcrypt.genSaltSync(10));

      return Promise.all([
        // Inserts seed entries
        knex('users').insert({userId: 1, email: 'kim@fin2b.com', password: password, role:'admin'}),
        knex('users').insert({userId: 2, email: 'lee@fin2b.com', password: password, role:'investor'})
      ]);
    });
};
