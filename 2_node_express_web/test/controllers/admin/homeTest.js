var request = require('supertest');
var app = require('../../../app');
var agent = request.agent(app);

describe('ADMIN HOME', function() {
  //하나의 describe 블럭은 여러개의 it블럭을 갖을 수 있다
  it('login', loginUser());

  it('should return 200 OK', function(done){
    agent
      .get('/admin')
      .expect(200)
      .end(function(err, res){
        if (err) return done(err);
        console.log(res.body);
        done();
      });
  });

  // We can have more its here
});

function loginUser() {
  return function(done) {
    agent
      .post('/login')
      .send({ email: 'kim@fin2b.com', password: '1234' })
      .expect(302)
      .expect('Location', '/admin')
      .end(onResponse);
    function onResponse(err, res) {
      if (err) return done(err);
      return done();
    }
  };
};
