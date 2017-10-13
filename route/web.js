const express = require('express')
module.exports = function(){

    const router = express.Router();
     router.get('/',(req,res)=>{
        req.session.username = 'JohnDoe'
         res.send('web').end()
     })

    return router
}