var log4js = require('log4js');
log4js.replaceConsole();
var config = require('../config');
var AWS = require('aws-sdk');
var _ = require('lodash');
var fs = require('fs');
var mime = require('mime');

AWS.config.update(_.assign(config.aws.s3, config.aws.credentials));
var S3 = new AWS.S3({signatureVersion: 'v4'});

module.exports = {

  uploadFile: function (bucket, srcpath, s3path, cb) {
    var contentType = mime.lookup(srcpath);
    console.info("UPLOAD S3 - filepath, content-type", srcpath, contentType);
    var params = {
          Bucket : bucket,
          Key : s3path,
          Body : fs.createReadStream(srcpath),
          ContentType : contentType
    };
    S3.upload(params, function(err, data) {
      if (!err)
        cb(null, data.Location, contentType);
      else
        cb(err, null, null);
    })
  }
  ,
}


if (require.main === module) {
  var config = require('../config');
  var s3 = require('./s3');
  s3.uploadFile(config.aws.s3.bucket, '/tmp/t', '/tmp/t', function(err, s3url, contentType) {
    if( err ) {
      console.log("UPLOAD S3 FAILED", err /*, err.stack */ );
    } else {
      console.log("UPLOAD S3 SUCCESS", s3url, contentType);
    }
  });
}