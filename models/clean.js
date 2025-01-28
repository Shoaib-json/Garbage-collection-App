const mongoose = require("mongoose");
const User = require("./user");

const cleanSchema = new mongoose.Schema({
    service :{
        type:String,
        require : true
    },
    date : {
        type : Date ,
        require : true,
    },
    time : {
        type : String,
    },
    createdAt :{
        type : Date,
        default : Date.now
    },
    user : [
                {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "User"
                }
            ]
});

const Clean = new mongoose.model("Clean" , cleanSchema);
module.exports = Clean;