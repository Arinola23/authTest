//creating signup routes

const express = require('express');
//initialize routes in express
const router = express.Router()
const {signUp, signIn} = require('../controllers/userControllers')
//signup validator
const {check} = require('express-validator')
//creating router
router.post('/signup',[
    //this array of function is the validator
    check("firstname", 'firstname should be lese than 7 characters').isLength({max:6}),
    check("lastname", 'lastname should be more than 2 characters'). isLength({max:32}),
    check("email", 'email should be valid').isEmail(),
    check("password", 'password should be atleast 12').isLength({max:12})

], signUp)
router.post('/signin', signIn)

module.exports = router