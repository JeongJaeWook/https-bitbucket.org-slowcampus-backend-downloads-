var _ = require('lodash');
var email = require('../helpers/email');
//var sms = require('../helpers/kssms');
var config = require('../config');
var async = require('async');
var mysql = require('../models/mysqlDao');
var notificationModel = require('../models/notificationModel');
var accountModel = require('../models/accountModel');
var tagAccTable = new mysql.MySqlDao('tagaccount', ['tagaccount_id'], []);

module.exports = {
  notifyConfirm : function(req, res, oauthInfo, cb ) {

  },
  notifyNewRequest : function(requestInfo, cb ) {
    var where = {nara_id: requestInfo.nara_id};
    var comers = [];

    async.each(requestInfo.tags, function(tag, eachcb) {
      where.tagname = tag;
      tagAccTable.joinwhere('account', ['shortid', 'shortid'], where, function (err, accounts) {
        if (!err) {
          comers = _.concat(comers, accounts);
          eachcb(err);
        }
      });
    },
    function(err) {
      if( !err ) {
        // 중복 account 제거
        comers = _.uniqBy(comers, 'email');
        // 이메일만 추출
        comers = _.map(comers, function(comer) {
          return comer.email;
        });

        var mesg =
            '<h1> 새로운 요청 정보 </h1>' +
            '<p> 제  목 : ' + requestInfo.title + ' </p>' +
            '<p> 등록자 : ' + requestInfo.ownerInfo.nickname + ' </p>' +
            '<p> 태  그 : ' + requestInfo.tags + '</p>' +
            '<p> 타  입 : ' + requestInfo.req_type + '</p>' +
            '<p> 내  용 : ' + requestInfo.desc + '</p>' +
            '<p> 포인트 : ' + requestInfo.point + '</p>' +
            '<p> 등록일자 : ' + requestInfo.regi_date + '</p>' +
            '<p> 기한일자 : ' + requestInfo.due_date + '</p>' +
            '<p> 요청번호 : ' + requestInfo.request_id + '</p>'
            ;

        email.send(comers, '새로운 요청 알림', mesg, function(err, data) {
          console.log('[notifyNewRequet] comers : ', comers, ' \nerr : ', err, '\ndata : ', data);
        });
      }
      cb(err);
    });
  }
};

if (require.main === module) {
  var log4js = require('log4js');
  log4js.replaceConsole();
  var notiengine = require('./notiengine');

  //var requestInfo = {nara_id : 'sw', tags : ['Java', 'Javascript']}; // 중복 대상 제거 테스트
  var requestInfo = {nara_id : 'sw', tags : ['Java']};
  setTimeout(function () {
    notiengine.notifyNewRequest(requestInfo, function(err, result) {
      console.log('test : ', err, result);
    });
  }, 1000);
}
