/**
 */
var _ = require('lodash');
var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
var sesTransport = require('nodemailer-ses-transport');
var fs = require('fs');

var config = require('../config');

var ses = new AWS.SES(_.assign(config.aws.ses, config.aws.credentials));
var transport = nodemailer.createTransport(sesTransport({
    ses: ses
}));

var FIN2B_EMAIL = '"Fin2B Service" <support@slow.com>';
var FIN2B_ARN = "arn:aws:ses:us-west-2:254687415396:identity/support@slow.com";

module.exports = {
  //  nodemailer 를 이용하는 방식
  send: function (to, subject, message, cb) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: FIN2B_EMAIL, // sender address
        to: to.join(', '), // list of receivers
        subject: subject, // Subject line
        //text: 'Hello world 🐴', // plaintext body
        html: message // html body
    };

    // send mail with defined transport object
    transport.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
        if (cb) {
          return cb(error, info);
        }
    });
  },

  sendInvitation: function(to, name, cb) {
    var html = fs.readFileSync('../public/markup/mail/ac_bu_e01.html');
    //var htmlstream = fs.readFileSync('../public/markup/mail/mail_01.html');
    var css = fs.readFileSync('../public/styles/style-mail.css');
    var subject = name + ' , 귀사를 Fin2B 서비스에 초대합니다';
    var inlineCss = require('inline-css');
    var options = {
      extraCss: css,
      url: '/'
    };
    console.log('HTML', html.length, 'CSS', css.length);
    inlineCss(html, options).then(function(inlinedHtml) {
       console.log('INLINED HTML', inlinedHtml.length);
       console.log(inlinedHtml);
       module.exports.send(to, subject, inlinedHtml, cb);
    });

  },
  // SES API 를 직접 이용하는 방식
  sendSes : function (to, subject, message, cb) {
    if (typeof to === 'string') {
      to = [to];
    }
    console.log('EMAIL', 'FROM', from, 'TO', to);
    ses.sendEmail( {
      Source: from,
      //SourceArn: fromarn,
      Destination: { ToAddresses: to },
      Message: {
        Subject:{
          Data: subject
        },
        Body: {
          /*
          Text: {
            Data: message
          },
          */
          Html: {
            Data: message,
            Charset: 'utf-8'
          }
        }
      }
    },
    function(err, data) {
      console.log('[send email] from : ', from, ' to : ', to[0], ' err : ', err);
      cb(err, data);
    }); // ses.sendEmail
  }, // send()

};

if (require.main === module) {
  var log4js = require('log4js');
  log4js.replaceConsole();
  var email = require('./email.js');
  var async = require('async');

  var to = ['handol@gmail.com'];
  var to = ['daehee@pedium.com', 'jskim@slow.com', 'mhhyun@slow.com'];
  var to = ['dhhan@slow.com'];

  var mesg =
  '<h1> Fin2B 플랫폼에 가입해 주셔서 감사합니다 :) </h1>'
  + '<p> 다음의 링크를 클릭하시면 Fin2B으로 연결되며, 이메일 주소 확인이 완료됩니다.</p>'
  + '<p> <a href="http://node.platform.slow.net/api/account/confirm/email/?id=g_111389818766418190667&confirm_code=578458712a91adb8a72688330b8b928dfe699afc">'
  + '이메일 주소 확인하기 </a></p>'
  + '<p style="margin-top: 20px"><img src="http://node.platform.slow.net/images/slow-logo-brown.png"></p>'
  ;

  async.waterfall(
    [
      function(next) {
        //setTimeout(email.send(to, 'Fin2B 가입 확인 메일', mesg, next), 2000);
        next();
      },
      function(next) {
        setTimeout(email.sendInvitation(to, '피디엄'), 2000);
      }
    ],
    function(err, result) {
      console.info('err : ', err, ' result : ', result);
    });
}
