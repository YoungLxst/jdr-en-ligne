const express = require('express')
const router = express.Router()
const Character = require('../models/character')

router.get('/', (req,res) =>{
    if(req.isAuthenticated()){
        //console.log(req.session)
        res.render('personages/index', {layout: 'layouts/layoutCon'})
    }else{
        res.render('personages/index')
    }
})

router.get('/new',(req, res) =>{
    if(req.isAuthenticated()){
        res.render('personages/new', {layout: 'layouts/layoutCon'})
    }else{
        res.redirect('/login')
    }
})

router.post('/create_charac/step2',async (req,res) =>{
   var newCharac = new Character({
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        class:req.body.class,
        user:req.session.passport.user
   })
   try{
        const charac = await newCharac.save()
        res.render('personages/step2',{charac:charac})
   }catch(e){
    res.render('personages/new',{error:'error creating the character'})
   }
})

router.post('/create_charac/step3', async (req, res) =>{
    console.log(req.body)
    if(req.body.int + req.body.ref + req.body.tech + req.body.dex + req.body.pres + req.body.vol + req.body.cha + req.body.mouv + req.body.cor + req.body.emp == 62 ){
        try{
            await Character.f
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
            res.render('personages/step3',{charac:charac})
        }catch(e){
            res.render('personages/step2',{charac:charac,error:'error setting stat'})
        }
    }else{
        let charac = await Character.findById(req.body.characId)
        res.render('personages/step2',{charac:charac, error:'les points ne sont pas egale a 62'})
    }
})

module.exports = router