#project structure

controllers/ – defines your app routes and their logic

helpers/ – code and functionality to be shared by different parts of the project

middlewares/ – Express middlewares which process the incoming requests before handling them down to the routes

models/ – represents data, implements business logic and handles storage

public/ – contains all static files like images, styles and javascript

views/ – provides templates which are rendered and served by your routes

services/ - transaction 이 필요한 작업, 여러 모델이 필요한 작업

test/ – tests everything which is in the other folders

config/ - local, development, staging, production 환경별 설정파일

knex/ - data migration setting

enums/ - project code & message 관리

app.js – initializes the app and glues everything together

server.js - app.js 를 사용한 web server code

package.json – remembers all packages that your app depends on and their versions'


#project description

model 은 다른 모델을 참조하지 않아야 함

#project command

npm start

npm test

npm run dev

npm run stg

npm run prd

npm run dev_test

npm run stg_test

npm run prd_test

npm run migration - db 테이블 생성 & 샘플 data insert

npm run rollback - migration 으로 생성된 테이블 drop

#project modules

##config - [링크](https://www.npmjs.com/package/config)

config 파일 관린 config/default.json 파일을 기본참조하고, NODE_ENV 값으로 설정된 json 파일을 오버라이드하여 참조 함

##morgan - [링크](https://github.com/expressjs/morgan)
http request logger / log stream 을 이용하여 로그파일을 관리할 수 있음
red server error
yellow client error
cyan redirection
uncolored others

##log4js - [링크](https://www.npmjs.com/package/log4js)
debug logger

    var log4js = require('log4js');
    var logger = log4js.getLogger();
    logger.debug(config.get('server.environment'));

##numeral - [링크](http://numeraljs.com/)
number util

##moment - [링크](http://momentjs.com/)
date util

##lodash - [링크](https://lodash.com/)
utility library

##async - [링크](https://caolan.github.io/async/)
async utility

##knex - [링크](http://knexjs.org/)
SQL query builder & migration tool