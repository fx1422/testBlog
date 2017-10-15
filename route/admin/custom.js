const express = require('express');
const common = require('../../libs/common');
const mysql = require('mysql');
const pathLib = require('path');
const fs = require('fs');

const db =mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learn'
});

module.exports= function () {
  const router = express.Router();

  router.get('/',(req,res)=>{
      switch (req.query.act){
          case 'mod':
              db.query(`SELECT * FROM custom_evaluation_table WHERE id=${req.query.id}`,(err,data)=>{
                  if(err){
                      console.error(err);
                      res.status(500).send('database error').end()
                  }else if(data.length===0){
                      res.status(404).send('no data').end()
                  }else {
                      db.query(`SELECT * FROM custom_evaluation_table`, (err, evaluations) => {
                          if (err) {
                              console.error(err);
                              res.status(500).send('database error ').end();
                          } else {
                              res.render('admin/custom.ejs', {evaluations,mod_data:data[0]})

                          }
                      });
                  }
              });


              break;
          case 'del':
              db.query(`SELECT * FROM custom_evaluation_table WHERE ID=${req.query.id}`,(err,data)=>{
                  if(err){
                      console.error(err);
                      res.status(500).send('database error').end();
                  }else {
                      if(data.length===0){
                          res.status(404).send('no data').end();
                      }else {
                          fs.unlink('static/upload/'+data[0].src,(err,data)=>{
                              if(err){
                                  res.status(500).send('file error').end();
                              }else {
                                  db.query(`DELETE FROM custom_evaluation_table WHERE ID=${req.query.id}`,(err,data)=>{
                                      if(err){
                                          console.error(err);
                                          res.status(500).send('database error').end();
                                      }else {
                                          res.redirect('/admin/custom')
                                      }

                                  });
                              }

                          })
                      }
                  }

              });
              break;
          default:
              db.query(`SELECT * FROM custom_evaluation_table`,(err,evaluations)=>{
                  if(err){
                      console.error(err);
                      res.status(500).send('database error').end();
                  }else {
                      res.render('admin/custom.ejs',{evaluations})
                  }
              })

      }
  });
  router.post('/',(req,res)=>{
      const title=req.body.title,description = req.body.description;

      const ext = pathLib.parse(req.files[0].originalname).ext;
      const oldPath = req.files[0].path;
      const newPath = req.files[0].path + ext;
      const newFileName = req.files[0].filename + ext;

      fs.rename(oldPath,newPath,(err,data)=>{
          if(err){
              console.error(err);
              res.status(404).send('files error').end();
          }else {
              if(req.body.mod_id){
                  /*db.query(`UPDATE custom_evaluation_table SET title='${req.body.title}',
                  description='${req.body.description}',
                  src='' WHERE ID='${req.body.mod_id}'`,
                      (err,data)=>{
                  })*/

              }else {
                  db.query(`INSERT INTO custom_evaluation_table (title,description,src) VALUES
                  ('${title}','${description}','${newFileName}')`,(err,data)=>{
                      if(err){
                          console.error(err);
                          res.status(500).send('database error').end();
                      }else {
                          res.redirect('/admin/custom');
                      }
                  })
              }
          }
      });



  });



  return router
};