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

var request = require('request');
var config = require('config');

var SMSAPIURL = 'http://agent1.kssms.kr/proc/RemoteSms.html';

function send(fromNumber, toNumber, message, callback) {
    if (config.smsSenderServer.match(/direct/i)) {
        console.log('SMS API External', config.smsSenderServer);
        requestSmsApiExternal(fromNumber, toNumber, message, callback);
    } else {
        console.log('SMS API Local', config.smsSenderServer);
        requestSmsApiLocal(fromNumber, toNumber, message, callback);
    }
}

function requestSmsApiLocal(fromNumber, toNumber, message, callback) {
    console.log('SMS RELAY', config.smsSenderServer + '/sms', fromNumber, toNumber, message.length);
    request.post({
        url: config.smsSenderServer + '/sms',
        form: {
            fromNumber: fromNumber,
            toNumber: toNumber,
            message: message
        },
        timeout: 5000
    }, function(err,httpResponse,body) {
        if (err) {
            console.debug('ERR', err);
            callback(err, 0);
        } else {
            console.debug(body);
            callback(null, 1);
        }
    });
}

function requestSmsApiExternal(fromNumber, toNumber, message, callback) {
    console.log('SMS API SERVER', SMSAPIURL, fromNumber, toNumber, message.length);
    var formdata = {
        'id' : '~~~',
        'pass' : '~~~~',
        'type' : (message.length >= 90) ? 'lms' : 'sms',
        'reservetime' : '',
        'reserve_chk' : '',
        'phone' : toNumber,
        'callback' : fromNumber,
        'msg' : message,
        'upfile' : '',
        'subject' : '',
        'etc1' : '',
        'etc2' : ''
    };

    request.post({
            url: SMSAPIURL,
            form: formdata,
            timeout: 5000
        }, function(err,httpResponse,body) {
            if (err) {
                callback(err, 0);
            }
            else {
                //console.debug('httpResponse', httpResponse);
                //console.debug('BODY', body);
                var count = parseInt(body.split('|')[2].split(':')[1]);
                if (count > 0) {
                    // success
                    callback(null, count);
                }
                else {
                    // failed
                    callback(body, count);
                }
            }
        }
    );
}

module.exports.send = send;
module.exports.requestSmsApiExternal = requestSmsApiExternal;

module.exports =  {
    send: send,
    requestSmsApiExternal: requestSmsApiExternal
}
/*
 MAIN
 */
if (require.main === module) {
    var log4js = require('log4js');
    log4js.replaceConsole();
    var kssms = require('./kssms');
    kssms.send('01021010255', '01021010255', '서비스 가입해주셔서 감사합니다.', function(err, result) {
        if (err) {
            console.debug('SMS ERROR:', err);
        }
        else {
            console.debug('SMS Result:', result);
        }
    });
}
