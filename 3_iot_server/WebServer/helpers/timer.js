function MyPeriodicTimer() {
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

