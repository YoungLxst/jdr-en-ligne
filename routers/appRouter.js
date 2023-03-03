const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')

app.set('layout', 'layouts/layoutApp')
app.use(expressLayout)


app.get('/', (req, res) => {
    res.render('app/index')
})

function connectApp(socket){

        socket.on('join-room',(room) =>{
            socket.join(room)
        })

        
        socket.on('mouse', mouseMsg)
        function mouseMsg(data,room) {
            socket.to(room).emit('mouse', data)
            console.log(data)
        }

        socket.on('up', (room) => {
            socket.to(room).emit('up')
            console.log('receve it')
        })

        socket.on('erase', (data,room) =>{
            socket.to(room).emit('erase', data)
        })

        socket.on('size', (data,room) =>{
            socket.to(room).emit('size', data)
        })

        socket.on('background', (data,room)=>{
            socket.to(room).emit('background', data)
        })

        socket.on('undo', (room) =>{
            socket.to(room).emit('undo')
        })

        socket.on('dragok', (data,room) =>{
            socket.to(room).emit('dragok', data)
        })

        socket.on('drag', (data,room) =>{
            socket.to(room).emit('drag', data)
            console.log(data)
        })

        socket.on('addPawn', (data,room) =>{
            socket.to(room).emit('addPawn', data)
        })
}


module.exports = {
    app: app,
    connect: connectApp
}