const express = require('express')
const router = express.Router()
const Room = require('../models/room')
const User = require('../models/user')
const Request = require('../models/request')
const Character = require('../models/character')

router.get('/', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.session.passport.user)
        const characters = await Character.find({ user: req.session.passport.user })
        const invitation = await Request.find({ user: req.session.passport.user })
        try {
            var roomsId = []
            var rooms = []
            await (await Room.find({admin: req.session.passport.user})).forEach(r =>{
                rooms.push(r)
            })
            characters.forEach(char =>{
                for(var i =0 ; i < char.rooms.length; i++){
                    roomsId.push(char.rooms[i])
                }
            })
            for(var i = 0; i< roomsId.length;i++){
               rooms.push(await Room.findById(roomsId[i])) 
            }
            res.render('parties/index', {
                rooms: rooms,
                characters: characters,
                invitation: invitation,
                layout: 'layouts/layoutCon',
                user: user
            })
        } catch (e) {
            res.send(e)
        }
    }
    else {
        res.redirect('/login')
    }
})

router.get('/new', async (req, res) => {
    if (req.isAuthenticated()) {
        const user = await User.findById(req.session.passport.user)
        const users = await User.find({ _id: { $ne: req.session.passport.user } });
        res.render('parties/new', {
            layout: 'layouts/layoutCon',
            users: users,
            user: user
        })
    } else {
        res.redirect('/login')
    }

})

//creation de la room est invitation des user
router.post('/new', async (req, res) => {

    //creation de la room
    const newRoom = new Room({
        name: req.body.name,
        admin: req.session.passport.user
    })
    try {
        var room = await newRoom.save()
    } catch (e) {
        res.send(e)
    }

    //creation des request
    
    if (typeof (req.body.user) === 'string') {
        //si il n'y a qu'une personne
        const newReq = new Request({
            room: room._id,
            user: req.body.user
        })

        //verifcation qu'on ne cree pas deux fois la meme request
        const existingRequest = await Request.findOne({ room: room._id, user: req.body.user[i] });
        if (existingRequest == null) {
            try {
                await newReq.save()
            } catch (e) {
                res.send(e)
            }
        }
    } else {
        //si il y a plus d'une personne
        for (var i = 0; i < req.body.user.length; i++) {
            const newReq = new Request({
                room: room._id,
                user: req.body.user[i]
            })

            //verifcation qu'on ne cree pas deux fois la meme request
            const existingRequest = await Request.findOne({ room: room._id, user: req.body.user[i] });
            if (existingRequest == null) {
                try {
                    await newReq.save()
                } catch (e) {
                    res.send(e)
                }
            }
        }
    }

    res.redirect('/parties')
})

router.post('/join', async (req, res) => {
    console.log(req.body)
    await Room.findByIdAndUpdate(req.body.room,{ $addToSet:{characters: req.body.character}})
    await Character.findByIdAndUpdate(req.body.character,{ $addToSet: { rooms: req.body.room}})
    Request.deleteOne({ room: req.body.room, user: req.session.passport.user }, function(err) {
        if (err) {
          console.log('Error deleting document: ' + err)
        } else {
          console.log('Document deleted')
        }
    })
    console.log(await Room.findById(req.body.room))
    res.redirect('/parties')
})

router.get('/getUser', async (req, res) => {
    const users = await User.find({ _id: { $ne: req.session.passport.user } });
    res.send(users)
})

module.exports = router