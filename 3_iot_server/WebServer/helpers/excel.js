/**
이용 패키지 - excel-export
  https://www.npmjs.com/package/excel-export
  http://netai-nayek.blogspot.kr/2014/08/export-database-data-to-excel-file-in.html
*/
var _ = require('lodash');
var fs = require('fs');
var nodeExcel = require('excel-export');
var appRoot = require('app-root-path');

var config = require('../config');

module.exports = {
  /*
    엑셀 파일 형식으로 데이타를 생성하여 리턴함.
    @param header 헤더 칼럼들의 이름 및 타입 지정 가능
    @param rows 각 행별 데이터(array)의 array

    Return: The binary content of an excel file
    Usage: var excelData = excel.excel(header, rows);
    Example:
      아래와 같이 header, rows를 지정하여 엑셀 파일을 만들 수 있습니다.
      함수의 리턴값은 엑셀파일 binary data이며,  그 값을 파일로 저장 또는 http res로 보내면 됩니다.
      var excel = require('../helpers/excel.js');
      var excelData = excel.excel(null, [[1,2,3],[4,5,6]]);
      // Save a File
      fs.writeFileSync('Report.xlsx', excelData, 'binary');

      // or, HTTP Response
      res.setHeader('Content-Type', 'application/vnd.openxmlformats');
      res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
      res.end(excelData, 'binary');
  */
  excel: function(header, rows, cb) {
    var conf={};
    conf.stylesXmlFile =  appRoot + config.excelStyleFile; // "styles.xml"
    //conf.name = "mysheet";
    // 헤더 (칼럼의 이름)
    conf.cols=[
      { caption:'', type:'string', width:3 } // 데이터가 없을 경우에서 빈 헤더를 생성하여 파일오픈 시 에러 방지
      //{ caption:'BBB', type:'string', width:50 },
      //{ caption:'Date', type:'string', width:15 },
    ];
    conf.rows=[];
    if(header)  {
      conf.cols = header;
    }
    if(rows) {
      // 실제 데이터
      conf.rows = rows;
    }
    var result = nodeExcel.execute(conf);
    //var result = nodeExcel.executeAsync(conf, cb);
    return result;
  },

};

if (require.main === module) {
  var log4js = require('log4js');
  log4js.replaceConsole();
  var excel = require('./excel.js');
  var async = require('async');
  var fs = require('fs');
  var excelData = excel.excel(null,
    [
      [10, 'han', '2010-10-10'],
      [20, 'kim', '2010-10-20'],
      [30, 'lee', '2010-10-30'],
    ]
   );
  console.log(typeof excelData);
  fs.writeFileSync('aaa.xlsx', excelData, 'binary');

}