const mongoose  = require("mongoose");

const addSchema  = new mongoose.Schema ({
    city :{
        type : String,
        require : true 
    },
    street :{
        type : String ,
        require : true 
    },
    pincode :{
        type:Number,
        require : true 
    },
    houseNo:{
        type : String
    },
    phoneNum :{
        type : Number,
        
    }

});
 
const Address = new mongoose.model('Address' , addSchema);
module.exports = Address;