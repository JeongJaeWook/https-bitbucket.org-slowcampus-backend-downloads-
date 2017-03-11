var Model = require('../helpers/model');
var postModel = new Model('posts');

var postSchema = {
  postId : null,
  title : null,
  body : null,
  userId : null,
  postDate : null
};

module.exports = postModel;