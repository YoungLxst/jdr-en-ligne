const router = require('express').Router()
var users = {}

router.get('/', (req, res) =>{
    if(req.isAuthenticated()){
        res.render('chat/index', {layout:'layouts/layoutCon'})
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