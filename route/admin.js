const express = require('express')
const bodyParser = require('body-parser')
const common = require('../libs/common')
const mysql = require('mysql')

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'learn'
})

module.exports = function () {

    const router = express.Router();

    //检查登录拦截

    router.use((req, res, next) => {
        if (!req.session['admin_id'] && req.url !== '/login') {
            res.redirect('/admin/login')
        } else {
            next()
        }
    })
    router.get('/login', (req, res) => {
        res.render('admin/login.ejs', {})
    })
    router.post('/login', (req, res) => {
        const username = req.body.username;
        const password = common.md5(req.body.password + common.MD5_SUFFIX);
        db.query(`SELECT * FROM admin_table WHERE username='root'`, (err, data) => {
            if (err) {
                res.status(500).send('database error').end()
            } else {
                if (data.length == 0) {
                    res.status(500).send('no this admin').end()
                } else {
                    if (data[0].password === password) {
                        req.session['admin_id'] = data[0].username
                        res.redirect('/admin/')
                    } else {
                        res.status(404).send('this password is incorrent').end()
                    }
                }
            }

        })
    })
    router.get('/', (req, res) => {
        res.render('admin/index.ejs', {title:'wwwwww'})
    })
    router.get('/banners', (req, res) => {
        res.render('admin/banners.ejs', {})
    })
    return router
}