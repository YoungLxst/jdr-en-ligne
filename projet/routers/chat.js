const router = require('express').Router()
const User = require('../models/user')

var users = {}

router.get('/', async (req, res) =>{
    if(req.isAuthenticated()){
        const user = await User.findById(req.session.passport.user)
        res.render('chat/index', {layout:'layouts/layoutCon',user:user})
    }else{
        res.redirect('/login')
    }
})

function connect(socket){
    var me 
    for(var val in users){
        socket.emit('newUser')
    }
    socket.on('login',(data) =>{
        me = data
        users[me.id] = me
        socket.broadcast.emit('newUser')
    })
}

module.exports ={
    router:router,
    connect:connect
}