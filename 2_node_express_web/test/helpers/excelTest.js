/**
 * Created by wise on 2016. 10. 27..
 */

var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect();
var should = chai.should();

var excel = require('../../helpers/excel');
var it = require("mocha").it;
var describe = require("mocha").describe;

describe('Test excel.js', function() {
  it('makeExcelData() should be not null', function() {
    // Test implementation goes here
    var options = {
      style : excel.style.settled,
      data : [
        {
          sellerName : 'seller-A',
          issueId : '123-456-7890',
          dueDate : '2016-10-10',
          discountDays : '20',
          amount : '1000000',
          sellerSettledApr : '0.48 %',
          settledDiscount : '1000',
          settledAmount : '1111111'
        },
        {
          sellerName : 'seller-B',
          issueId : '123-456-7890',
          dueDate : '2016-10-10',
          discountDays : '20',
          amount : '1000000',
          sellerSettledApr : '0.57 %',
          settledDiscount : '10000',
          settledAmount : '2222222'
        }
      ]
    };
    assert.notEqual(excel.makeExcel(null), null, "엑셀 생성 결과는 null이 아니어야 한다.");
  });
});