const { Pool } = require('pg')

const data = {
    user: 'postgres',
    host: 'ip del equipo',
    password: 'password del gestor sql',
    database: 'lab',
    port: 5432
};

const pool = new Pool(data)

module.exports = pool