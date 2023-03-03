const LocalStrategy = require('passport-local').Strategy
const User = require('./models/user')

//get user id req.session.passport.user

function initialize(passport){
    const authenticateUser = async (username, password, done) =>{
        var user = await User.find({username: username})
        if(user[0] == null){
            return done(null, false, {message: 'Password or username is incorect'})

        }
        if(user[0].password == password){
            return done(null, user[0])
        }else{
            return done(null, false, {message:'Password or username is incorect'})

        }
    }
    passport.use(new LocalStrategy(authenticateUser))
    passport.serializeUser((user, done) =>done(null, user._id))
    passport.deserializeUser((id, done) =>{
        done(null, User.findById(id, (err, user) =>{
            if(err){
                console.log(err)
            }else{
                //console.log(user)
            }
        }))
    })
}

module.exports = initialize