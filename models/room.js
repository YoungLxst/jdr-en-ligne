const mongoose = require('mongoose')

//create user
const roomSchema = new mongoose.Schema({
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})

module.exports = mongoose.model('Room', roomSchema)