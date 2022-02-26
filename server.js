const express = require('express');
const inputCheck = require('./utils/inputCheck');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const { result } = require('lodash');
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

//get aLL entries
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

db.query(sql, (err, rows) => {
    if (err) {
        res.status(500).json({ error: err.message });
        return;
    }
    res.json({
        message: 'success!',
        data: rows
    });
    });
});
//get a single candidate by id
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

db.query(sql, params, (err, row) => {
    if (err) {
     res.status(400).json({ error: err.message });
     return;
    }
    res.json({
        message: 'Success!',
        data: row
    });
    });
});
//update a candidate's party
app.put('/api/candidate/:id', (req, res) => {
    const sql = 'UPDATE candidates SET party_id = ? WHERE id = ?';
    const params = [req.body.party_id, req.params.id];
    const errors = inputCheck(req.body, 'party_id');
        if (errors) {
            res.status(400).json({ error: errors })
            return;
        }
        
    db.query(sql, params, (err, results) => {
        if (err) {
            res.status(400).json({ error: err.message });
            //see if any record was found
        } else if (!result.affectedRows) {
            res.json({
            message: 'Candidate not found'
        });
    } else {
        res.json({ 
            message: 'success!',
            data: req.body,
            changes: result.affectedRows
        });
    }
    });
});



//return all parties
app.get('/api/parties', (req, res) => {
    const sql = 'SELECT * FROM parties';
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success!',
            data: rows
        });
    });
});
//return a specific party
app.get('/api/party/:id', (req, res) => {
    const sql = 'SELECT * FROM parties WHERE id=?';
    const params = [req.params.id];
    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success!',
            data: row
        });
    });
});
//delete a party
app.delete('/api/party/:id', (req, res) => {
    const sql = `DELETE FROM parties WHERE id = ?`;
  const params = [req.params.id];
  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: res.message });
      // checks if anything was deleted
    } else if (!result.affectedRows) {
      res.json({
        message: 'Party not found'
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});


//delete an entry
app.delete('api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req,params.id];
    
db.query(sql, params, (err, result) => {
    if (err) {
        res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
        res.json({
            message: 'Candidate not found, sorry!'
        });
    } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
        });
    }
    });
    });

//create an entry
app.post('/api/candidate', ({ body }, res) => {
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return
    }

const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) VALUES (?,?,?)`;
const params = [body.first_name, body.last_name, body.industry_connected];

db.query(sql, params, (err, result) => {
    if (err) {
        res.status(400).json({ error: err.message });
        return;
    }
    res.json({
        message: 'successful!',
        data: body
    });
});
});
//default response if there is an issue, this has to be last or it will override other app.gets
app.use((req, res) => {
    res.status(404).end();
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});