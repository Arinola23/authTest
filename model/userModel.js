//defines how the users view should be displayed
const mongoose = require('mongoose');
const crypto = require('crypto');
// const {v1: uuidv1} = require('uuid')

const userSchema = new mongoose.Schema({
    firstname:{
        type: String,
        required: true, //this allows the data to be stored in mongodb database
        maxlength:32,
        trim: true, //helps to trim properties that are not required and takes space in the database.
    },
    lastname:{
        type:String,
        //required: true, LASTNAME NOT MANDATORY//this allows the data to be stored in mongodb database
        maxlength:32,
        trim: true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
        unique:true,
    },
    userPassword:{
        type:String,
        required:true,

    },
 //encrypting password before storing in the database is important using salt
    salt: String,
},{timestamp: true})

//usersAuthentication
 //creating a virtual password using useSchema using the setter and getter  functions
 //this is included to aviod errors and be specific
userSchema.virtual("password")
    .set(function (password) {
        this._password = password;
        this.salt = crypto.randomBytes(16).toString('hex');
        this.userPassword = this.hashPassword(password);

    })
    .get(function () {
        return this.userPassword
    })

    //passing the methods to the userSchema 1) authenticate, the plainpassword is generated in the database
    userSchema.methods = {
        authenticate: function (plainpassword) {
            return this.hashPassword(plainpassword) === this.userPassword
        },
        //it checks if the plainpassword is 
        //secure password will create an encrypted password of your password
        hashPassword: function(plainpassword) {         
            if(!plainpassword) return ""
            //return crpyto, crypto is a hashing method
            try {
                return crypto
                .pbkdf2Sync(plainpassword,this.salt,1000, 64, 'sha512').toString('hex')
            } catch (e) {
                return ""
            }
        } 
    }
const User = mongoose.model('User',userSchema)
module.exports = User
//  const Users = mongoose.model('User', userSchema)
//  module.exports = Users