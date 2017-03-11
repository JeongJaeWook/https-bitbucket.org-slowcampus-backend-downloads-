/**
 * Copyright 2016 Fin2B Inc. (http://fin2b.com/)
 * All Right Reserved.
 *
 * NOTICE : All information contained herein is, and remains
 * the property of Fin2B Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Fin2B Incorporated
 * and its suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Fin2B Incorporated.
 *
 * @ CreatedAt 2016. 10. 27.
 * @ Author(s):
 *     Daehee Han
 **/

var _ = require('lodash');
var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');

/*
  AWS SES 서비스를 이용하여  email을 전송함.
  node 패키지 중에 nodemailer 를 이용함.
  사용법: require할 때 config를 인자로 주어야 함.

  var awsEmail = require('awsEmail')(config);
  awsEmail.send(from, to, subject, message, cb);
*/
module.exports = function(config) {
  var awsConfig = _.cloneDeep(config.aws);
  var ses = new AWS.SES(_.assign(awsConfig.ses, awsConfig.credentials));
  var transport = nodemailer.createTransport(
    sesTransport({
      ses: ses
    })
  );

  return {
    send: function (from, to, subject, message, cb) {
      // setup e-mail data with unicode symbols
      var mailOptions = {
          from: from, // sender address
          to: (typeof(to)=='string') ? to : to.join(', '), // list of receivers
          subject: subject, // Subject line
          //text: 'Hello world 🐴', // plaintext body
          html: message // html body
      };

      // send mail with defined transport object
      transport.sendMail(mailOptions, function(error, info){
          if(error){
              return console.log(error);
          }
          console.log('Message to:', to, '\nResult:', info);
          if (cb) {
            return cb(error, info);
          }
      });
    }
  }; // return
}; // function(config)

if (require.main === module) {
  var config = {
    aws : {
      credentials: {
        accessKeyId: "AKIAIPIPASO3VKXZHQOQ",
        secretAccessKey: "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"
      },
      ses : {
        region : "us-west-2",
        endpoint : "email.us-west-2.amazonaws.com"
      }
    }
  };

  var awsEmail = require('./awsEmail')(config);
  var async = require('async');
  var FIN2B_EMAIL = '"Fin2B Service" <support@fin2b.com>';
  var to = ['daehee@pedium.com','dhhan@fin2b.com'];
  //var to = 'dev@fin2b.com';

  var mesg =
  '<h1> Fin2B 플랫폼에 가입해 주셔서 감사합니다 :) </h1>'
  + '<p> 다음의 링크를 클릭하시면 Fin2B으로 연결되며, 이메일 주소 확인이 완료됩니다.</p>'
  + '<p> <a href="http://node.platform.fin2b.net/api/account/confirm/email/?id=g_111389818766418190667&confirm_code=578458712a91adb8a72688330b8b928dfe699afc">'
  + '이메일 주소 확인하기 </a></p>'
  + '<p style="margin-top: 20px"><img src="http://node.platform.fin2b.net/images/fin2b-logo-brown.png"></p>'
  ;

  async.waterfall(
    [
      function(next) {
        next();
      },
      function(next) {
        setTimeout(awsEmail.send(FIN2B_EMAIL,to, '테스트메일', mesg), 2000);
      }
    ],
    function(err, result) {
      console.info('err : ', err, ' result : ', result);
    });
}