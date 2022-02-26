const mysql = require('mysql2');


//this will connect to mysql2
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Bootcamp2022SQL',
        database: 'election'
    },
    console.log('Connected to the database Election')
);

module.exports = db;