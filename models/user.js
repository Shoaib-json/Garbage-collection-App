const mongoose = require('mongoose');
const Address = require('./address')
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        maxLength:50,
        required : true
    },
    address : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Address"
        }
    ],
   createAt :{
    type : Date,
    default : Date.now
   }
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model('User',userSchema);


module.exports = User;
