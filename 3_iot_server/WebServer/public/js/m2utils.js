/// Dependency:  TimeAgo
//
//
(function(window) {
  
var M2C = window.M2C || {};
M2C.utils = M2C.utils || {};

M2C.utils.MyTimer = function() {
  var intvId;
  var n = 0;

  function stop() {
    console.log('STOP');
    clearInterval(intvId);
    intvId = 0;
  }

  function start(callback, intervalSec, timesN) {
    if (intvId) {
      stop();
    }

    // define my callback which executes the given callback function
    function mycallback() {
      var stopit = callback();
      // stop if n is equal to times N
      // or if callback() returns true
      n++;
      if ((timesN > 0 && n >= timesN) || stopit) {
        stop();
      }
    }

    intvId = setInterval(mycallback, intervalSec*1000);
    // first, execute it immediately
    mycallback();
  }

  return {
    id: intvId,
    start: start,
    stop: stop
  };
}

// display time for the sensor value
M2C.utils.periodicTimeDisplay = function (elemId, epochstr, timeagoSecs) {
  var dateval = new Date(Number(epochstr)*1000);
  var diffsecs = (new Date().getTime() - dateval.getTime()) / 1000;
  if (diffsecs < timeagoSecs) {
    $(elemId).html(jQuery.timeago(dateval));
    //console.log('TIMEAGO', diffsecs, elemId);
    return false;
  } else {
    // 한국 스타일 시간 표시
    $(elemId).html(dateval.toLocaleString('ko-KR'));
    //console.log('KO', diffsecs, elemId);
    return true;
  }
}

M2C.utils.getUrlVars = function () {
  var vars = [], hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
  for(var i = 0; i < hashes.length; i++)
  {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
  }
  return vars;
}

window.M2C = M2C;
  
})(window);
/*
////
if (require.main == module) {
  var epochtm = Math.round(new Date().getTime()/1000.0);
  var mytimer = MyTimer(function() {
      return updateTimeDisplay('#abc', epochtm, 12);
    },
    1, 0);

  setTimeout(mytimer.stop, 6*1000);

}
*/