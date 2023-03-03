const express = require('express')
const router = express.Router()

router.get('/', (req, res) =>{
    if(req.isAuthenticated()){
        //console.log(req.session)
        res.render('regles/index', {layout: 'layouts/layoutCon'})
    }else{
        res.render('regles/index')
    }
})

module.exports = router