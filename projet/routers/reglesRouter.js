const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/', async (req, res) =>{
    if(req.isAuthenticated()){
        const user = await User.findById(req.session.passport.user)
        res.render('regles/index', {layout: 'layouts/layoutCon',user:user})
    }else{
        res.render('regles/index')
    }
})

module.exports = router