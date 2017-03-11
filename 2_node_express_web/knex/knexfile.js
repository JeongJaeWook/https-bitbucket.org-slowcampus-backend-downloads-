module.exports = {
    development: {
        client: 'mysql',
        connection: {
            "host": "dev-platform-fin2b-com.cvg072slrknb.ap-northeast-2.rds.amazonaws.com",
            "port": 3306,
            "name": "unit_test",
            "user": "fin2b",
            "password": "fin2b1028",
            "database": "unit_test"
        },
        migrations: {
            directory: __dirname + '/migrations'
        },
        seeds: {
            directory: __dirname + '/seeds/dev'
        }
    }
}