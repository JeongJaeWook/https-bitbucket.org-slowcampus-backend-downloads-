
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('posts').del()
    .then(function () {
      return Promise.all([
        // Inserts seed entries
        knex('posts').insert({postId: 1, title: '게시글1', body :'게시내용1234admin', userId: 1}),
        knex('posts').insert({postId: 2, title: '게시글2', body :'게시내용1234admin', userId: 1}),
        knex('posts').insert({postId: 3, title: '게시글3', body :'게시내용1234investor', userId: 2})
      ]);
    });
};
