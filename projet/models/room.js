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
    },
    name:{
        type:String,
        required:true
    },
    characters: [{
        type:mongoose.Types.ObjectId,
        ref: 'Character',
        default:null,
    }]
})

module.exports = mongoose.model('Room', roomSchema)