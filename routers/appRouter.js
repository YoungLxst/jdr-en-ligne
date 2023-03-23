const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const url = require('url')

const Room = require('../models/room')
const Character = require('../models/character')

app.set('layout', 'layouts/layoutApp')
app.use(expressLayout)


app.get('/', async (req, res) => {
    try {
        const queryObject = url.parse(req.url, true).query

        const room = await Room.findById(queryObject.room)

        var characters = []
        for (var i = 0; i < room.characters.length; i++) {
            var c = await Character.findById(room.characters[i]._id)
            characters.push(c)
        }

        res.render('app/index',{
            characters:characters,
            user: req.session.passport.user
        })
    } catch (e) {
        res.send(e)
    }
})



function connectApp(io) {
    io.sockets.on('connection', (socket) => {

        // save every user who connect to the server.
        socket.on('user', (user) => {
            socket.user = user
            console.log("yes bb")
        })

        //how to show every room available?.
        socket.on('showRoom', () => {
            socket.emit('showRoom', io.sockets.adapter.rooms)
            
        })

        // Show the user who is connected to the server.
        socket.on('showUser', (room) => {
            socket.to(room).emit('showUser', socket.user)
        })

        socket.on('join-room', (room) => {
            socket.join(room)
            console.log(socket.id + "  +  " + socket.user + "  +  " + room)

            console.log(io.sockets.adapter.rooms)
        })


        socket.on('mouse', mouseMsg)
        function mouseMsg(data, room) {
            socket.to(room).emit('mouse', data)
            console.log(data)
        }

        socket.on('up', (room) => {
            socket.to(room).emit('up')
            console.log('receve it')
        })

        socket.on('erase', (data, room) => {
            socket.to(room).emit('erase', data)
        })

        socket.on('size', (data, room) => {
            socket.to(room).emit('size', data)
        })

        socket.on('background', (data, room) => {
            socket.to(room).emit('background', data)
        })

        socket.on('undo', (room) => {
            socket.to(room).emit('undo')
        })

        socket.on('dragok', (data, room) => {
            socket.to(room).emit('dragok', data)
        })

        socket.on('drag', (data, room) => {
            socket.to(room).emit('drag', data)
            console.log(data)
        })

        socket.on('addPawn', (data, room) => {
            socket.to(room).emit('addPawn', data)
        })
    })
}


module.exports = {
    app: app,
    connect: connectApp
}

