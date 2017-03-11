///
(function(window) {
  
var M2C = window.M2C || {};
M2C.chart = M2C.chart || {};

M2C.chart.drawChart = function(gwid, sensors) {
  console.log(gwid,  sensors);
  var mytimers = {};

  sensors.forEach(function(sensorid) {
    mytimers[sensorid] = M2C.utils.MyTimer();
  });

  // chart 객체를 한번만 생성하도록 global 변수에 기억함
  var chartList = {};
  var chartData = {};

  function updateChart(sensorid, newdata) {
    if (chartData[sensorid]) {
      console.log(sensorid, 'updateChart', newdata);
      newdata.epochtm = Number(newdata.epochtm)*1000;
      chartData[sensorid].push(newdata);
      chartData[sensorid].shift();
      console.log('NEW', newdata);
      chartList[sensorid].setData(chartData[sensorid]);
    }
  }

  function myAjax(sensorid) {
    if (! chartList[sensorid]) {
      chartList[sensorid] = Morris.Line({
          element: sensorid,
          data: [],
          xkey: ['epochtm'],
          ykeys: ['val'],
          //ymin: 15,
          //ymax: 40,
          labels: ['val'],
          pointSize: 2,
          smooth: true,
          resize: true
      });
    }

    var vars = M2C.utils.getUrlVars();
    var params = {"gwid": gwid, "sensor_id": sensorid, "inquirytime":(vars.hours || 2)};
    $.ajax({
      method:'get',
      url:'/api/sdata',
      data: params,
      success:function(data) {
        console.log(sensorid, 'New Data', data[data.length-1]);
        var epochstr = data[data.length-1].epochtm;

        mytimers[sensorid].start(function() {
            return M2C.utils.periodicTimeDisplay('#'+sensorid+'_time', epochstr, 100);
          }, 1, 0);

        for(var j=0; j<data.length; j++) {
          data[j].epochtm = Number(data[j].epochtm)*1000;
        }
        chartData[sensorid] = data;
        chartList[sensorid].setData(chartData[sensorid]);
      }
    }); // $.ajax
  } // myAjax


  function myRender() {
    for(var i = 0 ; i < sensors.length ; i++) {
      myAjax(sensors[i]);
    }; // for
  } // myRender


  var socket;
  function regiSocket() {
    // web socket 생성을 한번만 하도록 개선. socket 을 global 변수로 하여 체크함
    // wait a new chart data, and then re-draw the chart
    if (socket) {
      return;
    }
    socket = io.connect();
    socket.emit('joinroom', gwid);
    socket.on('redraw', function (notidata) {
      console.log('redraw', notidata);
      //alert('re-draw the chart');

      mytimers[notidata.sensor].start(function() {
        return M2C.utils.periodicTimeDisplay('#'+notidata.sensor+'_time', notidata.epochtm, 100);
      }, 1, 0);
      updateChart(notidata.sensor, {epochtm: notidata.epochtm, val: Number(notidata.val)});
    });
  }

  regiSocket(); // render it when notified
  myRender(); // initial render

} // m2DrawChart

window.M2C = M2C;
  
})(window);
