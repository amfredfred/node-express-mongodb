if (process.env.NODE_ENV !== 'production')
    require('dotenv').config()

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')

//Routes
const HomeRoutes = require('./routes')
const AuthorsRoutes = require('./routes/authors')

//SETTING VIEWS
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

//DATABASE CONNECTION
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
const DB = mongoose.connection
DB.on('error', (error) => console.log('ERROR OCCURED: ', error))
DB.once('open', () => console.log('Connected To Mongoose'))


app.use('/', HomeRoutes)
app.use('/authors', AuthorsRoutes)







app.listen(process.env.PORT || 3000)