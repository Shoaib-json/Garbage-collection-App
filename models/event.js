const mongoose = require('mongoose');
const User = require('./user');


const eventSchema = mongoose.Schema({
    address :  {
        city : {type : String , require : true},
        country : {type : String , require : true},
        place : {type : String , require : true}
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    description :{
        type : String,
        require : true
    },
    date : {
        type : Date,
        require : true 
    },
    poster :{
        url : {type : String , required: true},
        filename : {type: String , default : "poster101" , required : true}
    },
    name : {
        type : String ,
        default : "Event",
        require : true
    },
    enroll: {
        type: [{
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          }
        }],
        default: [] // Initialize as empty array by default
      }
});

const Event = new mongoose.model('Event' , eventSchema);

module.exports = Event;