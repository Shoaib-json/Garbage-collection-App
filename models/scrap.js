const mongoose = require('mongoose');
const User = require("./user");


const scrapSchema = new mongoose.Schema ({
    category :{
        type : String,
        require : true
    },
    price : {
        type :  Number,
        require : true 
    },
    weight :{
        type : Number
    },
    createdAt :{
        type : Date,
        default  : Date.now
    },
    user : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            }
        ]
});

const Scrap = new mongoose.model('Scrap' , scrapSchema);

module.exports = Scrap;