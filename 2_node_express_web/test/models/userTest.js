var chai = require('chai');
var expect = chai.expect;
var userModel = require('../../models/User');

describe('Users', function() {
  //done 을 사용하여 비동기 처리
  it('should list ALL Users on /Users GET', function(done){
    userModel.search({}, function(err, rows){
      expect(rows).to.be.instanceof(Array);
      var obj = rows[0];
      expect(obj).to.have.property('userId');
      expect(obj).to.have.property('email');
      expect(obj).to.have.property('password');
      expect(obj).to.have.property('role');
      expect(obj).to.have.property('createdAt');
      expect(obj).to.have.property('updatedAt');
      done();
    })
  });

  it('should list a SINGLE User on /Users/<id> GET', function(done){
    var email = 'kim@fin2b.com';
    userModel.search({email : email}, function(err, rows){
      expect(rows).to.be.instanceof(Array);
      var obj = rows[0];
      expect(obj).to.have.property('userId');
      expect(obj).to.have.property('email', email);
      expect(obj).to.have.property('password');
      expect(obj).to.have.property('role');
      expect(obj).to.have.property('createdAt');
      expect(obj).to.have.property('updatedAt');
      done();
    })
  });

  it('should add a SINGLE User on /Users POST');
  it('should update a SINGLE User on /Users/<id> PUT');
  it('should delete a SINGLE User on /Users/<id> DELETE');
});