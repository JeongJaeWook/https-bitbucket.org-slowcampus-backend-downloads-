var knex = require('knex')({
    debug: true,
    client: 'mysql',
    connection: {
      host: 'slow2.clrrpqxdnnah.ap-northeast-2.rds.amazonaws.com',
      port: 3306,
      user: 'slow',
      password: 'slow2017',
      database: 'slow',
      timezone: 'Asia/Seoul'
    },
    pool: {
      min: 0,
      max: 100
    },
});

var q1 = knex.select().from('user');
var q2 = knex.select().from('sensor1');
var q3 = knex.select().from('q3');

/* toString() 를 이용하여 query내용을 볼 수 있다 */
console.log(q1.toString());
console.log(q2.toString());

/* 정상 케이스 생성 - query 수행 */
q1.then(function(rows) {
    console.log('ROWS', rows.length);
  })
  .catch(function(err) {
    console.log(err);
  });

/* 오류 케이스 생성 - 테이블 이름이 틀린 경우임 */
q3.then(function(rows) {
    console.log('ROWS', rows.length);
  })
  .catch(function(err) {
    console.log(err);
  });
