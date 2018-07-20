const express = require('express');
const bodyParser = require('body-parser');
const pg = require('pg');

const app = express();

const config = {
    user: 'postgres',
    database: 'estagio',
    password: 'postgres',
    port: 5432
};

const pool = new pg.Pool(config);

//Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/pessoas', function(res){
    pool.connect(function(err, client, done) {
        if(err){
            return console.error('error connecting the database', err);
        }

        client.query('SELECT * FROM pessoas', function(err, result){
            done();
            if(err) {
                console.log(err);
                res.status(400).send(err);
            }
            res.status(200).send(result.rows);
        });
    });
});

app.post('/pessoas', function(req, res) {
    pool.connect(function(err, client, done) {
        if(err){
            return console.error('error connecting the database', err);
        }
        client.query('INSERT INTO pessoas VALUES ($1, $2, $3, $4)',
            [req.body.nome, req.body.telefone, req.body.email, req.body.tipo_id]);
        done();
    }); 
});

app.listen(3333, function(){
    console.log('Server started at port 3333');
});