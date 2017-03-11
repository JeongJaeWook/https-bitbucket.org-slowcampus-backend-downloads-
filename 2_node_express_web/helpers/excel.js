/**
 * Created by jiseob on 2016. 10. 26..
 */

var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var excel = require('node-excel-export');
var numeral = require('numeral');


var styles = {
  headerDark: {
    // fill: {
    //   fgColor: {
    //     rgb: 'FF000000'
    //   }
    // },
    alignment : {
      vertical : 'center',
      horizontal : 'center'
    },
    font: {
      color: {
        rgb: 'FF000000'
      },
      sz: 14,
      bold: true,
      underline: false
    },
    height :200
  },
  cellPink: {
    fill: {
      fgColor: {
        rgb: 'FFFFCCFF'
      }
    }
  },
  cellGreen: {
    fill: {
      fgColor: {
        rgb: 'FF00FF00'
      }
    }
  },
  aprCell : {
    alignment : {
      horizontal : 'right'
    }
  },
  currencyCell : {
    alignment : {
      horizontal : 'right'
    }
  },
  textCell : {
    alignment : {
      vertical : 'center',
      horizontal : 'center'
    }
  }
};

var style = (function() {
    var common = {
      sellerName: {displayName: '판매기업', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 100},
      issueId: {displayName: '세금계산서번호', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 250},
      dueDate: {displayName: '원지급일', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 100},
      discountDays: {displayName: '할인기간', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 100},
      amount: {displayName: 'AP금액(원)', headerStyle: styles.headerDark, cellStyle: styles.currencyCell, width: 200},
    };

    var settled = {
      sellerSettledApr: {displayName: '체결할인율(연환산율)(%)',headerStyle: styles.headerDark,cellStyle: styles.aprCell,width: 180},
      settledDiscount: {displayName: '할인금액(원)',headerStyle: styles.headerDark,cellStyle: styles.currencyCell,width: 200},
      settledAmount: {displayName: '체결금액(원)',headerStyle: styles.headerDark,cellStyle: styles.currencyCell,width: 200}
    };
    settled = _.assign(_.cloneDeep(common), settled);

    var cancelled = {
      sellerSettledApr: {displayName: '체결할인율(연환산율)(%)', headerStyle: styles.headerDark, cellStyle: styles.aprCell, width: 180 },
      paymentCancelled: {displayName: '지급취소사유', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 250}
    };
    cancelled = _.assign(_.cloneDeep(common), cancelled);

    var newIssued = {
      newIssueId: {displayName: '수정세금계산서번호', headerStyle: styles.headerDark, cellStyle: styles.textCell, width: 250}
    };
    newIssued = _.assign(_.cloneDeep(settled), newIssued);


    return {
      settled : settled,
      newIssued : newIssued,
      cancelled : cancelled
    };
  }
)();

module.exports = {
  style : style,
  makeExcel : function (options) {
    var res = null;

    if(options) {
      res = excel.buildExport([
        {
          // name : 'test', // sheetName
          specification : options.style || null,
          data : options.data
        }
      ]);
    }
    return res;
  }
};

if (require.main === module) {
}
