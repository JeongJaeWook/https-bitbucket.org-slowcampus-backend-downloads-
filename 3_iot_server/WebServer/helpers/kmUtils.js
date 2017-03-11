var _ = require('lodash');
const decamelize = require('decamelize');

module.exports = {
  ObjectJsonParse : function ObjectJsonParse(object, jsonAttributes) {
    var clone = _.cloneDeep(object);

    _.keys(object).forEach( function(attr) {
      if( _.indexOf(jsonAttributes, attr) !== -1 ) {
        clone[attr] =  JSON.parse(object[attr]);
      }
    }) ;

   return clone;
  },

  ObjectJsonStringify : function ObjectJsonStringify(object, jsonAttributes) {
    var clone = _.cloneDeep(object);

    _.keys(object, function(attr) {
      if( _.indexOf(jsonAttributes, attr) !== -1 ) {
        clone[attr] = JSON.stringify(object[attr]);
      }
    });

    return clone;
  },

  RowsJsonParse: function RowsJsonParse(rows, jsonfields) {
    // jsonfields must be an array of field names
    for(var i = 0 ; i < rows.length ; i++) {
      for(var j = 0 ; j < jsonfields.length ; j++) {
        var name = jsonfields[j];
        if (rows[i].hasOwnProperty(name)) {
          try {
            rows[i][name] = JSON.parse(rows[i][name]);
          }
          catch (err) {
            console.info('JSON PARSE ERROR', i,name, rows[i][name]);
            if (rows[i][name][0]=='{')
              rows[i][name] = {};
            else
              rows[i][name] = [];
          }
        }
      }
    }
  },

  decamelizeOjbect: function (obj) {
    var b = {};
    for(var k in obj) {
      if(obj.hasOwnProperty(k)) {
        b[decamelize(k)] = obj[k];
      }
    }
    return b;
  },

  pickOfObjList: function (objlist, pickattrs) {
    for(var i = 0; i < rows.length ; i++) {
      objlist[i] = _.pick(objlist[i]);
    }
    return objlist;
  },

  RowsJsonStringify: function RowsJsonStringify(rows, jsonfields) {
    // jsonfields must be an array of field names
    for(var i = 0; i < rows.length ; i++) {
      for(var j = 0; j < jsonfields.length ; j++) {
        var name = jsonfields[j];
        if (rows[i].hasOwnProperty(name)) {
          rows[i][name] = JSON.stringify(rows[i][name]);
        }
      }
    }
  },

  printRows: function printRows(rows) {
    for(var i = 0 ; i < rows.length ; i++) {
        console.debug(rows[i]);
    }
  },

  printKeyVals: function printKeyVals(objs) {
    for(var o in objs) {
      if(objs.hasOwnProperty(o)) {
        console.debug(o, ':', objs[o]);
      }
    }
  },

  updateIfNull: function updateIfNull(obja, keysa, objb, keysb) {
    /*
    obja의 keys 중에 null 값만 업데이트 함.
    */
    var content = {};
    if (keysa.length !== keysb.length) {
      return null;
    }
    var toupdate = false;
    for (var i = 0 ; i < keysa.length ; i++) {
      if (! obja[keysa[i]] && objb[keysb[i]]) {
        content[keysa[i]] = objb[keysb[i]];
        toupdate = true;
      }
    }
    return (toupdate) ? content : null;
  },

  shortGender: function shortGender(gender) {
    return (gender) ? gender[0].toUpperCase() : '';
  },

  diffArray : function(oldTags, newTags) {
    var diffTags = {added : [], removed : []};

    if( !oldTags ) {
      diffTags.added = newTags;
    } else {
      // 추가된 지역 추출
      var added = _.difference(newTags, oldTags);
      if( added.length > 0 ) {
        diffTags.added = added;
      }
      // 삭제된 태그 추출
      var removed = _.difference(oldTags, newTags);
      if( removed.length > 0 ) {
        diffTags.removed = removed;
      }
    }
    // 추가, 삭제 없을 시 빈객체로 초기화
    diffTags = _.omitBy(diffTags, function(val, a, b) {
      return _.isEmpty(val);
    });

    return diffTags;
  },

  diffArrayOf : function(oldTags, newTags) {
    var diffTags = {added : {}, removed : {}};

    if( !oldTags ) {
      diffTags.added = newTags;
    } else {
      // 추가된 태그 추출
      _.mapKeys(newTags, function(value, key) {
        if( !oldTags[key] ) {
          diffTags.added[key] = value;
        } else {
          var added = _.difference(value, oldTags[key]);
          if( added.length > 0 ) {
            diffTags.added[key] = added;
          }
        }
      });
      // 삭제된 태그 추출
      _.mapKeys(oldTags, function(value, key) {
        if( !newTags[key] ) {
          diffTags.removed[key] = value;
        } else {
          var removed = _.difference(value, newTags[key]);
          if( removed.length > 0 ) {
            diffTags.removed[key] = removed;
          }
        }
      });
    }
    // 추가, 삭제 없을 시 빈객체로 초기화
    diffTags = _.omitBy(diffTags, function(val, a, b) {
      return _.isEmpty(val);
    });

    return diffTags;
  }
/// add a new function here
};

if (require.main === module) {
  var utils = require('./kmUtils');
  var rows = [{
    phones: JSON.stringify(['010', '011']),
    emaillist: JSON.stringify(['handol', 'park']),
    name: 'moon',
    age: 40
  }];
  var fields = ['phones', 'emaillist'];
  utils.printRows(rows);
  utils.RowsJsonParse(rows, fields);
  utils.printRows(rows);
  utils.RowsJsonStringify(rows, fields);
  utils.printRows(rows);
}
