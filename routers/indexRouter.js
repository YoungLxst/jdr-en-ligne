const { Router } = require('express')
const express = require('express')
const router = express.Router()

router.get('/', (req,res) =>{
    if(req.isAuthenticated()){
        //console.log(req.session)
        res.render('index', {layout: 'layouts/layoutCon', id:req.session.passport.user})
    }else{
        res.render('index')
    }
})

router.get('/test',(req,res) =>{
    res.render('personages/step3')
})

module.exports = router

