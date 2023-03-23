const router = require('express').Router()
const passport = require('passport')

//require user model
const User = require('../models/user')

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const uploadPath = path.join('public',User.basePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest:uploadPath,
    fileFilter:(req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

const initializePassport = require('../passport-config')
initializePassport(passport)

router.get('/register',checkAuthentificated, (req, res) =>{
    res.render('register', {layout: 'layouts/layoutLogs'})
})

router.get('/login',checkAuthentificated, async(req, res) =>{
    res.render('login', { layout: 'layouts/layoutLogs' })
})

router.post('/auth/register', upload.single('profilPicture'), async(req, res) =>{
    const fileName = req.file != null ? req.file.filename : 'defaultProfilPicture'
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        profilPicture: fileName
    })
    let errorMessages={}
    if(await User.find({username: req.body.username}).count() != 0 || req.body.username == "" || req.body.username.indexOf(' ') >= 0){
        errorMessages.username = "username invalid"
    }
    if(await User.find({email: req.body.email}).count() != 0 || req.body.email == "" || req.body.email.indexOf(' ') >= 0){
        errorMessages.email= "email invalid"
    }
    if(req.body.password == "" || req.body.password.indexOf(' ') >=0){
        errorMessages.password = "password invalid"
    }
    if(Object.entries(errorMessages).length === 0){
        try{
            await user.save()
            passport.authenticate("local")(req, res, function(){
                res.redirect('/')
            })
        }catch(e){
            if(user.profilPicture != null){
                removePP(user.profilPicture)
            }
            res.send(e)
        }
    }else{
        if(user.profilPicture != null){
            removePP(user.profilPicture)
        }
        res.render('register',{errorMessages, layout: 'layouts/layoutLogs'})
    }
})

router.post('/auth/login', passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true

}))

//logout
router.get('/auth/logout',(req, res) =>{
    req.logout(function(err){
        if(err){return next(err)}
    })
    res.redirect('/')
})

function checkAuthentificated(req, res, next){
    if(req.isAuthenticated()){
        res.redirect('/')
    }

    return next()
}

module.exports = router

function removePP(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    })
  }