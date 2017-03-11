exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.createTable('users', function(table) {
            table.increments('userId').primary();
            table.string('email').unique();
            table.string('password');
            table.string('role');
            table.dateTime('createdAt');
            table.dateTime('updatedAt');
            // table.timestamps();
        }),

        knex.schema.createTable('posts', function(table){
            table.increments('postId').primary();
            table.string('title');
            table.string('body');
            table.integer('userId');
            table.dateTime('postDate');
        }),

        knex.schema.createTable('comments', function(table){
            table.increments('commentId').primary();
            table.string('body');
            table.integer('userId');
            table.integer('postId');
            table.dateTime('commentDate');
        })
    ])
};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTableIfExists('users'),
        knex.schema.dropTableIfExists('posts'),
        knex.schema.dropTableIfExists('comments')
        // knex.schema.dropTable('users'),
        // knex.schema.dropTable('posts'),
        // knex.schema.dropTable('comments')
    ])
};