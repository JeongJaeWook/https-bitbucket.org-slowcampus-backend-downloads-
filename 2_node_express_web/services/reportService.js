/**
 * Copyright 2016 Fin2B Inc. (http://fin2b.com/)
 * All Right Reserved.
 *
 * NOTICE : All information contained herein is, and remains
 * the property of Fin2B Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Fin2B Incorporated
 * and its suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Fin2B Incorporated.
 *
 * @ CreatedAt 2016. 10. 28.
 * @ Author(s):
 *     Myunghan Hyun
 **/

var excel = require('../helpers/excel');

module.exports = {
  getExcel : function(options, cb) {
    // TODO : db에서 데이터 가져오기
    // pseudo code
    cb(null, excel.makeExcel(/* db 결과 데이터 및 옵션 */));
  }
};