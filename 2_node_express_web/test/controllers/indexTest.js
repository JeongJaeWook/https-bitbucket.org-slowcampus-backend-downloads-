var request = require('supertest');
var app = require('../../app');

describe('INDEX', function() {
  //하나의 describe 블럭은 여러개의 it블럭을 갖을 수 있다
  it('should return 200 OK', function(done) {
    // Test implementation goes here
    request(app)
      .get('/')
      .expect(200, done);
  });

  // We can have more its here
  it('should return 404 OK', function(done) {
    // Test implementation goes here
    request(app)
      .get('/random')
      .expect(404, done);
  });
});