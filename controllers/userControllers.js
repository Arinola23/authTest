const User = require('../model/userModel')
const crypto = require('crypto');
const {validationResult} = require('express-validator')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken');
// const { ReplyTwoTone } = require('@material-ui/icons');
// const cookie = require('cookie-parser')

const signUp = asyncHandler(async(req,res) => {
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){ //if the errors(request) is empty, return 400
            return res.status(400).json({
                error: errors.array()[0].msg  //the first error message from the routes check, including the msg, if there is any error, the remany function wont run.
            })
        }
        //creating new user 
        // const user = new User(req.body)
        const{firstname, lastname, email,userPassword} = req.body
        if(!firstname || !lastname || !email || !userPassword) {
            return res.status(400).json({message:'All fields must be filled'})
        }
        //check if the user exists
        const existingUser = await User.findOne({email})
            if(existingUser){
                return res.status(400).json({message:'user already exists'}) 
            }
        //for hashing password
        // const hashedPassword = await crypto.hash(password,12)
        //     if(!hashedPassword){
        //         res.status(400).json({message: 'password should be greater than or equals to 12 characters'})
        //     }
        const newUser = await User.create({
            firstname,
            lastname,
            email,
            userPassword, //: hashedPassword,
            // role: 'user'
        })
            //save the created user
        await newUser.save()
        res.status(200).json({message: 'success', newUser})
    } catch(error) {
        res.status(500).json({error: error})
        console.error(error)
    }
})

const signIn = asyncHandler(async(req, res) =>{
      try{
        const {email, password} = req.body
        if(email && password){
            return res.status(400).json({message:'All fields must be filled'})
        }
        const user = await User.findOne({email})
            if(user){
                return res.status(400).json({message:'user already exists'}) 
            }
        //authenticate user
        if(!user.authenticate){
            return res.status(400).json({error: 'email and  password do not match'})
        }
        //create token if the password was succesful
        const token = jwt.sign({_id: user._id},process.env.SECRET) //sign is an inbuilt function that does a function that converts the jwt and generates the token.  but first pass the user id, which is the only way a  token can be generated and verified.
       // puting the token in cookie
            res.cookie('token', token, {expires:new Date() +1 }) //it will create a token that will expire in one day, 24hrs
            //send response to the frontend, destructing the user
       const {_id, firstname, lastname} = user
           return res.json({
            token,
            user: {
                _id, firstname, lastname
            }
        })
    } catch(error) {}
})
 module.exports ={signUp, signIn}
//     exports.signUp = (req,res) => {
//     const user = new User(req.body)
//     user.save((err,user) => {
//         if(err) {
//          return res.status(400)
//         .json({error: err}) 
//         }
//         res.status(200)
//         .json({message: 'success', user})
//     })
// }