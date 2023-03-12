const express = require('express')
const router = express.Router()
const Character = require('../models/character')
const User = require('../models/user')

const path = require('path')
const fs = require('fs')
const multer = require('multer')
const uploadPath = path.join('public',Character.basePath)
const imageMimeTypes = ['image/jpeg','image/png','image/gif']
const upload = multer({
    dest:uploadPath,
    fileFilter:(req, file, callback) =>{
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

router.get('/', async (req,res) =>{
    if(req.isAuthenticated()){
        const user = await User.findById(req.session.passport.user)
        const characters = await Character.find({user: req.session.passport.user})
        res.render('personages/index', {layout: 'layouts/layoutCon',user:user,characters:characters})
    }else{
        res.render('personages/index')
    }
})

router.get('/new',async (req, res) =>{
    if(req.isAuthenticated()){
        const user = await User.findById(req.session.passport.user)
        res.render('personages/new', {layout: 'layouts/layoutCon',user:user})
    }else{
        res.redirect('/login')
    }
})

router.post('/create_charac/step2', upload.single('file'), async (req,res) =>{
    const fileName = req.file != null ? req.file.filename : 'defaultCharaPic'
    var newCharac = new Character({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        class:req.body.class,
        user:req.session.passport.user,
        characterImage: fileName
   })
   try{
        const charac = await newCharac.save()
        res.render('personages/step2',{charac:charac})
   }catch(e){
        if(newCharac.characterImage != null){
            removePP(newCharac.characterImage)
        }
    res.render('personages/new',{error:'error creating the character'})
   }
})

router.post('/create_charac/step3', async (req, res) =>{
    if(Number(req.body.int) + Number(req.body.ref) + Number(req.body.tech) + Number(req.body.dex) + Number(req.body.pres) + Number(req.body.vol) + Number(req.body.cha) + Number(req.body.mouv) + Number(req.body.cor) + Number(req.body.emp)  == 62 ){
        try{
            const charac = await Character.findOneAndUpdate({_id:req.body.characId},{"$set":{
                "int": req.body.int,
                "ref":req.body.ref,
                "dex":req.body.dex,
                "tech":req.body.tech,
                "pres":req.body.pres,
                "vol":req.body.vol,
                "cha":req.body.cha,
                "mouv":req.body.mouv,
                "cor":req.body.cor,
                "emp":req.body.emp,
            }})
            res.redirect('/character')
        }catch(e){
            let charac = await Character.findById(req.body.characId)
            res.render('personages/step2',{charac:charac,error:'error setting stat'})
        }
    }else{
        let charac = await Character.findById(req.body.characId)
        res.render('personages/step2',{charac:charac, error:'les points ne sont pas egale a 62'})
    }
})

module.exports = router

function removePP(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
      if (err) console.error(err)
    })
  }