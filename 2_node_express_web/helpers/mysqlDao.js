var _ = require('lodash');
var config = require('../config');
var utils = require('../helpers/kmUtils');
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
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};

MySqlDao.prototype.searchwherein = function(wherejson, col, inparams, cb) {
  var that = this;

  this.rawknex(that.table).select('*')
    .where(wherejson)
    .whereIn(col, inparams)
    .then(function(rows) {
      console.debug(that.table, 'searchin - ROWS', rows.length);
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};


MySqlDao.prototype.searchin = function(col, inparams, cb) {
  var that = this;

  this.rawknex(that.table).select('*')
    .whereIn(col, inparams)
    .then(function(rows) {
      console.debug(that.table, 'searchin - ROWS', rows.length);
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};

MySqlDao.prototype.searchor = function(wherejson, orwherejson, cb) {
  var that = this;

  this.rawknex(that.table).select('*')
  .where(wherejson)
  .orWhere(orwherejson)
  .then(function(rows) {
    console.debug(that.table, 'search - ROWS', rows.length);
    if (that.jsonStyleFields) {
      utils.RowsJsonParse(rows, that.jsonStyleFields);
    }
    return cb(null, rows);
  })
  .catch(function(err) {
    console.error(err);
    return cb(err, []);
  });
};

MySqlDao.prototype.join = function(jointable, cols, cb) {
    var that = this;
    jointable = this.db + '.' + jointable;
    var thiscol = this.table.concat('.').concat(cols[0]);
    var thatcol = jointable.concat('.').concat(cols[1]);
    
    this.rawknex(that.table).select('*')
    .leftJoin(jointable, thiscol, thatcol)
    .then(function(rows) {
      console.debug(that.table, 'join - ROWS', rows.length);
      if(that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err);
    });
};

MySqlDao.prototype.joinwhere = function(jointable, cols, wherejson, cb) {
  var that = this;
  jointable = this.db + '.' + jointable;
  var thiscol = this.table.concat('.').concat(cols[0]);
  var thatcol = jointable.concat('.').concat(cols[1]);

  this.rawknex(that.table).select('*')
  .leftJoin(jointable, thiscol, thatcol)
  .where(wherejson)
  .then(function(rows) {
    console.debug(that.table, 'joinwhere - ROWS', rows.length);
    if(that.jsonStyleFields) {
      utils.RowsJsonParse(rows, that.jsonStyleFields);
    }
    if( cb ) {
      return cb(null, rows);
    }
  })
  .catch(function(err) {
    console.error(err);
    if( cb ) {
      return cb(err, []);
    }
  });
};

MySqlDao.prototype.joinwhereLimit = function(jointable, cols, wherejson, limit, offset, cb) {
  var that = this;
  jointable = this.db + '.' + jointable;
  var thiscol = this.table.concat('.').concat(cols[0]);
  var thatcol = jointable.concat('.').concat(cols[1]);

  this.rawknex(that.table).select('*')
  .leftJoin(jointable, thiscol, thatcol)
  .where(wherejson)
  .then(function(rows) {
    console.debug(that.table, 'joinwhereLimit - ROWS', rows.length);
    if(that.jsonStyleFields) {
      utils.RowsJsonParse(rows, that.jsonStyleFields);
    }
    if( cb ) {
      return cb(null, rows);
    }
  })
  .catch(function(err) {
    console.error(err);
    if( cb ) {
      return cb(err, []);
    }
  });
};


MySqlDao.prototype.search = function(wherejson, cb) {
  var that = this;
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
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
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

/*
  custom query를 만들어서 넘겨주는 방식
  var q2 = tableA.query();
  q2.where({email: 'manager@buyer.com'});
  q2.whereBetween('sid', ['10', '20']);
  console.log(q2.toString());
  tableA.searchWithQuery(q2, function(err, rows) {
    console.log(rows[0]);
  });
*/
MySqlDao.prototype.searchWithQuery = function(query, cb) {
  var that = this;

  this.primaryFields.forEach(function(pk) {
    query.orderBy(pk, 'DESC');
  });

  query.then(function(rows) {
      console.debug(that.table, 'search - ROWS', rows.length);
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};

MySqlDao.prototype.updateWithQuery = function(query, cb) {
  var that = this;
  query.then(function(count) {
    console.debug(that.table, 'updateWithQuery - SUCCESS');
    return cb(null, count);
    })
    .catch(function(err) {
      console.error(err);
      if( cb ) {
        cb(err);
      }
    });
};

MySqlDao.prototype.searchLimit = function(wherejson, limit, offset, cb) {
  var that = this;
  limit = limit ? limit : 30;
  offset = offset ? offset : 0;

  var query = this.rawknex(that.table).select('*')
    .where(wherejson)
    .limit(limit)
    .offset(offset);

  query.then(function(rows) {
      console.debug(that.table, 'searchLimit - ROWS', rows.length);
      if (that.jsonStyleFields) {
        utils.RowsJsonParse(rows, that.jsonStyleFields);
      }
      return cb(null, rows);
    })
    .catch(function(err) {
      console.error(err);
      return cb(err, []);
    });
};

MySqlDao.prototype.addOrUpdate = function(recordjson, cb) {
  var self = this;
  var wherejson = _.pick(recordjson, self.primaryFields); // get only these properties

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

/* add인 경우 sid 생성 */
MySqlDao.prototype.addOrUpdateWithSid = function(recordjson, sidFieldName, cb) {
  var self = this;
  var wherejson = _.pick(recordjson, self.primaryFields); // get only these properties

  if (Object.keys(wherejson).length < self.primaryFields.length) {
    var err = Error('Key fields NOT are given in INSERT. Check params to me.');
    throw err;
  }

  self.search(wherejson, function(err, rows) {
    if (err) return cb(err);
    if (rows.length === 0) {
      // it's new, so insert it
      if(sidFieldName) {
        recordjson[sidFieldName] = shortid.generate();
      }
      self.add(recordjson, cb);
    } else {
      // it's NOT new, so update it
      var newrecord = _.assign(rows[0], recordjson);
      self.update(newrecord, cb);
    }
  }); // search()
};

MySqlDao.prototype.add = function(recordjson, cb) {
  var that = this;
  var wherejson = _.pick(recordjson, that.primaryFields); // get only these properties

  if (Object.keys(wherejson).length < that.primaryFields.length) {
    var err = Error('Key fields NOT are given in INSERT. Check params to me.');
    throw err;
  }
  if (that.jsonStyleFields) {
    utils.RowsJsonStringify([recordjson], that.jsonStyleFields);
  }
  this.rawknex(that.table).insert(recordjson, that.primaryFields[0])
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

  if (that.jsonStyleFields) {
    utils.RowsJsonStringify([recordjson], that.jsonStyleFields);
  }

  var wherejson = _.pick(recordjson, that.primaryFields); // get only these properties
  var updatejson = _.omit(recordjson, that.primaryFields); // exclude key properties

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

MySqlDao.prototype.updateWhere = function(wherejson, updatejson, cb) {
  var that = this;
  updatejson = _.omit(updatejson, that.primaryFields.concat(Object.keys(wherejson))); // exclude key properties

  this.rawknex(that.table)
    .where(wherejson)
    .update(updatejson)
    .then(function(count) {
      console.debug(that.table, 'updateWhere - SUCCESS');
      updatejson.updatedCount = count;
      return cb(null, updatejson);
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

module.exports = {
  MySqlDao: MySqlDao,
};

if (require.main === module) {
  var log4js = require('log4js');
  log4js.replaceConsole();
  var config = require('../config');
  var mysqlDao = require('./mysqlDao');
  var tableA = new mysqlDao.MySqlDao(config.mango, 'account', ['sid'], []);
  var tableB = new mysqlDao.MySqlDao(config.mango, 'account', ['sid'], []);

  var q = tableA.query('sid');

  q.whereBetween('sid', ['10', '20']);
  console.log(q.toString());
  q.then(function(rows) {
    console.log('Q', rows.length);
  });

  var q2 = tableA.query();
  q2.where({email: 'manager@buyer.com'});
  q2.whereBetween('sid', ['10', '20']);
  console.log(q2.toString());
  tableA.searchWithQuery(q2, function(err, rows) {
    console.log(rows[0]);
  });


/*

  setTimeout(function() {
    tableA.all(function(err, rows) {
      console.log(tableA.knex().toString());
      console.debug('A', rows.length);
      //console.log(rows);
    });
  }, 500);

  setTimeout(function() {
    tableB.all(function(err, rows) {
      console.debug('B', rows.length);
      //console.log(rows);
    });
  }, 1500);
*/

}