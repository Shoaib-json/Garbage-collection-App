const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
  caption: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    required: true,
    default: "General"
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  image: [
    {
      url: String,
      filename: String
    }
  ],
  user: {
    // Reference to a User model if you have user accounts
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Shop', ShopSchema);
