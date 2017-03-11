module.exports = {
/// epoch
epoch2Date : function(epochsecs) {
  // refer - http://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date-with-javascript
  // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
  var options = {};
  options.timeZone = 'Asia/Seoul';
  var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(epochsecs);
  return d.toLocaleString('ko-KR', options); // time with TimeZone
}
,
/// 현재 시각의 YYYYMMDD 형태 구하기
date_format : function() {
  var date = new Date();

  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();

  return year + month + day;
}
,
/// 현재 시각의 YYYYMMDD 형태 구하기
date_format_long : function(date) {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  var hour = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var seconds = ('0' + date.getSeconds()).slice(-2);
  return year+'/'+month+'/'+day+' '+hour+':'+minutes+':'+seconds;
}
,
/// 현재의 epoch time 구하기
now_to_epoch : function() {
  var now = new Date();
  var epochtm = Math.round(now.getTime()/1000.0);
  return epochtm;
}
,
// 이름을 단순화
now: function() {
  return Math.round(new Date().getTime()/1000.0);
}
,
/// 현재 시간으로부터 h시간 m분 s초 전의 epoch time 구하기
recent_epochtm : function(hours, minutes, seconds) {
    var secs = hours*3600 + minutes*60 + seconds;
    var now_epoch = this.now_to_epoch();
    return (now_epoch - secs);
}
,
/// 주어진 epoch time의 YYYYMMDD 형태 문자열 구하기
epochtm_to_YYYYMMDD : function(epochtm) {
  var date = new Date(Number(epochtm) * 1000);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();

  return year + month + day;
}
,
/// 주어진 epoch time의 YYYY-MM-DD 형태 문자열 구하기
epochtm_to_YYYY_MM_DD : function(epochtm) {
  var date = new Date(Number(epochtm) * 1000);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();

  return year + '-' + month + '-' + day;
}
,
/// 주어진 epoch_time의 YYYYMMDDHHmm 형태 문자열 구하기
epochtm_to_YYYYMMDDHHmm : function(epochtm) {
  var date = new Date(Number(epochtm) * 1000);
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  var hour = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);

  return year + month + day + ' ' + hour + minutes;
}
,
/// 주어진 포맷의 문자열을 Date 객체로 변환 
YYYYMMDD_to_datetime : function(yyyymmdd) {
    var year        = yyyymmdd.substring(0,4);
    var month       = yyyymmdd.substring(4,6);
    var day         = yyyymmdd.substring(6,8);
    var date        = new Date(year, month-1, day);
    return date;
}
};
