/**
 * @ Author Fin2b
 * @ CreatedAt 2016. 10. 27.
 *
 * Copyright 2016 Fin2b Inc. (http://fin2b.com/)
 * All Right Reserved.
 *
 * NOTICE : All information contained herein is, and remains
 * the property of Fin2b Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Fin2b Incorporated
 * and its suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Fin2b Incorporated.
 **/

var config = require('config');
var AWS = require('aws-sdk');
var _ = require('lodash');
var fs = require('fs');
var mime = require('mime');

AWS.config.update(_.assign(config.get('aws.s3'), config.get('aws.credentials')));
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
    var config = require('config');
    var s3 = require('./s3');
    s3.uploadFile(config.get('aws.s3.bucket'), '/tmp/t', '/tmp/t', function(err, s3url, contentType) {
        if( err ) {
            console.log("UPLOAD S3 FAILED", err /*, err.stack */ );
        } else {
            console.log("UPLOAD S3 SUCCESS", s3url, contentType);
        }
    });
}