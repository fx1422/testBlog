const express = require('express');
const mysql = require('mysql');

const db =mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learn'
});

module.exports = function(){

    const router = express.Router();
     router.get('/get_banners',(req,res)=>{
        db.query(`SELECT * FROM banners_table`,(err,data)=>{
            if(err){
                console.error(err);
                res.status(500).send('database error').end();
            }else {
                res.send(data).end()
            }
        })
     });

    return router
};