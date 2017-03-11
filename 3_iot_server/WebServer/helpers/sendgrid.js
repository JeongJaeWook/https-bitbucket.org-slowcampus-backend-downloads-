/*
SendGrid.com API
*/
var request = require('request');

var sendgridAuth = 'Bearer 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';
var APIURL = 'https://api.sendgrid.com/api/mail.send.json';

module.exports = {

///
send: function send(toAddr, fromAddr, subject, message, callback) {
  var formdata = {
    'to' : toAddr,
    'from' : fromAddr,
    'subject' : subject,
    'html' : message,
    'Authorization': sendgridAuth
  };

  var options = {
    url: APIURL,
    // For SendGrid Authorization, we must add a custom header
    headers: {
      'Authorization': sendgridAuth
    },
    form: formdata,
    timeout: 3000
  };
  request.post(options, function(err,httpResponse,body) {
      if (err) {
        console.debug('ERR', err);
        if (callback) callback(err, 0);
      }
      else {
        body = JSON.parse(body);
        //console.debug('BODY', typeof body, body);
        if (body.errors) {
          if (callback) callback(body.errors[0], null);
        }
        else {
          if (callback) callback(null, body.message);
        }
      }
    }
  ); // request
} // send()

}; // module.exports


/*
MAIN
*/

if (require.main === module) {
  var sendgrid = require('./sendgrid');
  sendgrid.send('daehee@pedium.com', 'myunghan@pedium.com',
    'Email from pedium.com',
    'Hello there ^^',
    function(err, result) {
      if (err) {
        console.log('EMAIL ERROR:', err);
      }
      else {
        console.log('EMAIL SUCCESS:', result);
      }
    }
  );

}
