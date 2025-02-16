const mongoose = require("mongoose");
const User = require("./user");

const communitySchema = new mongoose.Schema({
    caption: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            default: 'wtf'
        }
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            
        },
        comment: {
            type: String,
            
        }
    }]
}, { timestamps: true });

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
