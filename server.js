if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const session = require('express-session')
const passport = require('passport')
const flash = require('express-flash')
const bodyParser = require ('body-parser')


const appRouter = require('./routers/appRouter')
const indexRouter = require('./routers/indexRouter')
const personagesRouter = require('./routers/personagesRouter')
const reglesRouter = require('./routers/reglesRouter')
const partiesRouter = require('./routers/partiesRouter')
const authRoute = require('./routers/auth')
const chatRoute = require('./routers/chat')

app.set('view engine', 'ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layoutPage')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(flash())
app.use(session({
    secret:'some secret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/app',appRouter.app)
app.use('/',indexRouter)
app.use('/rules',reglesRouter)
app.use('/character',personagesRouter)
app.use('/parties',partiesRouter)
app.use('/',authRoute)
app.use('/chat', chatRoute.router)

const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, family: 4 })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

var server = app.listen(80)

var socket = require('socket.io')
var io = socket(server)

io.sockets.on('connection', (socket) => {
    console.log('new connection')
    console.log(socket.id)
    require('./routers/appRouter').connect(socket)
    chatRoute.connect(socket)
})

