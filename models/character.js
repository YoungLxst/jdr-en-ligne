const mongoose = require('mongoose')
const path = require('path')

const characterImageBasePath = 'resources/characPicture'

//create user
const characterSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true
    },
    int: {
        type: Number,
        required: false
    },
    ref: {
        type: Number,
        required: false
    },
    dex: {
        type: Number,
        required: false
    },
    tech: {
        type: Number,
        required: false
    },
    vol: {
        type: Number,
        required: false
    },
    cha: {
        type: Number,
        required: false
    },
    mouv: {
        type: Number,
        required: false
    },
    cor: {
        type: Number,
        required: false
    },
    emp: {
        type: Number,
        required: false
    },
    pres: {
        type: Number,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    finished: {
        type: Boolean,
        default: false,
        required: true
    },
    characterImage: {
        type: String,
        required: true
    },
    rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        default:null
    }]
})

characterSchema.virtual('characterImagePath').get(() => {
    if (this.characterImage != null) {
        return path.join('/',characterImageBasePath,this.characterImage)
    }
})

module.exports = mongoose.model('Character', characterSchema)
module.exports.basePath = characterImageBasePath