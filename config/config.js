
require("dotenv").config()
module.exports = {
    development: {
        username: process.env.mysqlname,
        password: process.env.password,
        database: process.env.database,
        host: process.env.host,
        dialect: "mysql",
        logging: false,
        timezone: "+09:00",
        dialectOptions: {
            dateStrings: true,
            typeCast: true
        }
    },
    test: {
        username: "root",
        password: null,
        database: "database_test",
        host: "127.0.0.1",
        dialect: "mysql"
    },
    production: {
        username: "root",
        password: null,
        database: "database_production",
        host: "127.0.0.1",
        dialect: "mysql"
    }
}