var _ = require('lodash');
var knex = require('./knexPool');
var log4js = require('log4js');
var logger = log4js.getLogger();

function Model(tablename) {
  this.rawknex = knex;
  this.table = tablename;
  this.knex = function () { return this.rawknex(this.table);};
}

Model.prototype.add = function(model, cb) {
  var that = this;
  var query = this.rawknex(that.table).insert(model).returning('*');

  query.then(function(o) {
    logger.debug(that.table, 'inserted data :', o[0]);
    cb(null, o[0]);
  }).catch(function(err) {
    logger.error(err);
    cb(err);
  });
};

Model.prototype.update = function(model, where, cb) {
  var that = this;
  var query = this.rawknex(that.table).update(model);

  // updateAll : (where === {})
  if(where) {
    query = query.where(where);
    query.then(function() {
      logger.debug(that.table, 'updated data : ', model);
      cb(null, model);
    }).catch(function(err) {
      logger.error(err);
      cb(err);
    });
  } else {
    cb(new Error('update require where clause.'));
  }
};

Model.prototype.remove = function(where, cb) {
  var that = this;
  var query = this.rawknex(that.table).del();

  // deleteAll : (where === {})
  if(where) {
    query = query.where(where);
    query.then(function() {
      cb(null);
    }).catch(function(err) {
      logger.error(err);
      cb(err);
    });
  } else {
    cb(new Error('delete require where clause.'));
  }
};

Model.prototype.search = function(where, cb) {
  var that = this;
  var query = this.rawknex(that.table).select('*').where(where);

  query.then(function(rows) {
      logger.debug('%s [%d] ROWS, Where %s', that.table, rows.length, JSON.stringify(where));
      cb(null, rows);
  }).catch(function(err) {
      logger.error(err);
      cb(err);
  });
};

module.exports = Model;