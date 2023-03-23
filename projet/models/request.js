const mongoose = require('mongoose')

//create user
const requestSchema = new mongoose.Schema({
    room:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Room'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    }
})

module.exports = mongoose.model('Request', requestSchema)