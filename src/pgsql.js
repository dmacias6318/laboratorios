const { Pool } = require('pg')

const data = {
    user: 'postgres',
    host: '34.68.255.88',
    //host: '127.0.0.1',
    password: 'Sys25992.*',
    database: 'lab',
    port: 5432
};

const pool = new Pool(data)

module.exports = pool