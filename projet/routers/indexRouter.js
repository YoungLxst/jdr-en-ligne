const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req,res) =>{
    if(req.isAuthenticated()){
        const user = await User.findById(req.session.passport.user)
        res.render('index', {layout: 'layouts/layoutCon', id:req.session.passport.user, user:user})
    }else{
        res.render('index')
    }
})

router.get('/test',(req,res) =>{
    res.render('test')
})

router.post('/test',(req, res) =>{
    console.log(req.body.text.length)
    res.redirect('/test')
})

module.exports = router

