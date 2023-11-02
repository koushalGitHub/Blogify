// const {Schema , Model} = require('mongoose')
const mongoose = require('mongoose')
const { createHmac , randomBytes} = require('node:crypto');
const { createTokenForUser } = require('../services/authentication');

const usersSchema =  mongoose.Schema({
    fullName :{
        type : String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    salt:{   /// for has password
        type:String,
        // required:true
    },
    password:{
        type:String,
        required:true
    },
    profileImageURL:{
        type:String,
        default:"/images/default.jpg",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true});

usersSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();      // now salt is random string with 16 character size
    // const salt = "someRandom";  
    const hashedPassword = createHmac('sha256',salt)                 // " sha256 "   is a algothrim
                           .update(user.password) 
                           .digest("hex");
    
    this.salt = salt;
    this.password = hashedPassword;

    next()
});
usersSchema.static('matchPasswordAndGenrateToken',async function(email,password){
    const user = await this.findOne({ email });
    
    if(!user) throw new Error('User Not found..');
    const salt = user.salt;
    const hashedPassword = user.password    
    const userProvidedHash = createHmac('sha256',salt)                 // " sha256 "   is a algothrim
    .update(password) 
    .digest("hex");    
    // return hashedPassword === userProvidedHash;
    if(hashedPassword !== userProvidedHash) throw new Error('incorrect password')
    const token = await createTokenForUser(user);
    // console.log(token);return;
  return token;
    // return user;
});
const User =  mongoose.model('user',usersSchema);

module.exports = User;