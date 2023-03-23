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

router.get('/help',(req,res) =>{
    res.render('help')
})

router.get('/history',(req, res) =>{
    res.render('history')
})

module.exports = router

