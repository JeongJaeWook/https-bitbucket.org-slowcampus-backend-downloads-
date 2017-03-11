var pool = require('../helpers/mysqlPool');
var Model = require('../helpers/model');
var userModel = new Model('users');
var bcrypt = require('bcrypt-nodejs');

var userSchema = {
  email : null,
  password : null,
  role : null,
  createdAt : null,
  updatedAt : null
};

userModel.validatePassword = function(password1, password2) {
  return bcrypt.compareSync(password1, password2)
}

module.exports = userModel;