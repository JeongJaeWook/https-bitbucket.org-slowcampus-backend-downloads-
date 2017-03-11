// replace the original console.log() with logger.debug()
function replaceConsoleLog(logger) {
  function replaceWith(fn) {
    return function() {
      fn.apply(logger, arguments);
    };
  }
  logger = logger || getLogger("console");
  console.log = replaceWith(logger.debug);
}

var common_settings = {
  aws : {
    credentials: {
      accessKeyId: "",
      secretAccessKey: "+dSnkCy9v"
    },
    ses : {
      region : "us-west-2",
      endpoint : "email.us-west-2.amazonaws.com"
    },
    s3 : {
      endpoint : "https://s3.ap-northeast-2.amazonaws.com",
      region : "ap-northeast-2", // Seoul
      bucket: ""
    }

  },
};

var prd_settings = {
  db : {
    debug: false,
    client: 'mysql',
    connection: {
      host: 'slow2.clrrpqxdnnah.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      user: 'slow',
      password: 'slow2017',
      database: 'slow',
      timezone: 'Asia/Seoul'
    },
    pool: {
      min: 0,
      max: 100
    },
  }
};

var dev_settings = {
};

var _= require('lodash');

module.exports = (function() {
    var log4js = require('log4js');
    log4js.replaceConsole();
    //var logger = log4js.getLogger('console');
    var logger = log4js.getLogger();
    //console.log('logger', logger);
    logger.setLevel('DEBUG');
    replaceConsoleLog(logger);

    if (process.env.NODE_ENV === 'prd') {
      console.log('connected prd');
      return _.merge(common_settings, prd_settings);
    } else {
      console.log('connected dev');
      return _.merge(common_settings, prd_settings);
    }
})();
