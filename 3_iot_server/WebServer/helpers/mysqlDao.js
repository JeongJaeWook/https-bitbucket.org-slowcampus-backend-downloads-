var _ = require('lodash');
var config = require('../config');
var utils = require('../helpers/kmUtils');
var camelize = require('camelize');
var knex = require('knex')(config.db);
var shortid = require('shortid');

function MySqlDao(dbname, tablename, primaryFields, jsonStyleFields) {
  this.rawknex = knex;
  this.db = dbname;
  this.table = dbname + '.' + tablename;
  this.primaryFields = primaryFields;
  this.jsonStyleFields = jsonStyleFields;
  this.knex = function () { return this.rawknex(this.table);};
}

MySqlDao.prototype.hasTable = function(tablename, cb) {
  var that = this;
  this.rawknex.schema.hasTable(tablename).then(function(exists){cb(exists);});
};

MySqlDao.prototype.parseJsonRow = function(rows) {
  if( this.jsonStyleFields ) {
    utils.RowsJsonParse(rows, this.jsonStyleFields);
  }
};
MySqlDao.prototype.getPK = function() {
  return this.primaryFields;
};

MySqlDao.prototype.all = function(cb) {
  var that = this;
  this.rawknex(that.table).select('*')
    .then(function(rows) {
      console.debug(that.table, 'all - ROWS', rows.length);
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, camelize(rows));
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};


MySqlDao.prototype.search = function(wherejson, cb) {
  var that = this;
  wherejson = utils.decamelizeOjbect(wherejson);

  var query = this.rawknex(that.table).select('*')
    .where(wherejson);


  this.primaryFields.forEach(function(pk) {
    query.orderBy(pk, 'DESC');
  });

  query.then(function(rows) {
      console.debug('%s [%d] ROWS, Where %s', that.table, rows.length, JSON.stringify(wherejson));
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, camelize(rows));
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};

MySqlDao.prototype.add = function(recordjson, cb) {
  var that = this;
  var decameljson = utils.decamelizeOjbect(recordjson);
  var wherejson = _.pick(decameljson, that.primaryFields); // get only these properties

  if (that.jsonStyleFields) {
    utils.RowsJsonStringify([decameljson], that.jsonStyleFields);
  }
  this.rawknex(that.table).insert(decameljson, that.primaryFields[0])
    .then(function(ids) {
      console.debug(that.table, 'inserted data :', recordjson);
      cb(null, recordjson);
    })
    .catch(function(err) {
      console.error(err);
      if ( cb ) {
        cb(err);
      }
    });
};

MySqlDao.prototype.update = function(recordjson, cb) {
  var that = this;

  var decameljson = utils.decamelizeOjbect(recordjson);
  if (that.jsonStyleFields) {
    utils.RowsJsonStringify([decameljson], that.jsonStyleFields);
  }

  var wherejson = _.pick(decameljson, that.primaryFields); // get only these properties
  var updatejson = _.omit(decameljson, that.primaryFields); // exclude key properties

  if (Object.keys(wherejson).length < that.primaryFields.length) {
    var err = Error('Key fields NOT are given in UPDATE. Check params to me. Or, try updateWhere()');
    throw err;
  }

  this.rawknex(that.table)
    .where(wherejson)
    .update(updatejson, that.primaryFields[0])
    .then(function(count) {
      console.debug(that.table, 'update - SUCCESS');
      return cb(null, recordjson);
    })
    .catch(function(err) {
      console.error(err);
      if( cb ) {
        cb(err);
      }
    });
};


MySqlDao.prototype.remove = function(wherejson, cb) {
  var that = this;
  wherejson = utils.decamelizeOjbect(wherejson);
  this.rawknex(that.table)
    .where(wherejson)
    .del()
    .then(function(count) {
      console.debug(that.table, 'delete - SUCCESS (' + count + ' row(s))');
      if( cb ) {
        cb(null, count);
      }
    })
    .catch(function(err) {
      console.error(err);
      if( cb ) {
        cb(err);
      }
    });
};

MySqlDao.prototype.count = function(column, where, cb) {
  var that = this;
  var query = null;

  if( column ) {
    query = this.rawknex(that.table).count(column + ' AS count');
  } else {
    query = this.rawknex(that.table).count('* AS count');
  }

  if( where ) {
    query = query.where(where);
  }

  query.then(function(count) {
    if(cb) {
      console.log('count : ', count[0].count);
      cb(null, count);
    }
  }).catch(function(err) {
    console.error(err);
    if( cb ) {
      cb(err, 0);
    }
  });
};

/* custom query를 만들기 위한 것.
  'columns' 파라미터는 optional. 하나의 필드(문자열) 또는 필드목록 가능함.
*/
MySqlDao.prototype.query = function(columns) {
  var basequery;
  if( columns ) {
    basequery = this.rawknex(this.table).select(columns);
  } else {
    basequery = this.rawknex(this.table);
  }

  return basequery;
};

MySqlDao.prototype.addOrUpdate = function(recordjson, cb) {
  var self = this;
  var decamelJson = utils.decamelizeOjbect(recordjson);
  var wherejson = _.pick(decamelJson, self.primaryFields); // get only these properties

  if (Object.keys(wherejson).length < self.primaryFields.length) {
    var err = Error('Key fields NOT are given in INSERT. Check params to me.');
    throw err;
  }

  self.search(wherejson, function(err, rows) {
    if (err) return cb(err);
    if (rows.length === 0) {
      // it's new, so insert it
      self.add(recordjson, cb);
    } else {
      // it's NOT new, so update it
      //var newvals = _.assign(rows[0], recordjson);
      self.update(recordjson, cb);
    }
  }); // search()
};


module.exports = {
  MySqlDao: MySqlDao,
};

if (require.main === module) {
  var log4js = require('log4js');
  log4js.replaceConsole();
  var config = require('../config');
  var mysqlDao = require('./mysqlDao');

}