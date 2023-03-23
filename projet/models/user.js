const mongoose = require('mongoose')
const path = require('path')

const userImageBasePath = 'resources/profilPicture'

//create user
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilPicture:{
        type:String,
        required:true,
    }
})

userSchema.virtual('profilPicturePath').get(() => {
    console.log("ihvi")
    if (this.profilPicture != null) {
        return path.join('/',userImageBasePath,this.profilPicture)
    }
    if(this.profilPicture == null) console.log("wtf")
})

module.exports = mongoose.model('User', userSchema)
module.exports.basePath = userImageBasePath