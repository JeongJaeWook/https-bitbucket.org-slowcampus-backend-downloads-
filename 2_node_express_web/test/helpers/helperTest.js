var chai = require('chai');
var assert = chai.assert;


describe('Array', function() {
  //하나의 describe 블럭은 여러개의 it블럭을 갖을 수 있다
  it('should start empty', function() {
    // Test implementation goes here


    var arr = [];

    assert.equal(arr.length, 0);
  });

  // We can have more its here
});