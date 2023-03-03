const express = require('express')
const router = express.Router()
const Room = require('../models/room')

router.get('/', async (req, res) =>{
    var layout
    if(req.isAuthenticated()){
        layout =  'layouts/layoutCon'
    }else{
        layout = 'layouts/layoutPage'
    }
    let query = Room.find()
    try{
        const rooms = await query
        res.render('parties/index',{
            rooms:rooms,
            layout:layout
        })
    }catch(e){
        res.send(e)
    }
    
})

router.get('/create', async(req, res) =>{
    if(req.isAuthenticated()){
        const room = new Room({
            admin: req.session.passport.user
        })
    try{
        await room.save()
        res.redirect('/parties')
    }catch(e){
        res.send(e)
    }
    }else{
        res.redirect('/parties')
    }
    
})

module.exports = router