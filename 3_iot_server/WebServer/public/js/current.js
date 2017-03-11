///
(function(window) {
  
var M2C = window.M2C || {};
M2C.current = M2C.current || {};

M2C.current.drawCurrent = function(gwid, sensors) {
  console.log(gwid,  sensors);
  var mytimers = {};

  sensors.forEach(function(sensorid) {
    mytimers[sensorid] = M2C.utils.MyTimer();
  });

  // display a sensor value
  function updateValueDisplay(sensorid, sensorval) {
    var elemId = '#' + sensorid + '_value';
    $(elemId).html(sensorval);
  }

  function myAjax(sensorid) {
    // 이와같이 아래 내용을 별도의 함수로 만들어줘야 success callback 함수에서 sensors[i] 값이 제대로 나온다
    $.ajax({
      method:'GET',
      url:"/api/current",
      data: {
        'gwid': gwid,
        'sensor_id': sensorid
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("Status: " + textStatus); alert("Error: " + errorThrown);
      },
      success:function(data) {
        console.log('AJAX', sensorid, data[0]);
        //mytimers[sensorid] = MyTimer();
        mytimers[sensorid].start(function() {
            return M2C.utils.periodicTimeDisplay('#'+sensorid+'_time', data[0].epochtm, 100);
          }, 1, 0);

        updateValueDisplay(sensorid, data[0].val);
      } // success func
    }); // ajax
  }

  function myRender() {
    for(var i = 0 ; i < sensors.length ; i++) {
      myAjax(sensors[i]);
    }; // for
  } // myRender

  var socket;
  function regiSocket() {
    // wait a new chart data, and then re-draw the chart
    if (socket) {
      return;
    }
    socket = io.connect();
    socket.emit('joinroom', gwid);
    socket.on('redraw', function (notidata) {
      //alert('re-draw the current');
      console.log('redraw', notidata);
      mytimers[notidata.sensor].start(function() {
        return periodicTimeDisplay('#'+notidata.sensor+'_time', notidata.epochtm, 100);
      }, 1, 0);
      updateValueDisplay(notidata.sensor, Number(notidata.val));
    });
  }

  regiSocket(); // render it when notified
  myRender(); // initial render

  /// X-editable
  $.fn.editable.defaults.mode = 'popup'; //  mode - inline, popup

  $('#gwtitle').editable({placement: 'bottom'});
  for( var i = 0 ; i < sensors.length ; i++) {
    $('#' + sensors[i]).editable();
  }
} // m2DrawCurrent

window.M2C = M2C;
  
})(window);