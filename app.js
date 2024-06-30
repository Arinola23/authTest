//getting the boiler ready.
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
const cors = require('cors'); //middleware
const connectDB = require('./db.config/db')
require("dotenv").config()
const port = process.env.PORT || 8020

//DB conncetion
connectDB()
// mongoose.connect(process.env.DATABASE,
//     {  useNewUrlParser:true,
//     //    useUnifiedToplogy:true,
//     //    useCreateIndex:true
//     }) .then( ()=>{
//            console.log('mongodb: connect')
//        }
//     ).catch( (error)=>{
//        console.error(`mongodb: connect error: ${error}`)
//     })// mongoose.connect()

//use parsing middleware, to set the application. This is to ensure that everything in the application works with no errors
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())

//importing routes
const userRoutes = require('./routes/userRoutes')

//using routes
app.use('/api',userRoutes)

//starting the server
app.listen(port, () => {
    console.log(`first listen on ${port}`)
})