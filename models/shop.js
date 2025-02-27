const mongoose = require("mongoose");
const User = require('./user');
const Address = require('./address')

const shopSchema = new mongoose.Schema({
    caption :{
        type : String,
        required : true
    },
    description:{
        type :String,
        required : true
    },
    image :[{
        url:{type:String},
        filename:{type : String , default : "image1 "}
    }],
    user: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }]

});

const Shop = new mongoose.model('Shop' , shopSchema);
module.exports = Shop;