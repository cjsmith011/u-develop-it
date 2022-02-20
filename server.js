const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
//adding the express middleware here
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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


// db.query('SELECT * FROM candidates', (err, rows) => {
//     console.log(rows);
// });

//get a single candidate by id
// db.query(`SELECT * FROM candidates WHERE id = 14`, (err, row) => {
//     if (err) {
//     console.log(err);
//     }
//     console.log(row);
// });

//delete an entry
// db.query(`DELETE FROM candidates WHERE id = ?`, 14, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//create an entry
const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected)
VALUES (?,?,?,?)`;
const params = [1, 'Ronald', 'Smith', 1];
// db.query(sql, params, (err, result) => {
//     if (err) {
//         console.log(err);
//     }
//     console.log(result);
// });

//default response if there is an issue, this has to be last or it will override other app.gets
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});